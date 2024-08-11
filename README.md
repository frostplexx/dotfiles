![GitHub License](https://img.shields.io/github/license/Frostplexx/dotfiles)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Frostplexx/dotfiles)
![GitHub top language](https://img.shields.io/github/languages/top/Frostplexx/dotfiles)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/Frostplexx/dotfiles/main)

Dotfiles for macOS 14+ and Arch Linux running Hyprland

# Used Software

## Shared

| Type                  | Name                                                             |
| --------------------- | ---------------------------------------------------------------- |
| Text Editor           | [Neovim](https://neovim.io/)                                     |
| Terminal              | [kitty](sw.kovidgoyal.net/kitty)                                 |
| Terminal File Manager | [yazi](https://github.com/sxyazi/yazi)                           |
| Better ls             | [eza](https://github.com/eza-community/eza)                      |
| Better cd             | [zoxide](https://github.com/ajeetdsouza/zoxide)                  |
| System Info           | [fastfetch](https://github.com/fastfetch-cli/fastfetch)          |
| Fuzzy Finder          | [fzf](https://github.com/junegunn/fzf)                           |
| Music Player          | Spotify with [Spicetify](https://spicetify.app/)                 |
| Git Client            | [lazygit](https://github.com/jesseduffield/lazygit)              |
| Terminal Multiplexer  | [tmux](https://github.com/tmux/tmux/wiki)                        |
| Chat Client           | [vesktop](https://github.com/Vencord/Vesktop?tab=readme-ov-file) |
| System Info           | [fastfetch](https://github.com/fastfetch-cli/fastfetch)          |

## macOS Specific

| Type            | Name                                                       |
| --------------- | ---------------------------------------------------------- |
| Browser         | [Arc](https://arc.net)                                     |
| Package Manager | [homebrew](https://brew.sh/)                               |
| Window Manager  | [yabai](https://github.com/koekeishiya/yabai)              |
| Hotkey Manager  | [skhd](https://github.com/koekeishiya/skhd.git)            |
| Borders         | [JankyBorders](https://github.com/FelixKratz/JankyBorders) |

## Linux Specific

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

# Prerequisites

<details>
<summary>Prerequisites</summary>

## Required

- homebrew (for macOS)
- paru (for Arch)
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

## Optional

- neovim
- lazygit
- npm
- yazi
- kitty

Additionally, the `.zshrc` will load the following plugins from `/opt/homebrew/share/` for macOS:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L182-L188

and from `/usr/share/zsh/` for Linux:

https://github.com/frostplexx/dotfiles/blob/95ba570a6542d41d6b94ba68f66879e1a2f133fd/.zshrc#L191-L195

Additionally, for Linux `zsh-autopairs` will be loaded from `~/.zsh-autopair/autopair.zsh` as it has to be installed manually.
The macOS paths will be loaded with the assumption that the plugins got installed through homebrew. Similarly, Linux assumes the plugins got installed using paru.

</details>

# Installation

<details>
<summary>macOS Specific</summary>

### Prerequisites

Install homebrew using

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After that install all the required packages using the following command:

```bash
brew install zsh eza bat zoxide fzf stow ripgrep ffmpegthumbnailer unzip jq poppler fd
```

You need to also install a NerdFont which you can do by running the following command

```bash
# Install JetBrainsMono Nerd Font
brew tap homebrew/cask-fonts
brew install --cask font-jetbrains-mono-nerd-font
```

### Tweaks

Next you can run `tweak_macOS.sh` inside `./macos/scripts/`. This will apply various command line tweaks, like speeding up
animation speeds, removing dock delay and so on.

### Programs

Lastly you want to install the actual applications using this command:

```bash
brew tap frostplexx/homebrew-neovim-nightly
brew tap FelixKratz/formulae

# Casks
brew install \
    frostplexx/neovim-nightly/neovim-nightly \
    koekeishiya/formulae/skhd \
    borders \
    firefox@nightly \
    yazi \
    lazygit \
    npm \
    kitty \
    1password-cli \
    raycast \
    mac-mouse-fix \
    hex-fiend \
    mactex \
    spotify \
    shottr \
    zap \
    wireshark \
    vmware-fusion \
    imageoptim \
    codeedit \
    altserver \
    betterdisplay \
    burp-suite \
    proxyman \
    ollama

brew install --HEAD yabai

# Formulae
brew install \
    binwalk \
    ffmpeg \
    exiftool \
    fastfetch \
    ggshield \
    imagemagick \
    qemu \
    rust \
    zsh-autopair \
    zsh-autosuggestions \
    zsh-syntax-highlighting
```

</details>

<details>
<summary>Linux Specific</summary>

### Hyprland

#### Requirements

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
</details>

## Shared

This repo is using GNU stow to manage the dotfiles. Simply clone this repo to your home directory using
`git clone https://github.com/frostplexx/dotfiles.git ~/dotfiles`. Then run `./autostow.sh` inside dotfiles, and it will automatically symlink
everything to the right place.

### Spicetify

To get Spicetify working run `spicetify backup apply`.

### Vesktop

Vesktop can easily be synced using my own self host sync at `https://vcloud.kuipr.de`.

### Firefox

Enable vertical tabs in firefox nightlys lab section and add the following userChrome.css

```css
#TabsToolbar {
  visibility: collapse;
}

#titlebar {
  display: none;
}
```

# Configuration

## Aliases

Aliases are defined in `.config/aliasrc`.

https://github.com/frostplexx/dotfiles/blob/2b3266a164bbae91eab0f020a54414be7c03dd90/.config/aliasrc#L1-L17
