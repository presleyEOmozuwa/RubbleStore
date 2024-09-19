variable "use_eks" {
  type    = bool
  default = false 
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



