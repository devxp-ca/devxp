variable "gc_project_id" {
  type    = string
  default = "devxp-339721"
}

variable "gcr_location" {
  type    = string
  default = "us-west1"
}

variable "gcr_zone" {
  type    = string
  default = "us-west1-a"
}

variable "gcr_name" {
  type    = string
  default = "devxp"
}

variable "gc_service_id" {
  type = string

  #Just a random ID for service email uniqueness, not a secret
  default = "xxwjroghqdcrbnbmmzrkydjynbvgxj"
}

variable "gcr_image_name" {
  type    = string
  default = "devxp"
}
variable "CONNECTION_STRING" {
  type      = string
  sensitive = true
}

variable "GITHUB_CLIENT_ID" {
  type      = string
  sensitive = true
}

variable "GITHUB_CLIENT_SECRET" {
  type      = string
  sensitive = true
}
