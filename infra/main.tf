terraform {
  backend "s3" {
    bucket = "presley-bucket"
    region = "us-east-1"
    key = "terraform.tfstate"
  }
}

module "vpc" {
  source = "modules/vpc"
  region = "us-east-1"
  vpc_tags = {
    Name = "admin-vpc"
  }
  igw_tags = {
    Name = "rubbles-igw"
  }
  rt_tags = {
    Name = "rubbles-rt"
  }
   sg_tags = {
    Name = "rubbles-sg"
  }
  public_subnet_tags_1 = {
    Name = "public-subnet_1"
  }
   public_subnet_tags_2 = {
    Name = "public-subnet_2"
  }

}

module "eks" {
  source = "modules/eks"
  subnet_ids = module.vpc.subnet_ids
  client_name = "react_app"
  server_name = "node_app"
  eks_cluster_name = "ekscluster"
}

module "k8s" {
  source = "modules/k8s"
  eks_cluster_ca = module.eks.eks_cluster_ca
  eks_cluster_host = module.eks.eks_cluster_host
  imgUrl_react = module.eks.ecr_react_repo
  imgUrl_node = module.eks.ecr_node_repo
}