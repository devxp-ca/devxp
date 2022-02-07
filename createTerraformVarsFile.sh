#!/bin/sh

touch terraform.tfvars

for env in "$@"
do
    eval echo "\$env = "\\\"\$$env\\\" >> terraform.tfvars
done

echo "SHA = \"$( git rev-parse --short HEAD )\"" >> terraform.tfvars
