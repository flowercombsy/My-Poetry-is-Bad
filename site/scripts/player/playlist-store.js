

const PLAYLIST_STORAGE_KEY = "poemSite.playlist";

function loadPlaylist(){
  try {
    const saved = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
}

function savePlaylist(playlistIds){
  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlistIds));
}

// current custom playlist, as an array of song ids
let userPlaylist = loadPlaylist();

function addToPlaylist(songId){
  if(!userPlaylist.includes(songId)){
    userPlaylist.push(songId);
    savePlaylist(userPlaylist);
  }
}

function removeFromPlaylist(songId){
  userPlaylist = userPlaylist.filter((id) => id !== songId);
  savePlaylist(userPlaylist);
}

function reorderPlaylist(fromIndex, toIndex){
  const moved = userPlaylist.splice(fromIndex, 1)[0];
  userPlaylist.splice(toIndex, 0, moved);
  savePlaylist(userPlaylist);
}

function getPlaylistSongs(){
  // turns the stored ids back into full song objects, in order,
  // skipping any id that no longer exists in the library
  return userPlaylist
    .map((id) => songLibrary.find((song) => song.id === id))
    .filter(Boolean);
}
