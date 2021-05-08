#!/bin/sh
set -eu

version=$1
remote=$2

git tag $version
git push $remote $version
echo "Tag end!"
