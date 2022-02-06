resource "google_storage_bucket" "terraform-backend" {
  name     = "devxp_terraform_backend"
  location = var.gcr_location
}
