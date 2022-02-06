
terraform {
  required_providers {
    google = ">= 3.3"
  }
  backend "gcs" {
    bucket = "devxp_terraform_backend"
    prefix = "terraform/state"
  }

}
provider "google" {
  alias = "impersonation"
  scopes = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/userinfo.email",
  ]
}


provider "google" {
  project = var.gc_project_id
  region  = var.gcr_location
  zone    = var.gcr_zone
}
