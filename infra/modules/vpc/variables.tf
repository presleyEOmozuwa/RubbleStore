variable "region" {
    type = string
}

variable "vpc_tags" {
   type = object({
     Name = string
   })
}

variable "igw_tags" {
   type = object({
     Name = string
   })
}

variable "rt_tags" {
   type = object({
     Name = string
   })
}


