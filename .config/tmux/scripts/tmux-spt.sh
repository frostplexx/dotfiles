#!/bin/zsh

export FZF_DEFAULT_OPTS=" \
    --color=spinner:#f4dbd6,hl:#ed8796 \
    --color=border:#8aadf4 \
    --color=label:#cad3f5 \
    --color=fg:#cad3f5,header:#cad3f5,info:#c6a0f6,pointer:#f4dbd6 \
    --color=marker:#f4dbd6,fg+:#cad3f5,prompt:#c6a0f6,hl+:#ed8796"


tmux_running=$(pgrep tmux)

if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
    tmux new-session -s "Spotify" bash -c spotify_player
    exit 0
fi

if ! tmux has-session -t="Spotify" 2> /dev/null; then
    tmux new-session -ds "Spotify" bash -c spotify_player
fi

tmux switch-client -t "Spotify"

