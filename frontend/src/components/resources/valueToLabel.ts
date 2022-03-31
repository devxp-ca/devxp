const valueToLabel = (value: string) => {
	switch (value) {
		case "autoIam":
			return "Create IAM User";
		case "disk_image":
		case "ami":
			return "OS";
		case "machine_type":
		case "instance_type":
			return "Hardware";
		case "image":
		case "runtime":
			return value.charAt(0).toUpperCase() + value.slice(1);
		case "entry_point":
			return "Entry Point";
		case "handler":
			return "Exported Handler";
		case "AUTO_AMAZON":
			return "Amazon Linux";
		case "ubuntu-2004-focal-v20220204":
		case "AUTO_UBUNTU":
			return "Ubuntu";
		case "ami-0faefa03f7ddcd657":
			return "Mac OS";
		case "windows-server-2019-dc-v20220210":
		case "AUTO_WINDOWS":
			return "Windows";
		case "centos-stream-8-v20220128":
			return "CentOS Linux";
		case "fedora-coreos-35-20220116-3-0-gcp-x86-64":
			return "Fedora Linux";
		case "mac1.metal":
			return "MAC";
		case "f1-micro":
		case "t2.micro":
			return "Micro";
		case "t2.small":
			return "Small";
		case "n1-standard-1":
		case "t2.medium":
			return "Medium";
		case "t2.large":
		case "e2-standard-2":
			return "Large";
		case "t2.xlarge":
		case "e2-standard-8":
			return "Extra Large";
		case "c3.2xlarge":
		case "c3.8xlarge":
			return "Compute Optimized";
		case "d2.2xlarge":
		case "d2.8xlarge":
			return "Storage Optimized";
		case "r3.2xlarge":
		case "r3.8xlarge":
			return "Memory Optimized";
	}

	return value;
};
export default valueToLabel;
