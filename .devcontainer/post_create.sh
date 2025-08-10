#!/bin/bash
# This script is run after the container is created.
# It is used to install any additional dependencies or perform any setup tasks.

wget -qO - https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/mongodb-server-6.0.gpg > /dev/null
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y python3-venv
sudo apt-get install -y mongodb-org
sudo mkdir -p /usr/local/etc/vscode-dev-containers
sudo cp --force ./.devcontainer/welcome-message.txt /usr/local/etc/vscode-dev-containers/first-run-notice.txt