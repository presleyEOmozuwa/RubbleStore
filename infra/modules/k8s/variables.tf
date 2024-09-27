variable "use_eks" {
  type    = bool
  default = false 
}

# variable "eks_oidc_url" {
#   default = substr(data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer, 8) # Remove 'https://'
# }

variable "account_id" {
   type = string
}

variable "vpc_id" {
  type = string
}

variable "eks_cluster_ca" {
   type = string
}

variable "eks_cluster_host" {
   type = string
}

variable "imgUrl_react" {
   type = string
}

variable "imgUrl_node" {
   type = string
}



