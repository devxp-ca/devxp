import {Job, jobIsTerraform} from "../types/pipeline";

export const indentLines = (data: string, indent: number): string => {
	return data
		.split("\n")
		.map(line => " ".repeat(indent) + line)
		.join("\n");
};

export const createJob = (job: Job): string => {
	// if(job.type === "terraform"){
	if (jobIsTerraform(job)) {
		return `

deploy:
  runs-on: ubuntu-latest
  steps:
  - name: 'Install Terraform 🟪'
    uses: hashicorp/setup-terraform@v1

  - name: 'checkout 🕵'
    id: 'checkout'
    uses: actions/checkout@v2

  - name: 'Cache Terraform State 💾'
    id: cache-state-get
    uses: actions/cache@v3
    with:
      path: terraform.tfstate
      key: \${{ runner.os }}-state

${
	job.provider === "google"
		? `
  - name: 'auth 🔑'
    id: 'auth'
    uses: 'google-github-actions/auth@v0'
    with:
      credentials_json: '\${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}'

  - name: 'Set up Cloud SDK ☁️'
    uses: 'google-github-actions/setup-gcloud@v0'
`
		: ``
}

  - name: 'Setup terraform 🟪'
    run: '${
		job.provider === "aws"
			? "AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} "
			: ""
	}terraform init -migrate-state -force-copy'

  - name: 'Cache Terraform State 💾'
    id: cache-state-set
    uses: actions/cache@v3
    with:
      path: terraform.tfstate
      key: \${{ runner.os }}-state

  - name: 'Terraform Apply 🚀'
    run: '${
		job.provider === "aws"
			? "AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} "
			: ""
	}terraform apply -auto-approve'
`;
	} else {
		//This will never run
		return "";
	}
};
