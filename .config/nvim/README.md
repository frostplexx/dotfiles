<h1 align="center">NVim :: Λurora</h1>
<h4 align="center">Minimalism, Maximized</h4>

<img width="1045" alt="SCR-20231218-rqzs" src="https://github.com/Frostplexx/vim-config/assets/62436912/01128c38-9a70-4919-8bdf-cfe1403daeb8">


![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Frostplexx/vim-config?colorA=363a4f&colorB=b7bdf8&style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/frostplexx/vim-config?colorA=363a4f&colorB=f5a97f&style=for-the-badge)

<h4 align="center">
  <a href="https://github.com/Frostplexx/vim-config?tab=readme-ov-file#gettings-started">Getting Started</a>
  ·
  <a href="https://github.com/Frostplexx/vim-config?tab=readme-ov-file#configure">Configure</a>
  ·
  <a href="https://github.com/Frostplexx/vim-config?tab=readme-ov-file#usage">Usage</a>
</h4>


# Gettings Started

This section will explain how to install this neovim config and set it up for swift development. Most of the Swift development part of this config was taken 
from [this](https://wojciechkulik.pl/ios/how-to-develop-ios-and-macos-apps-in-other-ides-like-neovim-or-vs-code) tutorial in addition to using [xcodebuild](https://github.com/wojciech-kulik/xcodebuild.nvim).

## Requirements

### For General Usage

- NeoVim nightly
- Git
- JetbrainsMono Nerd Font (or any other NerdFont)
- lazygit
- ripgrep
- glow (Markdown  preview)
- fd (find files)

### Swift Specific

- xcode-build-server
- XCode
- xcodegen
- swiftlint
- swiftformat
- xcbeautify

## Installation

### Backup your old config (Optional)

```bash
# required
mv ~/.config/nvim{,.bak}

# optional but recommended
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
```

### Clone the repo

```bash
git clone https://github.com/Frostplexx/vim-config.git ~/.config/nvim
```

### Set up .ideavimrc (Optional)

This config also includes my .ideavimrc file. Symlink it to your home folder with the following command:

```bash
ln -s ~/.config/nvim/.ideavimrc ~/.ideavimrc
```

and install the IdeaVim plugin in your IDE.


# Configure

The most important post install configuration you have to do is set the path for codelldd inside `/nvim/lua/plugins/dap.lua` on line 32.
Download codelldb VS Code plugin from: [HERE](https://github.com/vadimcn/codelldb/releases). For more info about debugging see [here](https://github.com/wojciech-kulik/xcodebuild.nvim?tab=readme-ov-file)


# Usage

1. Set up xcode-build-server for your project
2. Open it in nvim and run XcodeBuildSetup to start the setup

After that you can do `<leader>dx` to debug or `<leader>cb` to generate the project and build it
