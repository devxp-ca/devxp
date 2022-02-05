resource "google_service_account" "service_account" {
  account_id   = var.gc_service_id
  display_name = "Terraform Service Account"
}

data "google_iam_policy" "admin" {
  binding {
    role = "roles/viewer"
    members = [
      format("serviceAccount:%s", google_service_account.service_account.email)
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "policy" {
  location    = google_cloud_run_service.devxp_deployment.location
  project     = google_cloud_run_service.devxp_deployment.project
  service     = google_cloud_run_service.devxp_deployment.name
  policy_data = data.google_iam_policy.admin.policy_data
}

resource "google_cloud_run_service_iam_binding" "binding" {
  location = google_cloud_run_service.devxp_deployment.location
  project  = google_cloud_run_service.devxp_deployment.project
  service  = google_cloud_run_service.devxp_deployment.name
  role     = "roles/viewer"
  members = [
    format("serviceAccount:%s", google_service_account.service_account.email)
  ]
}

resource "google_cloud_run_service_iam_member" "member" {
  location = google_cloud_run_service.devxp_deployment.location
  project  = google_cloud_run_service.devxp_deployment.project
  service  = google_cloud_run_service.devxp_deployment.name
  role     = "roles/viewer"
  member   = format("serviceAccount:%s", google_service_account.service_account.email)
}
