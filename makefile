OS := $(shell uname -s)
SHARED_PACKAGES := zsh eza bat zoxide python fzf stow ripgrep ffmpegthumbnailer unzip jq poppler fd zoxide mpv neovim lazygit tmux npm yazi kitty vesktop
LINUX_PACKAGES := hyprland ly rofi solaar swaync waybar wlogout cliphist pamixer wl-clipboard 
MACOS_PACKAGES := raycast arc 

.PHONY: all
all: install_brew_or_paru install_packages run_autostow

.PHONY: install_brew_or_paru
install_brew_or_paru:
ifeq ($(OS), Darwin)
	@if ! command -v brew >/dev/null 2>&1; then \
		echo "Homebrew not found. Installing Homebrew..."; \
		/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
	fi
else ifeq ($(OS), Linux)
	@if [ -f /etc/arch-release ]; then \
		if ! command -v paru >/dev/null 2>&1; then \
			echo "Paru not found. Installing Paru..."; \
			sudo pacman -S --needed base-devel; \
			git clone https://aur.archlinux.org/paru.git; \
			cd paru && makepkg -si && cd .. && rm -rf paru; \
		fi \
	fi
endif

.PHONY: install_packages
install_packages:
ifeq ($(OS), Darwin)
	brew install $(SHARED_PACKAGES) $(MACOS_PACKAGES)
else ifeq ($(OS), Linux)
	paru -S --noconfirm $(SHARED_PACKAGES) $(LINUX_PACKAGES)
endif

.PHONY: run_autostow
run_autostow:
	./autostow.sh
