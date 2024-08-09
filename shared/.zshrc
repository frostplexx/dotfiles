# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi


compress_mov_to_mp4() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: compress_mov_to_mp4 input.mov"
        return 1
    fi

    input_file="$1"
    output_file="${input_file:r}.mp4"

    ffmpeg -i "$input_file" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k "$output_file"
}

bup() {
    echo "Autoremoving Packages..."
    brew autoremove; 
    echo "Updating Homebrew Packages..."
    brew update; 
    brew upgrade; 

    brew upgrade neovim-nightly
    xattr -cr /opt/homebrew/bin/nvim
    
    echo "Cleaning up Homebrew Packages..."
    brew cleanup; 
    echo "Updating Appstore Apps..."
    mas upgrade;
}

update_vim() {
    echo "Updating vim"
    brew upgrade neovim-nightly
    sudo xattr -cr /opt/homebrew/Caskroom/neovim-nightly/latest/nvim-macos-arm64/lib/nvim/parser/*
    sudo xattr -cr /opt/homebrew/Caskroom/neovim-nightly/latest/nvim-macos-arm64/bin/nvim
}

bip() {
    local inst=$(brew search "$@" | sed '/^$/s//⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  󰔃 Casks ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯/' | fzf-tmux -p --reverse -m --no-color )

    if [[ $inst ]]; then
        for prog in $(echo $inst);
        do; brew install $prog; done;
    fi
}

function yy() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}

# Ensure you reload your shell configuration or restart the terminal
# source ~/.bashrc or source ~/.zshrc

eval "$(zoxide init --cmd cd zsh)"
eval "$(fzf --zsh)"

# Enable colors:
autoload -U colors && colors

# Edit line in vim with ctrl-e:
export VISUAL=nvim
autoload -Uz edit-command-line
zle -N edit-command-line
bindkey "^e" edit-command-line

# Additional Path stuff
export PATH=$PATH:/Users/daniel/.cargo/bin
export PATH=$HOME/bin:/usr/local/bin:$PATH
export SSH_AUTH_SOCK=~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock
export PATH="$PATH:/Users/daniel/.local/bin"
export EDITOR=nvim
export GCM_CREDENTIAL_STORE=secretservice

# fzf settings
export FZF_DEFAULT_OPTS=" \
    --color=spinner:#f4dbd6,hl:#ed8796 \
    --color=border:#8aadf4 \
    --color=label:#cad3f5 \
    --color=fg:#cad3f5,header:#cad3f5,info:#c6a0f6,pointer:#f4dbd6 \
    --color=marker:#f4dbd6,fg+:#cad3f5,prompt:#c6a0f6,hl+:#ed8796"

# History in cache directory
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.cache/zsh/history
setopt share_history
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_verify

bindkey '^[[A' history-beginning-search-backward
bindkey '^[[B' history-beginning-search-forward


# Set Options
#############################################
setopt always_to_end          # When completing a word, move the cursor to the end of the word
setopt append_history         # this is default, but set for share_history
setopt auto_cd                # cd by typing directory name if it's not a command
setopt auto_list              # automatically list choices on ambiguous completion
setopt auto_menu              # automatically use menu completion
setopt auto_pushd             # Make cd push each old directory onto the stack
setopt completeinword         # If unset, the cursor is set to the end of the word
setopt glob_dots              # dot files included in regular globs
setopt hash_list_all          # when command completion is attempted, ensure the entire  path is hashed
setopt hist_expire_dups_first # # delete duplicates first when HISTFILE size exceeds HISTSIZE
setopt hist_find_no_dups      # When searching history don't show results already cycled through twice
setopt hist_ignore_dups       # Do not write events to history that are duplicates of previous events
setopt hist_reduce_blanks     # remove superfluous blanks from history items
setopt hist_verify            # show command with history expansion to user before running it
setopt inc_append_history     # save history entries as soon as they are entered
setopt interactivecomments    # allow use of comments in interactive code (bash-style comments)
setopt longlistjobs           # display PID when suspending processes as well
setopt no_beep                # silence all bells and beeps
setopt nocaseglob             # global substitution is case insensitive
setopt nonomatch              ## try to avoid the 'zsh: no matches found...'
setopt noshwordsplit          # use zsh style word splitting
setopt notify                 # report the status of backgrounds jobs immediately
setopt numeric_glob_sort      # globs sorted numerically
setopt prompt_subst           # allow expansion in prompts
setopt pushd_ignore_dups      # Don't push duplicates onto the stack
setopt share_history          # share history between different instances of the shell

# Set editor default keymap to emacs (`-e`) or vi (`-v`)
bindkey -v
export KEYTIMEOUT=1

#auto/tab complete:
autoload -U compinit
zstyle ':completion:*' completer _extensions _complete _approximate
zstyle ':completion:*' menu select 
zstyle ':completion:*:*:*:*:descriptions' format '%F{green}-- %d --%f'
zstyle ':completion:*:*:*:*:corrections' format '%F{yellow}!- %d (errors: %e) -!%f'
zstyle ':completion:*:messages' format ' %F{purple} -- %d --%f'
zstyle ':completion:*:warnings' format ' %F{red}-- no matches found --%f'
zstyle ':completion:*' group-name ''
zstyle ':completion:*:*:-command-:*:*' group-order alias builtins functions commands
zstyle ':completion:*' use-cache on
zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*' cache-path "$XDG_CACHE_HOME/zsh/.zcompcache"
zmodload zsh/complist
compinit
_comp_options+=(globdots)		# Include hidden files.


# Use vim keys in tab complete menu:
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history
bindkey -v '^?' backward-delete-char

# Change cursor shape for different vi modes.
function zle-keymap-select {
  if [[ ${KEYMAP} == vicmd ]] ||
     [[ $1 = 'block' ]]; then
    echo -ne '\e[1 q'
  elif [[ ${KEYMAP} == main ]] ||
       [[ ${KEYMAP} == viins ]] ||
       [[ ${KEYMAP} = '' ]] ||
       [[ $1 = 'beam' ]]; then
    echo -ne '\e[5 q'
  fi
}
zle -N zle-keymap-select
zle-line-init() {
    zle -K viins # initiate `vi insert` as keymap (can be removed if `bindkey -V` has been set elsewhere)
    echo -ne "\e[5 q"
}
zle -N zle-line-init
echo -ne '\e[5 q' # Use beam shape cursor on startup.
preexec() { echo -ne '\e[5 q' ;} # Use beam shape cursor for each new prompt.

# Use lf to switch directories and bind it to ctrl-o
lfcd () {
    tmp="$(mktemp)"
    lf -last-dir-path="$tmp" "$@"
    if [ -f "$tmp" ]; then
        dir="$(cat "$tmp")"
        rm -f "$tmp"
        [ -d "$dir" ] && [ "$dir" != "$(pwd)" ] && cd "$dir"
    fi
}
bindkey -s '^o' 'lfcd\n'

# Prompt for spelling correction of commands.
setopt CORRECT
# Customize spelling correction prompt.
SPROMPT='zsh: correct %F{red}%R%f to %F{green}%r%f [Nyae]? '

# Remove path separator from WORDCHARS.
WORDCHARS=${WORDCHARS//[\/]}

# See https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/docs/highlighters/main.md#how-to-tweak-it
[[ "$TERM_PROGRAM" == "CodeEditApp_Terminal" ]] && . "/Applications/CodeEdit.app/Contents/Resources/codeedit_shell_integration.zsh"

# Check if current device is mac or x86-linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Set up fzf and zoxide
    # Plugins. They need to be loaded differently depending on if its macos or Linux
    source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
    source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
    source /opt/homebrew/share/zsh-autopair/autopair.zsh
    alias tailscale="/Applications/Tailscale.app/Contents/MacOS/Tailscale"

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Plugins. They need to be loaded differently depending on if its macos or Linux
    source ~/.zsh-autopair/autopair.zsh
    autopair-init
    source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
    source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
else
	echo "Unsupported OS, cannot continue (See ReadMe.md)"
	exit 1
fi

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
source ~/powerlevel10k/powerlevel10k.zsh-theme

# Load aliases
[ -f "$HOME/.config/aliasrc" ] && source "$HOME/.config/aliasrc"

