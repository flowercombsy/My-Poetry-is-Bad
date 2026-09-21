// engine — you don't need to edit this file

const audio = new Audio();

const savedVolume = localStorage.getItem("poemSite.volume");
audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;

let activeListName = null;
let activeList = [];
let activeIndex = -1;

function setVolume(value){
  audio.volume = value;
  localStorage.setItem("poemSite.volume", value);
}

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
