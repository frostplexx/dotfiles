#!/bin/zsh

export FZF_DEFAULT_OPTS=" \
    --color=spinner:#f4dbd6,hl:#ed8796 \
    --color=border:#8aadf4 \
    --color=label:#cad3f5 \
    --color=fg:#cad3f5,header:#cad3f5,info:#c6a0f6,pointer:#f4dbd6 \
    --color=marker:#f4dbd6,fg+:#cad3f5,prompt:#c6a0f6,hl+:#ed8796"


# Open a tmux popup window with ranger file manager in the current directory

CURRENT_DIR = $(pwd)

# Set the tmux session name
tmux popup -h 95% -w 95% -E -d "lf" 'export VISUAL="tmux neww nvim" && lf $CURRENT_DIR'
