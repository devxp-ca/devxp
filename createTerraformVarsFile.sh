#!/bin/sh

touch terraform.tfvars

for env in "$@"
do
	echo "$env"
	eval echo "\$env = "\\\"\$$env\\\" | wc -c
    eval echo "\$env = "\\\"\$$env\\\" >> terraform.tfvars
done

cat terraform.tfvars | wc -c
