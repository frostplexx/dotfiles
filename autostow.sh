#!/bin/bash

# Function to check if GNU stow is installed
check_stow_installed() {
    if ! command -v stow &> /dev/null; then
        echo "GNU stow is not installed. Please install it and try again."
        exit 1
    fi
}

# Function to unstow a directory
stow_directory() {
    dir=$1
    if [ -d "$dir" ]; then
        echo "Stowing $dir..."
        stow "$dir"
    else
        echo "$dir directory does not exist."
    fi
}

# Check if GNU stow is installed
check_stow_installed

# Always unstow shared directory
stow_directory "shared"

# Determine the OS and unstow the corresponding directory
case "$OSTYPE" in
    darwin*)
        stow_directory "macos"
        ;;
    linux*)
        stow_directory "linux"
        ;;
    *)
        echo "OS not supported"
        exit 1
        ;;
esac

echo "Done."


