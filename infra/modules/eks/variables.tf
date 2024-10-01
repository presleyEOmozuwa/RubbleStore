variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
   type = list(string)
}

variable "aws_alb_controller" {
   type = string
}

variable "client_name" {
   type = string
}

variable "server_name" {
   type = string
}

variable "eks_cluster_name" {
   type = string
}







