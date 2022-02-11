
terraform {
  required_providers {
    google = {
      version = "<= 4.10.0"
      source  = "hashicorp/google"
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
