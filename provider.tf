
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
  project = var.gc_project_id
  region  = var.gcr_location
  zone    = var.gcr_zone
}
