#!/usr/bin/env bash

if [ -z "$1" ]; then
	echo "Please provide a tag."
	echo "Usage: ./release.sh v[X.Y.Z]"
	exit
fi

echo "Preparing $1..."
# update the version
msg="# managed by release.sh"
# sed -E -i "s/^version = \".*\"/version = \"${1#v}\"/" ./Cargo.toml
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${1#v}\"/" package.json
# update the changelog
npx git-cliff --config cliff.toml --tag "$1" 006b52f..HEAD > CHANGELOG.md
git add -A && git commit -m "chore(release): prepare for $1"
git show
# generate a changelog for the tag message
export GIT_CLIFF_TEMPLATE="\
	{% for group, commits in commits | group_by(attribute=\"group\") %}
	{{ group | upper_first }}\
	{% for commit in commits %}
		- {% if commit.breaking %}(breaking) {% endif %}{{ commit.message | upper_first }} ({{ commit.id | truncate(length=7, end=\"\") }})\
	{% endfor %}
	{% endfor %}"
changelog=$(npx git-cliff --config cliff.toml --unreleased --strip all)
git tag -a "$1" -m "Release $1" -m "$changelog"
echo "Done!"
echo "Now push the commit (git push) and the tag (git push --tags)."