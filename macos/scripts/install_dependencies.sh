if [[ "$OSTYPE" == "darwin"* ]]; then

    brew install eza bat zoxide fzf stow npm zsh-autosuggestions zsh-syntax-highlighting zsh-autopair lazygit tmux

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Plugins. They need to be loaded differently depending on if its macos or Linux
    yay -S zsh eza bat zoxide fzf stow npm zsh-autosuggestions zsh-syntax-highlighting zsh-autopair lazygit tmux 
else
	echo "Unsupported OS, cannot continue (See README.md)"
	exit 1
fi
