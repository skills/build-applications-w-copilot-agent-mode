#!/bin/bash
# This script is run after the container is created.
# It is used to install any additional dependencies or perform any setup tasks.

sudo cp --force ./.devcontainer/welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt

# open ports for Python Django server and React app
gh cs ports visibility 8000:public -c $CODESPACE_NAME
gh cs ports visibility 3000:public -c $CODESPACE_NAME