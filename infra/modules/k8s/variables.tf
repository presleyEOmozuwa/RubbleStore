variable "use_eks" {
  type    = bool
  default = false 
}

variable "account_id" {
   type = string
}

variable "owner_id" {
   type = string
}

variable "vpc_id" {
   type = string
}

variable "subnet_ids" {
   type = list(string)
}

variable "security_groups" {
   type = list(string)
}


variable "eks_cluster_ca" {
   type = string
}

variable "eks_cluster_host" {
   type = string
}

variable "eks_cluster_identifier" {
   type = string
}

variable "imgUrl_react" {
   type = string
}

variable "imgUrl_node" {
   type = string
}


variable "oidc_url" {
   type = string
}


