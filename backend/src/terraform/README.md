```ts
import {testToFileAws} from "./util";
import {Ec2} from "./terraform/ec2";
import {AwsVpc} from "./terraform/awsVpc";
import {AwsSecurityGroup} from "./terraform/AwsSecurityGroup";

const vpc = "my_vpc_for_devxp";
const securityGroup = "securitygroup_for_devp";
const cidr = "10.0.0.0/24";

testToFileAws("/home/brennan/aws_test/devxp.tf", [
	new Ec2(
		"AUTO_UBUNTU",
		"t2.medium",
		"myinstance",
		false,
		2,
		`${vpc}_subnet`,
		securityGroup
	),
	new AwsVpc(cidr, true, vpc),
	new AwsSecurityGroup(securityGroup, vpc, [
		{
			type: "ingress",
			from_port: 433,
			to_port: 433,
			protocol: "tcp",
			cidr_blocks: [cidr]
		},
		{
			type: "ingress",
			from_port: 80,
			to_port: 80,
			protocol: "tcp",
			cidr_blocks: [cidr]
		},
		{
			type: "egress",
			from_port: 0,
			to_port: 0,
			protocol: "-1",
			cidr_blocks: ["0.0.0.0/0"]
		}
	])
]);
```


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
