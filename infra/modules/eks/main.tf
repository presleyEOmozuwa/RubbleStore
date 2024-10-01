# ECR REPOSITORY FOR REACT APP
resource "aws_ecr_repository" "react_app" {
  name                 = var.client_name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECR REPOSITORY FOR NODE APP
resource "aws_ecr_repository" "node_app" {
  name                 = var.server_name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

# IAM ROLE FOR EKS CLUSTER
resource "aws_iam_role" "eksrole" {
  name = "eksrole"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "eks.amazonaws.com",
        },
        Action = "sts:AssumeRole",
      },
    ],
    Version = "2012-10-17"
  })
}

// I AM ROLE FOR WORKER NODE
resource "aws_iam_role" "noderole" {
  name = "noderole"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com",
        },
        Action = "sts:AssumeRole",
      },
    ],
    Version = "2012-10-17"
  })
}

// ATTACH EKS CLUSTER ROLE TO AmazonEKSWorkerNodePolicy
resource "aws_iam_role_policy_attachment" "noderole-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.noderole.name
}

// ATTACH WORKER NODE ROLE TO AMAZONEC2ContainerRegistryReadOnly
resource "aws_iam_role_policy_attachment" "noderole-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.noderole.name
}

// ATTACH WORKER NODE ROLE TO AmazonEKS_CNI_Policy
resource "aws_iam_role_policy_attachment" "noderole-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.noderole.name
}

// ATTACH EKS CLUSTER ROLE TO AmazonEKSClusterPolicy
resource "aws_iam_role_policy_attachment" "eksrole-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eksrole.name
}

// ATTACH EKS CLUSTER ROLE TO AmazonEKSVPCResourceController POLICY
resource "aws_iam_role_policy_attachment" "eksrole-AmazonEKSVPCResourceController" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eksrole.name
}


# CREATE EKS CLUSTER
resource "aws_eks_cluster" "ekscluster" {
  name     = var.eks_cluster_name
  role_arn = aws_iam_role.eksrole.arn
  vpc_config {
    subnet_ids = var.subnet_ids
  }
  depends_on = [
    aws_iam_role_policy_attachment.eksrole-AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.eksrole-AmazonEKSVPCResourceController,
  ]
}

// SET UP EKS CLUSTER NODE GROUP
resource "aws_eks_node_group" "nodegroup" {
  cluster_name    = aws_eks_cluster.ekscluster.name
  node_group_name = "nodegroup"
  node_role_arn   = aws_iam_role.noderole.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 2
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.noderole-AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.noderole-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.noderole-AmazonEKSWorkerNodePolicy,
  ]

}

// Fetch OIDC URL from the EKS Cluster
data "aws_eks_cluster_auth" "ekscluster" {
    name = var.eks_cluster_name
}

data "tls_certificate" "cert" {
  url = aws_eks_cluster.ekscluster.identity[0].oidc[0].issuer
}

// Create OIDC Provider 
resource "aws_iam_openid_connect_provider" "oidc" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.cert.certificates[0].sha1_fingerprint]
  url             = data.tls_certificate.cert.url
}

//  Define the Permission Document
data "aws_iam_policy_document" "example_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.oidc.url, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:${var.aws_alb_controller}"]
    }

    principals {
      identifiers = [aws_iam_openid_connect_provider.oidc.arn]
      type        = "Federated"
    }
  }
}

// Create the IAM Role
resource "aws_iam_role" "alb_controller" {
  assume_role_policy = data.aws_iam_policy_document.example_assume_role_policy.json
  name               = "alb_controller"
}

// SET UP KUBERNETES
provider "kubernetes" {
  host                   = aws_eks_cluster.ekscluster.endpoint
  token                  = data.aws_eks_cluster_auth.ekscluster.token
  cluster_ca_certificate = base64decode(aws_eks_cluster.ekscluster.certificate_authority[0].data)
}

#  SET UP HELM PROVIDER
provider "helm" {
  kubernetes {
    host                   = aws_eks_cluster.ekscluster.endpoint
    token                  = data.aws_eks_cluster_auth.ekscluster.token
    cluster_ca_certificate = base64decode(aws_eks_cluster.ekscluster.certificate_authority[0].data)
  }
}

// Install AWS Load Balancer Controller
resource "helm_release" "proxy-controller" {
  name       = "aws-load-balancer-controller"
  chart      = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  namespace  = "kube-system"

  set {
    name  = "clusterName"
    value = "ekscluster"
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "alb-controller"
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
    value = "602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/proxy-controller"
  }
}









