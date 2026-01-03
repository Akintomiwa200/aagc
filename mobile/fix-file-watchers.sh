#!/bin/bash
# Script to fix the ENOSPC file watcher limit error

echo "Current file watcher limit:"
cat /proc/sys/fs/inotify/max_user_watches

echo ""
echo "Attempting to increase the limit to 524288..."
echo "You will be prompted for your sudo password."

sudo sysctl fs.inotify.max_user_watches=524288

echo ""
echo "New file watcher limit:"
cat /proc/sys/fs/inotify/max_user_watches

echo ""
echo "To make this permanent, run:"
echo "  echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf"
echo "  sudo sysctl -p"




