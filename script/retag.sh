#!/bin/sh
set -eu

version=$1
token=$2
release_id=$3
remote=$4

curl -X DELETE -H "Accept: application/vnd.github.v3+json" -H "Authorization: $token" https://api.github.com/repos/emqx/emqx-dashboard-frontend/releases/$release_id
echo "Release was deleted!"
git tag -d $version
git push $remote :refs/tags/$version
git tag $version
git push $remote $version
echo "Retag end!"
