
# dotfiles

![GitHub License](https://img.shields.io/github/license/Frostplexx/dotfiles)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Frostplexx/dotfiles)
![GitHub top language](https://img.shields.io/github/languages/top/Frostplexx/dotfiles)

This is a repo for backing up all my dotfiles.


## Prerequisites

#### Required

- zsh
- eza
- bat
- zoxide
- python 3.X
- fzf

#### Optional

- homebrew (for macOS)
- yay (for Linux)
- neovim
- lazygit
- tmux

Additionally the `.zshrc` will load the following plugins from `/opt/homebrew/share/` for macOS:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L182-L188

and from `/usr/share/zsh/` for Linux:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L191-L195

Additionally for Linux zsh-autopairs will be loaded from `~/.zsh-autopair/autopair.zsh` as it has to be installed manually.
The macOS paths will be loaded with the assumption that the plugins got installed through homebrew. Similarly Linux assumes the plugins got installed using yay.

## Backup Usage

This repo is using GNU stow to manage the dotfiles. Simply clone this repo to your home directory using
`git clone https://github.com/frostplexx/dotfiles.git ~/`. Then run `stow .` inside dotiles and it will automatically symlink
everything to the right place.

## Extra Scripts

Inside the scripts folder there are some extra scripts that help with setting up macos.

- `brew_backup_restore.sh` will let you backup and reinstall homebrew packages
- `tweak_macOS.sh` speeds up some macos animations and sets some finder settings
- `install_font.sh` will install jetbrains mono nerd font

## Aliases

Aliases are defined in `.config/aliasrc`. 

https://github.com/frostplexx/dotfiles/blob/2b3266a164bbae91eab0f020a54414be7c03dd90/.config/aliasrc#L1-L17

# Tools

A Description of some of the tools I use.

## NVim

### Gettings Started

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
