#!/bin/zsh

export FZF_DEFAULT_OPTS=" \
    --color=spinner:#f4dbd6,hl:#ed8796 \
    --color=border:#8aadf4 \
    --color=label:#cad3f5 \
    --color=fg:#cad3f5,header:#cad3f5,info:#c6a0f6,pointer:#f4dbd6 \
    --color=marker:#f4dbd6,fg+:#cad3f5,prompt:#c6a0f6,hl+:#ed8796"


SSH_CONFIG="$HOME/.ssh/config"
computer_icon="󰍹"  # Define the computer icon

# Check if the SSH config file exists
if [[ ! -f $SSH_CONFIG ]]; then
    echo "No ssh config file found at $SSH_CONFIG"
    exit 1
fi

# Function to handle adding a new host
add_host() {
    echo "Starting wizard for adding a new host..."
    # Prompt for hostname
    read -p "Enter the hostname: " hostname

    # Prompt for IP address
    read -p "Enter the IP address: " ip_address

    # Prompt for username
    read -p "Enter the username: " username

    # Prompt for port (default is 22)
    read -p "Enter the port (default is 22): " port
    port=${port:-22}

    # Add the host entry to the SSH config file
    echo -e "\nHost $hostname\n\tHostname $ip_address\n\tUser $username\n\tPort $port\n" >> $SSH_CONFIG

    echo "Host $hostname added to $SSH_CONFIG"
}

# Function to handle connecting to an existing host
connect_host() {
    # Extract the Hosts except *
    hosts=$(awk '/^Host [^*]/ {print $2}' $SSH_CONFIG)

    # Check if any hosts were found
    if [[ -z $hosts ]]; then
        echo "No hosts found in the SSH config file."
        exit 1
    fi

    # Prepend the computer icon to each host
    hosts_with_icons=$(echo "$hosts" | awk -v icon="$computer_icon" '{print icon " " $0}')

    # Display the hosts in fzf for selection
    selected_host=$(echo "$hosts_with_icons" | fzf-tmux -p --reverse --border=rounded --border-label="   Connect to SSH " | sed 's/^[^ ]* //')

    if [[ -z $selected_host ]]; then
        exit 0
    else
        session_name="ssh-$selected_host"
        tmux_running=$(pgrep tmux)
        command="echo 'Connecting to host $selected_host...'; ssh $selected_host"

        if [[ -z $TMUX ]] && [[ -z $tmux_running ]]; then
            tmux new-session -d -s $session_name "$command"
            exit 0
        fi

        if ! tmux has-session -t=$session_name 2> /dev/null; then
            tmux new-session -d -s $session_name "$command"
        fi
        tmux switch-client -t $session_name
    fi
}

# Main script
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 [-c|--connect|-a|--add]"
    exit 1
fi

case $1 in
    -c|--connect)
        connect_host
        ;;
    -a|--add)
        add_host
        ;;
    *)
        echo "Invalid option: $1"
        echo "Usage: $0 [-c|--connect|-a|--add]"
        exit 1
        ;;
esac
