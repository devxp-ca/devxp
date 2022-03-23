terraform {
  required_providers {
    aws =  {
    source = "hashicorp/aws"
    version = ">= 2.7.0"
    }
  }
}

provider "aws" {
    region = "us-west-2"
}

resource "aws_s3_bucket" "terraform_backend_bucket" {
      bucket = "terraform-state-03w0sy3wejfemx92t9rwp5jsvksivcewixpdtsccukalg"
}

resource "aws_instance" "Instance-ARqF" {
      ami = data.aws_ami.amazon_latest.id
      instance_type = "t2.micro"
      lifecycle {
        ignore_changes = [ami]
      }
      subnet_id = aws_subnet.devxp_vpc_subnet_public0.id
      associate_public_ip_address = true
      vpc_security_group_ids = [aws_security_group.devxp_security_group.id]
      iam_instance_profile = aws_iam_instance_profile.Instance-ARqF_iam_role_instance_profile.name
}

resource "aws_eip" "Instance-ARqF_eip" {
      instance = aws_instance.Instance-ARqF.id
      vpc = true
}

resource "aws_s3_bucket" "Bucket-olyu-sTDV-DGiq-crFo-vQQT" {
      bucket = "Bucket-olyu-sTDV-DGiq-crFo-vQQT"
}

resource "aws_s3_bucket_public_access_block" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_access" {
      bucket = aws_s3_bucket.Bucket-olyu-sTDV-DGiq-crFo-vQQT.id
      block_public_acls = true
      block_public_policy = true
}

resource "aws_iam_user" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam" {
      name = "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam"
}

resource "aws_iam_user_policy_attachment" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy_attachment0" {
      user = aws_iam_user.Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam.name
      policy_arn = aws_iam_policy.Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy0.arn
}

resource "aws_iam_policy" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy0" {
      name = "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy0"
      path = "/"
      policy = data.aws_iam_policy_document.Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy_document.json
}

resource "aws_iam_access_key" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_access_key" {
      user = aws_iam_user.Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam.name
}

resource "aws_sns_topic" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_sns_topic" {
      name = "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_sns_topic"
}

resource "aws_glacier_vault" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV" {
      name = "Glacier-mtdR-VVVI-obyO-mUDG-LSUV"
      notification {
        sns_topic = aws_sns_topic.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_sns_topic.arn
        events = ["ArchiveRetrievalCompleted", "InventoryRetrievalCompleted"]
      }
}

resource "aws_iam_user" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam" {
      name = "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam"
}

resource "aws_iam_user_policy_attachment" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy_attachment0" {
      user = aws_iam_user.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam.name
      policy_arn = aws_iam_policy.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy0.arn
}

resource "aws_iam_policy" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy0" {
      name = "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy0"
      path = "/"
      policy = data.aws_iam_policy_document.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy_document.json
}

resource "aws_iam_access_key" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_access_key" {
      user = aws_iam_user.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam.name
}

resource "aws_dynamodb_table" "DynamoDb-Azcw" {
      name = "DynamoDb-Azcw"
      hash_key = "username"
      billing_mode = "PAY_PER_REQUEST"
      ttl {
        attribute_name = "TimeToExist"
        enabled = true
      }
      attribute {
        name = "username"
        type = "S"
        _id = "623a37da0a84cbbcdeba62ba"
      }
}

resource "aws_iam_user" "DynamoDb-Azcw_iam" {
      name = "DynamoDb-Azcw_iam"
}

resource "aws_iam_user_policy_attachment" "DynamoDb-Azcw_iam_policy_attachment0" {
      user = aws_iam_user.DynamoDb-Azcw_iam.name
      policy_arn = aws_iam_policy.DynamoDb-Azcw_iam_policy0.arn
}

resource "aws_iam_policy" "DynamoDb-Azcw_iam_policy0" {
      name = "DynamoDb-Azcw_iam_policy0"
      path = "/"
      policy = data.aws_iam_policy_document.DynamoDb-Azcw_iam_policy_document.json
}

resource "aws_iam_access_key" "DynamoDb-Azcw_iam_access_key" {
      user = aws_iam_user.DynamoDb-Azcw_iam.name
}

resource "aws_iam_instance_profile" "Instance-ARqF_iam_role_instance_profile" {
      name = "Instance-ARqF_iam_role_instance_profile"
      role = aws_iam_role.Instance-ARqF_iam_role.name
}

resource "aws_iam_role" "Instance-ARqF_iam_role" {
      name = "Instance-ARqF_iam_role"
      assume_role_policy = "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Action\": \"sts:AssumeRole\",\n      \"Principal\": {\n        \"Service\": \"ec2.amazonaws.com\"\n      },\n      \"Effect\": \"Allow\",\n      \"Sid\": \"\"\n    }\n  ]\n}"
}

