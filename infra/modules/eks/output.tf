output "eks_cluster_ca" {
   value = aws_eks_cluster.ekscluster.certificate_authority[0].data
}

output "eks_cluster_host" {
   value = aws_eks_cluster.ekscluster.endpoint
}

output "eks_cluster_identifier" {
  value = aws_eks_cluster.ekscluster.name
}

output "ecr_react_repo" {
  value = aws_ecr_repository.react_app.repository_url
}

output "ecr_node_repo" {
  value = aws_ecr_repository.node_app.repository_url
}

output "oidc_url" {
  value = aws_eks_cluster.ekscluster.identity[0].oidc[0].issuer
}



