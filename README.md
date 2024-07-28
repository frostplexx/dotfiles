![GitHub License](https://img.shields.io/github/license/Frostplexx/dotfiles)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Frostplexx/dotfiles)
![GitHub top language](https://img.shields.io/github/languages/top/Frostplexx/dotfiles)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/Frostplexx/dotfiles/main)

Dotfiles for macOS 14+ and Arch Linux running Hyprland

## Used Software

### Shared 

| Type                               | Name                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Text Editor                        | [Neovim](https://neovim.io/)                                                     |
| Terminal                           | [kitty](sw.kovidgoyal.net/kitty)                                                 |
| Terminal File Manager              | [yazi](https://github.com/sxyazi/yazi)                                           |
| Better ls                          | [eza](https://github.com/eza-community/eza)                                      |
| Better cd                          | [zoxide](https://github.com/ajeetdsouza/zoxide)                                  |
| System Info                        | [fastfetch](https://github.com/fastfetch-cli/fastfetch)                          |
| Fuzzy Finder                       | [fzf](https://github.com/junegunn/fzf)                                           | 
| Music Player                       | Spotify with [Spicetify](https://spicetify.app/)                                 |
| Git Client                         | [lazygit](https://github.com/jesseduffield/lazygit)                              |
| Terminal Multiplexer               | [tmux](https://github.com/tmux/tmux/wiki)                                        |
| Chat Client                        | [vesktop](https://github.com/Vencord/Vesktop?tab=readme-ov-file)                 | 
| System Info                        | [fastfetch](https://github.com/fastfetch-cli/fastfetch)                          |

### macOS Specific 

| Type                               | Name                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Browser                            | [Arc](https://arc.net)                                                           |
| Package Manager                    | [homebrew](https://brew.sh/)                                                     |
| Window Manager                     | [yabai](https://github.com/koekeishiya/yabai)                                    |
| Hotkey Manager                     | [skhd](https://github.com/koekeishiya/skhd.git)                                  |
| Borders                            | [JankyBorders](https://github.com/FelixKratz/JankyBorders)                       |

### Linux Specific

| Type                               | Name                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Wallpaper Daemon                   | [swww](https://github.com/LGFae/swww)                                            |
| Browser                            | [Firefox](https://firefox.com)                                                   |
| AUR Helper                         | [paru](https://github.com/Morganamilo/paru)                                      |
| App Launcher                       | [Rofi](https://github.com/davatorium/rofi)                                       |
| Screenshot Utility                 | [hyprshot](https://github.com/Gustash/Hyprshot)                                  |
| Notification Daemon/Control Center | [Sway Notification Center](https://github.com/ErikReider/SwayNotificationCenter) |
| Lockscreen App                     | [hyprlock](https://github.com/hyprwm/hyprlock)                                   |
| Idle Daemon                        | [hypridle](https://github.com/hyprwm/hypridle)                                   |
| Power Menu App                     | [wlogout](https://github.com/ArtsyMacaw/wlogout)                                 |
| WiFi Menu                          | [iwdrofimenu](https://github.com/defname/rofi-iwd-wifi-menu)                     |
| Bluetooth Manager                  | [bluetui](https://github.com/pythops/bluetui)                                    |
| Window Manager                     | [Hyprland](https://hyprland.org)                                                 |


## Prerequisites

#### Required

- zsh
- eza
- bat
- zoxide
- python 3.X
- fzf
- stow
- ripgrep
- ffmpegthumbnailer
- unzip
- jq
- poppler
- fd
- zoxide
- mpv

#### Optional

- homebrew (for macOS)
- paru (for Arch)
- neovim
- lazygit
- tmux
- npm
- yazi

Additionally, the `.zshrc` will load the following plugins from `/opt/homebrew/share/` for macOS:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L182-L188

and from `/usr/share/zsh/` for Linux:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L191-L195

Additionally, for Linux `zsh-autopairs` will be loaded from `~/.zsh-autopair/autopair.zsh` as it has to be installed manually.
The macOS paths will be loaded with the assumption that the plugins got installed through homebrew. Similarly, Linux assumes the plugins got installed using paru.

## Installation

### macOS Specific

Coming soon

### Linux Specific

Coming soon

### Shared

This repo is using GNU stow to manage the dotfiles. Simply clone this repo to your home directory using
`git clone https://github.com/frostplexx/dotfiles.git ~/dotfiles`. Then run `stow .` inside dotfiles, and it will automatically symlink
everything to the right place.


Inside the `scripts` folder there are some extra scripts that help with setting up macOS.

- `brew_backup_restore.sh` will let you back up and reinstall homebrew packages
- `tweak_macOS.sh` speeds up some macOS animations and sets some finder settings
- `install_font.sh` will install JetBrains mono nerd font

#### Aliases

Aliases are defined in `.config/aliasrc`.

https://github.com/frostplexx/dotfiles/blob/2b3266a164bbae91eab0f020a54414be7c03dd90/.config/aliasrc#L1-L17

# Tools

A Description of some of the tools I use.

## Neovim

### Getting Started

This section will explain how to install this neovim config and set it up for swift development. Most of the Swift development part of this config was taken
from [this](https://wojciechkulik.pl/ios/how-to-develop-ios-and-macos-apps-in-other-ides-like-neovim-or-vs-code) tutorial in addition to using [xcodebuild](https://github.com/wojciech-kulik/xcodebuild.nvim).

### Requirements

#### For General Usage

- Neovim nightly
- Git
- JetbrainsMono Nerd Font (or any other NerdFont)
- lazygit
- ripgrep
- glow (Markdown preview)
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

#### Set up `.ideavimrc` (Optional)

This config also includes my `.ideavimrc` file. Symlink it to your home folder with the following command:

```bash
ln -s ~/.config/nvim/.ideavimrc ~/.ideavimrc
```

And install the IdeaVim plugin in your IDE.

## Configure

The most important post install configuration you have to do is set the path for `codelldb` inside `/nvim/lua/plugins/dap.lua` on line 32.
Download `codelldb` VS Code plugin from: [HERE](https://github.com/vadimcn/codelldb/releases). For more info about debugging see [here](https://github.com/wojciech-kulik/xcodebuild.nvim?tab=readme-ov-file)


# Hyprland

## Requirements

- ly
- hyprland
- dunst
- swww
- rofi
- pamixer
- polkit-gnome
- thunar
- wl-clipboard 
- wf-recorder
- wlogout
- playerctl
- cliphist
