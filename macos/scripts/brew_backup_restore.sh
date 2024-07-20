# List all brew packages and save them to a file

if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Unsupported OS, cannot continue (See README.md)"
    exit 1
fi

# Check if passed argument is -b or -read -r 

if [ "$1" = "-b" ]; then
    echo "Backing up brew packages..."
    brew list > brew_packages
    echo "Done"
elif [ "$1" = "-r" ]; then
    echo "Restoring brew packages..."
    brew install $(cat brew_packages)
    echo "Done"
else
    echo "Invalid argument, use -b to backup or -r to restore"
fi

