
# dotfiles

![GitHub License](https://img.shields.io/github/license/Frostplexx/dotfiles)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Frostplexx/dotfiles)
![GitHub top language](https://img.shields.io/github/languages/top/Frostplexx/dotfiles)


This is a repo for backing up all my dotfiles.

## Backup Usage

This repo is using GNU stow to manage the dotfiles. Simply clone this repo to your home directory using
`git clone https://github.com/frostplexx/dotfiles.git ~/`. Then run `stow .` inside dotiles and it will automatically symlink
everything to the right place.

## Extra Scripts

Inside the scripts folder there are some extra scripts that help with setting up macos.

- `brew_backup_restore.sh` will let you backup and reinstall homebrew packages
- `tweak_macOS.sh` speeds up some macos animations and sets some finder settings
- `install_font.sh` will install jetbrains mono nerd font

# Tools

## NVim

<h4 align="center">
  <a href="https://github.com/Frostplexx/dotfiles?tab=readme-ov-file#gettings-started">Getting Started</a>
  ·
  <a href="https://github.com/Frostplexx/dotfiles?tab=readme-ov-file#configure">Configure</a>
  ·
  <a href="https://github.com/Frostplexx/dotfiles?tab=readme-ov-file#usage">Usage</a>
</h4>


## Gettings Started

This section will explain how to install this neovim config and set it up for swift development. Most of the Swift development part of this config was taken 
from [this](https://wojciechkulik.pl/ios/how-to-develop-ios-and-macos-apps-in-other-ides-like-neovim-or-vs-code) tutorial in addition to using [xcodebuild](https://github.com/wojciech-kulik/xcodebuild.nvim).

### Requirements

#### For General Usage

- NeoVim nightly
- Git
- JetbrainsMono Nerd Font (or any other NerdFont)
- lazygit
- ripgrep
- glow (Markdown  preview)
- fd (find files)

#### Swift Specific

- xcode-build-server
- XCode
- xcodegen
- swiftlint
- swiftformat
- xcbeautify

### Installation

#### Backup your old config (Optional)

```bash
# required
mv ~/.config/nvim{,.bak}

# optional but recommended
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
```

#### Clone the repo

```bash
git clone https://github.com/Frostplexx/vim-config.git ~/.config/nvim
```

#### Set up .ideavimrc (Optional)

This config also includes my .ideavimrc file. Symlink it to your home folder with the following command:

```bash
ln -s ~/.config/nvim/.ideavimrc ~/.ideavimrc
```

and install the IdeaVim plugin in your IDE.


## Configure

The most important post install configuration you have to do is set the path for codelldb inside `/nvim/lua/plugins/dap.lua` on line 32.
Download codelldb VS Code plugin from: [HERE](https://github.com/vadimcn/codelldb/releases). For more info about debugging see [here](https://github.com/wojciech-kulik/xcodebuild.nvim?tab=readme-ov-file)
