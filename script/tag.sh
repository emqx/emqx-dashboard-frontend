#!/bin/sh
set -eu

version=$1
git tag $version
git push origin $version
echo "Tag end!"
