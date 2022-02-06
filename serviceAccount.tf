
resource "google_service_account" "service_account" {
  account_id   = var.gc_service_id
  display_name = "Terraform Service Account"
}

resource "google_cloud_run_service_iam_member" "policy" {
  location = google_cloud_run_service.devxp_deployment.location
  project  = google_cloud_run_service.devxp_deployment.project
  service  = google_cloud_run_service.devxp_deployment.name
  member   = format("serviceAccount:%s", google_service_account.service_account.email)
  role     = "roles/viewer"
}
