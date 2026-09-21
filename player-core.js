// PLAYER CORE — the actual audio engine

const PLAYBACK_STORAGE_KEY = "poemSite.playback";

const audio = new Audio();

const savedVolume = localStorage.getItem("poemSite.volume");
audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;

// what's currently loaded: which list it came from ("library" or "playlist")
// and the index within that list, so "next track" knows where to go
let activeListName = null;
let activeList = [];
let activeIndex = -1;

function setVolume(value){
  audio.volume = value;
  localStorage.setItem("poemSite.volume", value);
}

function savePlaybackState(){
  if(activeIndex === -1) return;
  localStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify({
    listName: activeListName,
    songId: activeList[activeIndex] ? activeList[activeIndex].id : null,
    time: audio.currentTime,
    wasPlaying: !audio.paused
  }));
}

function clearPlaybackState(){
  localStorage.removeItem(PLAYBACK_STORAGE_KEY);
}

// plays a specific song from a specific list
function playFromList(list, index, listName){
  if(list.length === 0) return;
  activeList = list;
  activeIndex = (index + list.length) % list.length;
  activeListName = listName;

  const song = activeList[activeIndex];
  audio.src = song.file;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // autoplay blocked until the person interacts with the page
  });
}

function togglePlay(list, index, listName){
  const song = list[index];
  const isSameSong = activeList[activeIndex] && activeList[activeIndex].id === song.id && activeListName === listName;
  if(isSameSong && !audio.paused){
    audio.pause();
  } else {
    playFromList(list, index, listName);
  }
}

function playNext(){
  if(activeList.length === 0) return;
  playFromList(activeList, activeIndex + 1, activeListName);
}

audio.addEventListener("ended", playNext);
audio.addEventListener("timeupdate", () => {
  // lightweight — only saves every couple of seconds, not every frame
  if(Math.floor(audio.currentTime) % 2 === 0){
    savePlaybackState();
  }
});
audio.addEventListener("pause", savePlaybackState);
window.addEventListener("pagehide", savePlaybackState);

// on page load, try to pick back up wherever the last page left off
(function resumePlayback(){
  try {
    const saved = JSON.parse(localStorage.getItem(PLAYBACK_STORAGE_KEY));
    if(!saved || !saved.songId) return;

    const list = saved.listName === "playlist" ? getPlaylistSongs() : songLibrary;
    const index = list.findIndex((song) => song.id === saved.songId);
    if(index === -1) return;

    activeList = list;
    activeIndex = index;
    activeListName = saved.listName;

    audio.src = list[index].file;
    audio.currentTime = saved.time || 0;

    if(saved.wasPlaying){
      audio.play().catch(() => {
        // blocked until the person clicks something on this page — normal
      });
    }
  } catch (err) {
    // nothing saved yet, that's fine
  }
})();
