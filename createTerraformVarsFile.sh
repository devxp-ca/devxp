#!/bin/sh

touch terraform.tfvars
for env in "$@"
do
    eval echo "\$env = "\\\"\$$env\\\" >> terraform.tfvars
done
