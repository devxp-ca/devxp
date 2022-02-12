#!/bin/sh


echo "Authenticating with Google Cloud"
gcloud auth configure-docker --project "$PROJECT_ID" || exit "$?"

echo "Initializing docker build"
docker build . || exit "$?"

#Tagging docker build
docker tag $( docker image list -q | head -n1 ) "gcr.io/${PROJECT_ID}/${SERVICE}:${SHA}" || exit "$?"

#Pushing docker image to GCR
docker push "gcr.io/${PROJECT_ID}/${SERVICE}:${SHA}" || exit "$?"

exit 0
