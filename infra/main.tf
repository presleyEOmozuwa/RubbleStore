terraform {
  backend "s3" {
    bucket = "presley-bucket"
    region = "us-east-1"
    key = "terraform.tfstate"
  }
}

module "vpc" {
  source = "./modules/vpc"
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
   
  public_subnet_tags_1 = {
    Name = "public-subnet_1"
  }
   public_subnet_tags_2 = {
    Name = "public-subnet_2"
  }
  
}

module "eks" {
  source = "./modules/eks"
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.subnet_ids
  aws_alb_controller = "alb_controller"
  client_name = "react_app"
  server_name = "node_app"
  eks_cluster_name = "ekscluster"
}

module "k8s" {
  source = "./modules/k8s"
  subnet_ids = module.vpc.subnet_ids
  account_id = module.vpc.account_id
  security_groups = module.vpc.security_groups
  # eks_cluster_ca = module.eks.eks_cluster_ca
  # eks_cluster_host = module.eks.eks_cluster_host
  imgUrl_react = module.eks.ecr_react_repo
  imgUrl_node = module.eks.ecr_node_repo
}