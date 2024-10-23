provider "aws" {
  region = var.region
}

// resource 1
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  instance_tenancy     = "default"
  tags                 = var.vpc_tags
}

// resource 2
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags                    = {
     Name = "public-subnet_1"
     "kubernetes.io/role/elb"  = "1"
  }
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  tags                    = {
     Name = "public-subnet_2"
     "kubernetes.io/role/elb"  = "1"
  }
  availability_zone       = "us-east-1b"
}


// resource 3
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = var.igw_tags
}

// resource 4
resource "aws_route_table" "routetable" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = var.rt_tags
}

// resource 5
resource "aws_route_table_association" "rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.routetable.id
}

resource "aws_route_table_association" "rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.routetable.id
}

// ALB LOAD BALANCER SECURITY GROUPS
resource "aws_security_group" "alb_sg" {
  vpc_id = aws_vpc.main.id
  name   = "alb_sg"
  tags = {
     Name = "alb_sg"
  }

  # Allow traffic from the internet (port 80 for HTTP, 443 for HTTPS)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outgoing traffic from ALB
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// REACT APP SECURITY GROUPS
resource "aws_security_group" "react_sg" {
  vpc_id = aws_vpc.main.id
  name   = "react_sg"
  tags = {
     Name = "react_sg"
  }

  # Allow traffic from ALB to React app (on port 3000)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = [aws_security_group.alb_sg.id]  # Allow only ALB to talk to React
  }

  # Outgoing traffic from React (to the internet, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// NODE APP SECURITY GROUPS
resource "aws_security_group" "node_sg" {
  vpc_id = aws_vpc.main.id
  name   = "node_sg"
  tags = {
     Name = "node_sg"
  }

  # Allow traffic from ALB to Node app (on port 5000)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    security_groups = [aws_security_group.alb_sg.id]  # Allow only ALB to talk to Node.js
  }

  # Outgoing traffic from Node.js (to the internet, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
















