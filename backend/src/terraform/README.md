```hcl

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
  project = "devxp",
  region  = "uswest-1"
}

resource "google_storage_bucket" "terraform-backend" {
  name     = "devxp_terraform_backend"
  location = "uswest-1"
}

```

should become:

```json
{
  "provider": [
    {
      "google": [
        {
          "project": "devxp",
          "region": "uswest-1"
        }
      ]
    }
  ],
  "resource": [
    {
      "google_storage_bucket": [
        {
          "terraform-backend": [
            {
              "location": "uswest-1",
              "name": "devxp_terraform_backend"
            }
          ]
        }
      ]
    }
  ],
  "terraform": [
    {
      "backend": [
        {
          "gcs": [
            {
              "bucket": "devxp_terraform_backend",
              "prefix": "terraform/state"
            }
          ]
        }
      ],
      "required_providers": [
        {
          "google": [
            {
              "source": "hashicorp/gcs",
              "version": "\u003e= 2.3"
            }
          ]
        }
      ]
    }
  ]
}
```

https://www.hcl2json.com/

```ts
console.log(
	JSON.stringify(
		rootBlock(
			new AwsProvider(
				"hashicorp/aws",
				">= 2.7.0",
				"uswest-1",
				"ACCESS_KEY",
				"SECRET_KEY"
			),
			new NamedAwsBackend(
				"UNIQUE_BUCKET_NAME",
				"terraform/state",
				"uswest-1"
			)
		),
		null,
		2
	)
);

console.log(
	JSON.stringify(
		rootBlock(
			new GoogleProvider(
				"hashicorp/gcs",
				">= 2.7.0",
				"devxp",
				"uswest-1"
			),
			new NamedGoogleBackend(
				"UNIQUE_BUCKET_NAME",
				"terraform/state",
				"uswest-1"
			)
		),
		null,
		2
	)
);
```