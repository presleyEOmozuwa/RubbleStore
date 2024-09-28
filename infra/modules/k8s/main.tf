# Define the EKS cluster and Kubernetes provider
data "aws_eks_cluster" "ekscluster" {
  name = "ekscluster"
}

data "aws_eks_cluster_auth" "ekscluster" {
  name = "ekscluster"
}


provider "kubernetes" {
  host                   = var.eks_cluster_host
  token                  = data.aws_eks_cluster_auth.ekscluster.token
  cluster_ca_certificate = base64decode(var.eks_cluster_ca)
}

# Create IAM role for AWS Load Balancer Controller
resource "aws_iam_role" "eks_alb_role" {
  name = "eks-alb-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.account_id}:oidc-provider/${data.aws_eks_cluster.ekscluster.identity[0].oidc[0].issuer}"
        }
        Condition = {
          "StringEquals" = {
            "${data.aws_eks_cluster.ekscluster.identity[0].oidc[0].issuer}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
          }
        }

      }
    ]
  })
}

# Attach policies to the IAM role
resource "aws_iam_role_policy_attachment" "eks_alb_policy_attach" {
  role       = aws_iam_role.eks_alb_role.name
  policy_arn = "arn:aws:iam::${var.account_id}:policy/RubblesAWSLoadBalancerControllerIAMPolicy"
}

# Create Kubernetes service account for the AWS Load Balancer Controller
resource "kubernetes_service_account" "aws_lb_controller_sa" {
  metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"
  }
  automount_service_account_token = true
}

# Associate the IAM role with the Kubernetes service account
resource "aws_iam_role_policy_attachment" "eks_alb_policy" {
  role   = aws_iam_role.eks_alb_role.id
  policy_arn = "arn:aws:iam::${var.account_id}:policy/RubblesAWSLoadBalancerControllerIAMPolicy"
}


# Install AWS Load Balancer Controller using Helm provider
provider "helm" {
  kubernetes {
    host                   = var.eks_cluster_host
    token                  = data.aws_eks_cluster_auth.ekscluster.token
    cluster_ca_certificate = base64decode(var.eks_cluster_ca)
  }
}

resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  chart      = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  namespace  = "kube-system"

  set {
    name  = "clusterName"
    value = data.aws_eks_cluster.ekscluster.name
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = kubernetes_service_account.aws_lb_controller_sa.metadata[0].name
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
    name  = "image.repository"
    value = "602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller"
  }
}

# --- EXISTING APP CONFIGURATIONS ---

# REACT APP RESOURCE
resource "kubernetes_deployment" "react_app" {
  metadata {
    name = "react-app"
    labels = {
      App = "react-app"
    }
  }

  spec {
    replicas = 2
    selector {
      match_labels = {
        App = "react-app"
      }
    }
    template {
      metadata {
        labels = {
          App = "react-app"
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
      App = "node-app"
    }
  }

  spec {
    replicas = 2
    selector {
      match_labels = {
        App = "node-app"
      }
    }
    template {
      metadata {
        labels = {
          App = "node-app"
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

# INGRESS ROUTING RULES
resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name      = "app-ingress"
    namespace = "default"
    annotations = {
      "alb.ingress.kubernetes.io/scheme"       = "internet-facing"
      "alb.ingress.kubernetes.io/listen-ports" = jsonencode([{ "HTTP" : 80 }, { "HTTPS" : 443 }])
    }
  }

  spec {
    rule {
      host = "example.com" # Replace with your domain
      http {
        path {
          path = "/api*"
          backend {
            service {
              name = kubernetes_service.node_app.metadata.0.name
              port {
                number = kubernetes_service.node_app.spec.0.port.0.port
              }
            }
          }
        }

        path {
          path = "/*"
          backend {
            service {
              name = kubernetes_service.react_app.metadata.0.name
              port {
                number = kubernetes_service.react_app.spec.0.port.0.port
              }
            }
          }
        }
      }
    }
  }
}
