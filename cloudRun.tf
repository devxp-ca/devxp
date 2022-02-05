
resource "google_project_service" "run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = true
}

resource "google_cloud_run_service" "devxp_deployment" {
  name     = var.gcr_name
  location = var.gcr_location

  template {
    spec {
      containers {
        image = "gcr.io/${var.gc_project_id}/${var.gcr_image_name}"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
  autogenerate_revision_name = true

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]
}

resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.devxp_deployment.name
  location = google_cloud_run_service.devxp_deployment.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_service.devxp_deployment.status[0].url
}
