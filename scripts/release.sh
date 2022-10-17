#!/bin/bash

while [[ "$#" > 0 ]]; do case $1 in
  -r|--release) release="$2"; shift;;
  -b|--branch) branch="$2"; shift;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

# Default as minor, the argument major, minor or patch: 
if [ -z "$release" ]; then
    echo -e 'please select type which your release as';
    select rel in 'major', 'minor', 'patch'; do
      release=$rel;
      break;
    done;
fi;

echo -e "\n";

# Default release branch is current branch name 
currentBranch=$(git rev-parse --abbrev-ref HEAD);

if [ -z "$branch" ] ; then
  read -p "Please input the branch name that you want release, default is $currentBranch: " inputBr;
  if [ -z "$inputBr" ]; then
    branch=$currentBranch;
  else 
    branch=$inputBr;
  fi;
fi;

echo "Branch is $branch"
echo "Release as $release"

# Tag prefix
prefix="v"

# Push branch to git remote repository
# echo "Current pull origin $branch.";
# git pull origin $branch


# Auto generate version number and tag
standard-version -r $release --tag-prefix $prefix --infile CHANGELOG.md

# Push tag to git remote repository
# git push --follow-tags origin $branch

echo -e "\nRelease finished.";
echo -e "Please check the recent commit, and then\n1. Sync branch and tag to git remote repository\n2. Run 'npm publish' to publish a new npm package";


