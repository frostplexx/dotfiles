# DotFiles

This is a repo for backing up all my dotfiles.

## Backup Usage

This repo is using GNU stow to manage the dotfiles. Simply clone this repo to your home directory using
`git clone https://github.com/frostplexx/dotfiles.git ~/`. Then run `stow .` inside dotiles and it will automatically symlink
everything to the right place.

## Extra Scripts

Inside the scripts folder there are some extra scripts that help with setting up macos.

- `brew_backup_restore.sh` will let you backup and reinstall homebrew packages
- `redice_macOS_anim_speed.sh` speeds up some macos animations and sets some finder settings
- `install_font.sh` will install jetbrains mono nerd font
