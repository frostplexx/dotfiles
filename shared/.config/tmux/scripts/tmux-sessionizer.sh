#!/bin/zsh

export FZF_DEFAULT_OPTS=" \
    --color=spinner:#f4dbd6,hl:#ed8796 \
    --color=border:#8aadf4 \
    --color=label:#cad3f5 \
    --color=fg:#cad3f5,header:#cad3f5,info:#c6a0f6,pointer:#f4dbd6 \
    --color=marker:#f4dbd6,fg+:#cad3f5,prompt:#c6a0f6,hl+:#ed8796"


# Define the icons for each folder type
developer_icon="󰅨"  # Developer icon
documents_icon=""  # Documents icon
config_icon=""     # Config icon
other_icon=""      # Default folder icon

# Define the base directory path to remove
base_path=~/  # This is your home directory

# Function to prepend icons to directory names
prepend_icon() {
    local dir=$1
    if [[ $dir == *"/Developer"* ]]; then
        echo "$developer_icon ${dir#$base_path}"
    elif [[ $dir == *"/Documents"* ]]; then
        echo "$documents_icon ${dir#$base_path}"
    elif [[ $dir == *"/dotfiles"* ]]; then
        echo "$config_icon ${dir#$base_path}"
    else
        echo "$other_icon ${dir#$base_path}"
    fi
}

if [[ $# -eq 1 ]]; then
    selected=$1
else
    # Collect the directories and prepend icons
    dirs=$(find ~/Developer ~/Documents/University ~/dotfiles ~/dotfiles/.config ~/Documents -mindepth 1 -maxdepth 1 -type d)
    dirs_with_icons=$(echo "$dirs" | while read -r dir; do prepend_icon "$dir"; done)
    
    # Use fzf with the modified list of directories
    selected=$(echo "$dirs_with_icons" | fzf-tmux -p --reverse --border=rounded --border-label=" 󰥨 Open Project " --preview='eza --tree --icons --level=1 {}' | sed 's/^[^ ]* //')
fi

if [[ -z $selected ]]; then
    exit 0
fi

# Prepend the base path back to the selected directory
selected="$base_path$selected"

selected_name=$(basename "$selected" | tr . _)
tmux_running=$(pgrep tmux)

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
    tmux new-session -s $selected_name -c $selected
    exit 0
fi

if ! tmux has-session -t=$selected_name 2> /dev/null; then
    tmux new-session -ds $selected_name -c $selected
fi

tmux switch-client -t $selected_name
