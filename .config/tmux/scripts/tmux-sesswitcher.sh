#!/bin/zsh
source ./utils/colors.sh


# List sessions with their attached status
sessions=$(tmux list-sessions -F "#{session_name} #{?session_attached,,}")

# If no sessions are found, exit
if [ -z "$sessions" ]; then
  echo "No tmux sessions found."
  exit 0
fi

# Use fzf-tmux to select a session
selected=$(echo "$sessions" | fzf-tmux --exit-0 -p --border=rounded --border-label="  Switch Session " --reverse --preview 'tmux list-windows -t {1} -F "#{window_index}: #{window_name} #{window_layout}"')

# If a session is selected, extract the session name and switch to it
if [ -n "$selected" ]; then
  session_name=$(echo "$selected" | awk '{print $1}')
  tmux switch-client -t "$session_name"
fi


