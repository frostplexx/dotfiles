#!/bin/bash

[[ $(yabai -m query --windows | grep '"app":"Arc"' | wc -l) -eq 1 ]] &&
    yabai -m window $YABAI_WINDOW_ID --space web --toggle float
