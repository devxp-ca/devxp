resource "google_service_account" "service_account" {
  account_id   = var.gc_service_id
  display_name = "Terraform Service Account"
}
