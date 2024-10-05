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













