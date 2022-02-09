
terraform {
  required_providers {
    google = {
      version = ">= 2.3"
      source = "hashicorp/gcs"
    }
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
