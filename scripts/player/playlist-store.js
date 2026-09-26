const PLAYLIST_STORAGE_KEY = "poemSite.playlist";

// reads the saved playlist (an array of song ids) back out of localStorage
function loadPlaylist(){
  try {
    const saved = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
}

// writes the current playlist back to localStorage
function savePlaylist(playlistIds){
  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlistIds));
}

// the user's custom playlist, as an array of song ids
let userPlaylist = loadPlaylist();

// adds a song to the playlist, unless it's already in there
function addToPlaylist(songId){
  if(!userPlaylist.includes(songId)){
    userPlaylist.push(songId);
    savePlaylist(userPlaylist);
  }
}

// takes a song out of the playlist
function removeFromPlaylist(songId){
  userPlaylist = userPlaylist.filter((id) => id !== songId);
  savePlaylist(userPlaylist);
}

// moves a song from one position in the playlist to another
function reorderPlaylist(fromIndex, toIndex){
  const moved = userPlaylist.splice(fromIndex, 1)[0];
  userPlaylist.splice(toIndex, 0, moved);
  savePlaylist(userPlaylist);
}

// turns the saved list of song ids back into full song objects, in order
function getPlaylistSongs(){
  return userPlaylist
    .map((id) => songLibrary.find((song) => song.id === id))
    .filter(Boolean);
}
