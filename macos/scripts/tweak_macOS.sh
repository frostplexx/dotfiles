#!/bin/bash

# This Scripts aims to speed up macos by reducing some of its animation speeds

# ==== VARIABLES ====

DOCK_ANIM_SPEED=0.4
LAUNCHPAD_ANIM_SPEED=0.4
LAUNCHPAD_PAGEFLIP_SPEED=0.4
WINDOW_RESIZE_TIME=0.1
# ========
# get the first argument
if [ -z "$1" ]; then
    read -p "Do you want to apply the animation tweaks (a) or restore them (r) or quit (q)? " -n 1 -r
    echo
    if [[ $REPLY =~ ^[aA]$ ]]; then
        action="-a"
    elif [[ $REPLY =~ ^[rR]$ ]]; then
        action="-r"
    elif [[ $REPLY =~ ^[qQ]$ ]]; then
        exit
    fi
else
    action=$1
fi

# check if the first argument is -h or --help
if [ "$action" == "-h" ] || [ "$action" == "--help" ]; then
    echo "Usage: ./tweak_macOS.sh [OPTION]"
    echo "Options:"
    echo "  -h, --help      Show this help message"
    echo "  -a, --apply     Apply the animation speed modifications"
    echo "  -r, --restore   Restore to the default settings"
    exit
fi

if [ "$action" == "-a" ] || [ "$action" == "--apply" ]; then
    # Animation Speed increases
    echo "Increasing Dock animation speed."
    defaults write com.apple.Dock autohide-delay -float 0
    defaults write com.apple.dock autohide-time-modifier -float $DOCK_ANIM_SPEED && killall Dock

    echo "Speeding up Launchpad"
    defaults write com.apple.dock springboard-hide-duration -float $LAUNCHPAD_ANIM_SPEED
    defaults write com.apple.dock springboard-show-duration -float $LAUNCHPAD_ANIM_SPEED
    defaults write com.apple.dock springboard-page-duration -float $LAUNCHPAD_PAGEFLIP_SPEED

    echo "Disabling window opening animation and resize time"
    defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
    defaults write -g NSWindowResizeTime -float $WINDOW_RESIZE_TIME

    echo "Enabling show hidden files."
    defaults write com.apple.Finder AppleShowAllFiles true
    echo "Show Folders first in Finder"
    defaults write com.apple.finder _FXSortFoldersFirst -bool true
    echo "Show Hidden Files"
    defaults write NSGlobalDomain "AppleShowAllExtensions" -bool "true"
    echo "Settings Dock Size"
    defaults write com.apple.dock "tilesize" -int "45"
    echo "Showing Path Bar"
    defaults write com.apple.finder "ShowPathbar" -bool "true"
    echo "Setting Clock"
    defaults write com.apple.menuextra.clock "DateFormat" -string "\"HH:mm\""
    echo "Adjusting Trackpad"
    defaults write com.apple.AppleMultitouchTrackpad "FirstClickThreshold" -int "0"
    echo "xCode Settings"
    defaults write com.apple.dt.Xcode "ShowBuildOperationDuration" -bool "true" && killall Xcode

    echo "Turning on Touch ID for sudo"
    grep -q '^auth       sufficient     pam_tid.so' /private/etc/pam.d/sudo_local || sudo sed -i '' '$ a\
auth       sufficient     pam_tid.so' /private/etc/pam.d/sudo_local
    defaults write com.apple.security.authorization ignoreArd -bool TRUE

    killall Finder
    killall Dock

fi

if [ "$action" == "-r" ] || [ "$action" == "--restore" ]; then
    defaults delete com.apple.Dock autohide-delay
    defaults delete com.apple.Dock autohide-time-modifier
    defaults delete com.apple.dock springboard-hide-duration
    defaults delete com.apple.dock springboard-show-duration
    defaults delete com.apple.dock springboard-page-duration
    defaults delete NSGlobalDomain NSAutomaticWindowAnimationsEnabled
    defaults delete -g NSWindowResizeTime
    defaults delete NSGlobalDomain ApplePressAndHoldEnabled
    defaults delete com.apple.finder AppleShowAllFiles
    defaults delete com.apple.finder _FXSortFoldersFirst
    defaults delete com.apple.dock "tilesize"
    defaults delete NSGlobalDomain "AppleShowAllExtensions"
    defaults delete com.apple.finder "ShowPathbar"
    defaults delete com.apple.AppleMultitouchTrackpad "FirstClickThreshold"
    defaults delete com.apple.dt.Xcode "ShowBuildOperationDuration" && killall Xcode
    sudo sed -i '' '/^auth       sufficient     pam_tid.so/d' /private/etc/pam.d/sudo_local
    defaults delette com.apple.security.authorization ignoreArd

    killall Dock
    killall Finder
fi
