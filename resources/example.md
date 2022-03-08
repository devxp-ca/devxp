
### Google Example

```js
{
	tool: "terraform",
	repo: "devxp-ca/devxp-test-repo",
	settings: {
		provider: "google",
		project: "devxp-339721",	//NOTE: Required when provider is google
		resources: [
			{
				type: "gce",
				id: "mygce",
				machine_type: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
			},
			{
				type: "googleStorageBucket",
				id: "mybucket"
			}
		]
	}
}
```

### Basic AWS Example with new settings

```js
{
	tool: "terraform",
	repo: "devxp-ca/devxp-test-repo",
	settings: {
		provider: "aws",
		secure: true, //Defaults to FALSE

		//The following only take effect if "secure" is set to true:
		allowSsh: true, //Defaults to FALSE
		allowEgressWeb: true, //Defaults to FALSE, required for outbound web traffic like updating software or downloading files
		allowIngressWeb: true, //Defaults to FALSE, required for web traffic / servers
		autoLoadBalance: true, //Defaults to FALSE, sets up a load balancer for any ec2 servers in the vpc

		resources: [
			{
				type: "ec2",
				id: "myinstance-a",
				instance_type: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				ami: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
			{
				type: "ec2",
				id: "myinstance-b",
				instance_type: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				ami: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
		]
	}
}
```

## Example with one of every supported AWS resource (no google)

```js
{
	tool: "terraform",
	repo: "devxp-ca/devxp-test-repo",
	settings: {
		provider: "aws",
		secure: false, //Defaults to FALSE
		resources: [
			{
				type: "ec2",
				id: "myinstance-a",
				instance_type: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				ami: "e2-standard-2"	//Find values in backend/src/types/terraform.ts
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
			{
				type: "s3",
				id: "my-bucket-which-must-be-globally-unique",
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
			{
				type: "glacierVault",
				id: "my-vault-which-must-be-globally-unique",
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
			{
				type: "dynamoDb",
				id: "my-db",

				//Array of "primary keys" for the noSQL database (like mongo).
				attributes: [
					{
						name: "username",
						type: "S", //"S" for string, "N" for number, or "B" for binary
						isHash: true //For now just always set this true. Support for other types of keys hasn't been added yet
					},
					{
						name: "email",
						type: "S", //"S" for string, "N" for number, or "B" for binary
						isHash: true //For now just always set this true. Support for other types of keys hasn't been added yet
					}
				]
				autoIam: true //Defaults to false. Determines if IAM users will be setup for the resource
			},
			{
				type: "lambdaFunction",
				id: "my-func",
				functionName: "myFunctionName", // must match the regex /^[a-zA-Z][a-zA-Z0-9_]+$/ or /^([a-zA-Z0-9_\\.]+|[a-zA-Z0-9_/.]+)[a-zA-Z0-9_]+\.zip$/
				runtume: "nodejs14.x" //values can be found in backend/src/types/terraform.ts
			}
		]
	}
}
```