resource "aws_iam_role_policy_attachment" "Instance-ARqF_iam_role_Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy0_attachment" {
      policy_arn = aws_iam_policy.Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy0.arn
      role = aws_iam_role.Instance-ARqF_iam_role.name
}

resource "aws_iam_role_policy_attachment" "Instance-ARqF_iam_role_Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy0_attachment" {
      policy_arn = aws_iam_policy.Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy0.arn
      role = aws_iam_role.Instance-ARqF_iam_role.name
}

resource "aws_iam_role_policy_attachment" "Instance-ARqF_iam_role_DynamoDb-Azcw_iam_policy0_attachment" {
      policy_arn = aws_iam_policy.DynamoDb-Azcw_iam_policy0.arn
      role = aws_iam_role.Instance-ARqF_iam_role.name
}

resource "aws_subnet" "devxp_vpc_subnet_public0" {
      vpc_id = aws_vpc.devxp_vpc.id
      cidr_block = "10.0.0.0/25"
      map_public_ip_on_launch = true
      availability_zone = "us-west-2a"
}

resource "aws_subnet" "devxp_vpc_subnet_public1" {
      vpc_id = aws_vpc.devxp_vpc.id
      cidr_block = "10.0.128.0/25"
      map_public_ip_on_launch = true
      availability_zone = "us-west-2b"
}

resource "aws_internet_gateway" "devxp_vpc_internetgateway" {
      vpc_id = aws_vpc.devxp_vpc.id
}

resource "aws_route_table" "devxp_vpc_routetable_pub" {
      route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.devxp_vpc_internetgateway.id
      }
      vpc_id = aws_vpc.devxp_vpc.id
}

resource "aws_route" "devxp_vpc_internet_route" {
      route_table_id = aws_route_table.devxp_vpc_routetable_pub.id
      destination_cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.devxp_vpc_internetgateway.id
}

resource "aws_route_table_association" "devxp_vpc_subnet_public_assoc" {
      subnet_id = aws_subnet.devxp_vpc_subnet_public0.id
      route_table_id = aws_route_table.devxp_vpc_routetable_pub.id
}

resource "aws_vpc" "devxp_vpc" {
      cidr_block = "10.0.0.0/16"
      enable_dns_support = true
      enable_dns_hostnames = true
}

resource "aws_security_group" "devxp_security_group" {
      vpc_id = aws_vpc.devxp_vpc.id
      name = "devxp_security_group"
      ingress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }
      egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }
}

data "aws_ami" "amazon_latest" {
      most_recent = true
      owners = ["585441382316"]
      filter {
        name = "name"
        values = ["*AmazonLinux*"]
      }
      filter {
        name = "virtualization-type"
        values = ["hvm"]
      }
}

data "aws_iam_policy_document" "Bucket-olyu-sTDV-DGiq-crFo-vQQT_iam_policy_document" {
      statement {
        actions = ["s3:ListAllMyBuckets"]
        effect = "Allow"
        resources = ["arn:aws:s3:::*"]
      }
      statement {
        actions = ["s3:*"]
        effect = "Allow"
        resources = [aws_s3_bucket.Bucket-olyu-sTDV-DGiq-crFo-vQQT.arn]
      }
}

data "aws_iam_policy_document" "Glacier-mtdR-VVVI-obyO-mUDG-LSUV_iam_policy_document" {
      statement {
        actions = ["glacier:InitiateJob", "glacier:GetJobOutput", "glacier:UploadArchive", "glacier:InitiateMultipartUpload", "glacier:AbortMultipartUpload", "glacier:CompleteMultipartUpload", "glacier:DescribeVault"]
        effect = "Allow"
        resources = [aws_glacier_vault.Glacier-mtdR-VVVI-obyO-mUDG-LSUV.arn]
      }
      statement {
        actions = ["glacier:ListVaults"]
        effect = "Allow"
        resources = ["*"]
      }
}

data "aws_iam_policy_document" "DynamoDb-Azcw_iam_policy_document" {
      statement {
        actions = ["dynamodb:DescribeTable", "dynamodb:Query", "dynamodb:Scan", "dynamodb:BatchGet*", "dynamodb:DescribeStream", "dynamodb:DescribeTable", "dynamodb:Get*", "dynamodb:Query", "dynamodb:Scan", "dynamodb:BatchWrite*", "dynamodb:CreateTable", "dynamodb:Delete*", "dynamodb:Update*", "dynamodb:PutItem"]
        effect = "Allow"
        resources = [aws_dynamodb_table.DynamoDb-Azcw.arn]
      }
      statement {
        actions = ["dynamodb:List*", "dynamodb:DescribeReservedCapacity*", "dynamodb:DescribeLimits", "dynamodb:DescribeTimeToLive"]
        effect = "Allow"
        resources = ["*"]
      }
}

