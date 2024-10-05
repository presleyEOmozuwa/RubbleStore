output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_ids" {
   value = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "owner_id" {
   value = aws_vpc.main.owner_id
}

output "security_groups" {
   value = [aws_security_group.alb_sg.id]
}
