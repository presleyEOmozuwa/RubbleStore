data "aws_eks_cluster_auth" "ekscluster" {
  name = "ekscluster"
}

// SET UP KUBERNETES
provider "kubernetes" {
  host                   = var.eks_cluster_host
  cluster_ca_certificate = base64decode(var.eks_cluster_ca)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", var.eks_cluster_identifier]
    command     = "aws"
  }

}

# REACT APP RESOURCE
resource "kubernetes_deployment" "react_app" {
  metadata {
    name = "react-app"
    labels = {
      app = "react-app"
    }
  }

  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "react-app"
      }
    }
    template {
      metadata {
        labels = {
          app = "react-app"
        }
      }
      spec {
        container {
          name  = "react-app"
          image = var.imgUrl_react
          port {
            container_port = 3000
          }

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

# REACT SERVICE
resource "kubernetes_service" "react_app" {
  metadata {
    name = "react-service"
  }

  spec {
    selector = {
      app = "react-app"
    }
    port {
      port        = 3000
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

# Node APP RESOURCE
resource "kubernetes_deployment" "node_app" {
  metadata {
    name = "node-app"
    labels = {
      app = "node-app"
    }
  }

  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "node-app"
      }
    }
    template {
      metadata {
        labels = {
          app = "node-app"
        }
      }
      spec {
        container {
          name  = "node-app"
          image = var.imgUrl_node
          port {
            container_port = 5000
          }
          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}

# NODE SERVICE
resource "kubernetes_service" "node_app" {
  metadata {
    name = "node-service"
  }

  spec {
    selector = {
      app = "node-app"
    }
    port {
      port        = 5000
      target_port = 5000
    }
    type = "ClusterIP"
  }
}

data "tls_certificate" "cert" {
  url = var.oidc_url
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.cert.certificates[0].sha1_fingerprint]
  url             = data.tls_certificate.cert.url
}

data "aws_iam_policy_document" "alb_controller_assume_role_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:alb-controller"]
    }
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }
  }
}

resource "aws_iam_role" "alb_controller_role" {
  name               = "eks-alb-controller-role"
  assume_role_policy = data.aws_iam_policy_document.alb_controller_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "alb_controller_policy_attach" {
  role       = aws_iam_role.alb_controller_role.name
  policy_arn = "arn:aws:iam::${var.owner_id}:policy/AWSLoadBalancerControllerIAMPolicy"
}


resource "kubernetes_service_account" "alb_controller" {
  metadata {
    name      = "alb-controller"
    namespace = "kube-system"

    labels = {
      "app.kubernetes.io/managed-by" = "Helm"
    }

    annotations = {
      "meta.helm.sh/release-name"      = "aws-load-balancer-controller"
      "meta.helm.sh/release-namespace" = "kube-system"
      "eks.amazonaws.com/role-arn"     = aws_iam_role.alb_controller_role.arn
    }
  }
}



#  SET UP HELM PROVIDER
provider "helm" {
  kubernetes {
    host                   = var.eks_cluster_host
    cluster_ca_certificate = base64decode(var.eks_cluster_ca)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", var.eks_cluster_identifier]
      command     = "aws"
    }
  }
}


// Install AWS Load Balancer Controller
resource "helm_release" "alb-controller" {
  name       = "aws-load-balancer-controller"
  chart      = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  namespace  = "kube-system"
  version    = "1.4.7"
  timeout    = 600

  set {
    name  = "clusterName"
    value = "ekscluster"
  }

  set {
    name  = "serviceAccount.name"
    value = "alb-controller"
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "region"
    value = "us-east-1"
  }

  set {
    name  = "vpcId"
    value = var.vpc_id
  }

  set {
    name  = "serviceAccount.annotations.meta\\.helm\\.sh/release-name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "serviceAccount.annotations.meta\\.helm\\.sh/release-namespace"
    value = "kube-system"
  }

  set {
    name  = "serviceAccount.labels.app\\.kubernetes\\.io/managed-by"
    value = "Helm"
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = "arn:aws:iam::${var.owner_id}:role/alb-controller"
  }

  set {
    name  = "image.repository"
    value = "602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/aws-load-balancer-controller"
  }

}


# INGRESS ROUTING RULES
resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name      = "app-ingress"
    namespace = "default"
    annotations = {
      "kubernetes.io/ingress.class" : "alb"
      "alb.ingress.kubernetes.io/target-type" : "ip"
      "alb.ingress.kubernetes.io/scheme"       = "internet-facing"
      "alb.ingress.kubernetes.io/listen-ports" = jsonencode([{ "HTTP" : 80 }, { "HTTPS" : 443 }])
    }
  }

  spec {
    rule {
      http {
        path {
          path = "/"
          backend {
            service {
              name = kubernetes_service.react_app.metadata.0.name
              port {
                number = kubernetes_service.react_app.spec.0.port.0.port
              }
            }
          }
        }

        path {
          path = "/api"
          backend {
            service {
              name = kubernetes_service.node_app.metadata.0.name
              port {
                number = kubernetes_service.node_app.spec.0.port.0.port
              }
            }
          }
        }
      }
    }
  }
}


