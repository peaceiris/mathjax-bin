#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

RELEASE_TYPE_LIST="patch minor major prerelease prepatch preminor premajor"
DEFAULT_BRANCH="main"

CURRENT_BRANCH="$(git branch --show-current)"
if [ "${CURRENT_BRANCH}" != "${DEFAULT_BRANCH}" ]; then
  echo "$0: Current branch ${CURRENT_BRANCH} is not ${DEFAULT_BRANCH}, continue? (y/n)"
  read -r res
  if [ "${res}" = "n" ]; then
    echo "$0: Stop script"
    exit 0
  fi
fi

if command -v fzf; then
  RELEASE_TYPE=$(echo "${RELEASE_TYPE_LIST}" | tr ' ' '\n' | fzf --layout=reverse)
else
  select sel in ${RELEASE_TYPE_LIST}; do
    RELEASE_TYPE="${sel}"
    break
  done
fi

echo "$0: Create ${RELEASE_TYPE} release, continue? (y/n)"
read -r res
if [ "${res}" = "n" ]; then
  echo "$0: Stop script"
  exit 0
fi

git fetch origin
git pull origin --tags
if [ "${CURRENT_BRANCH}" != "${DEFAULT_BRANCH}" ]; then
  git pull origin "${CURRENT_BRANCH}"
else
  git pull origin ${DEFAULT_BRANCH}
fi

npm version "${RELEASE_TYPE}"

if [ "${CURRENT_BRANCH}" != "${DEFAULT_BRANCH}" ]; then
  git push origin "${CURRENT_BRANCH}"
else
  git push origin ${DEFAULT_BRANCH}
fi

TAG_NAME="v$(jq -r '.version' ./package.json)"
git push origin "${TAG_NAME}"
