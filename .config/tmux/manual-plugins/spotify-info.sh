#!/usr/bin/env osascript

tell application "Spotify"
  if it is running then
    if player state is playing then
      set track_name to name of current track
      set artist_name to artist of current track

      if artist_name is not missing value then
        # If the track has an artist set and is therefore most likely a song rather than an advert
        return "♫ " & artist_name & " - " & track_name
      else
        # If the track doesn't have an artist set and is therefore most likely an advert rather than a song
        return "~ " & track_name
      end if
    else
      return ""
    end if
  else
    return ""
  end if
end tell
