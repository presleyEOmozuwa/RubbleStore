data "aws_eks_cluster_auth" "ekscluster"{
   name = "ekscluster"
}

provider "kubernetes" {
  host                   = var.eks_cluster_host
  token                  = data.aws_eks_cluster_auth.ekscluster.token
  cluster_ca_certificate = base64decode(var.eks_cluster_ca)
}



// REACT APP RESOURCE
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
          name = "react-app"
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

// REACT SERVICE
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
    type = "LoadBalancer"
  }
}

// Node APP RESOURCE
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
          name = "node-app"
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

// NODE SERVICE
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
    type = "LoadBalancer"
  }
}

// INGRESS ROUTING RULES
resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name = "app-ingress"
    namespace = "default"
    annotations = {
      "alb.ingress.kubernetes.io/scheme" = "internet-facing"
      "alb.ingress.kubernetes.io/listen-ports" = jsonencode([{"HTTP": 80}, {"HTTPS": 443}])
    }
  }

  spec {
    rule {
      host = "example.com"  # Replace with your domain
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
