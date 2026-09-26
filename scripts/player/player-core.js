const audio = new Audio();

const savedVolume = localStorage.getItem("poemSite.volume");
audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;

let activeListName = null;
let activeList = [];
let activeIndex = -1;

// changes the playback volume and remembers it for next time
function setVolume(value){
  audio.volume = value;
  localStorage.setItem("poemSite.volume", value);
}

// starts playing a song from a given list (the song library or the custom playlist), remembering which list it came from
function playFromList(list, index, listName){
  if(list.length === 0) return;
  activeList = list;
  activeIndex = (index + list.length) % list.length;
  activeListName = listName;

  const song = activeList[activeIndex];
  audio.src = song.file;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// pauses if the clicked song is already the one playing, otherwise starts it
function togglePlay(list, index, listName){
  const song = list[index];
  const isSameSong = activeList[activeIndex] && activeList[activeIndex].id === song.id && activeListName === listName;
  if(isSameSong && !audio.paused){
    audio.pause();
  } else {
    playFromList(list, index, listName);
  }
}

// moves on to the next song in whichever list is currently playing
function playNext(){
  if(activeList.length === 0) return;
  playFromList(activeList, activeIndex + 1, activeListName);
}

audio.addEventListener("ended", playNext);
