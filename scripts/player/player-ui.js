const playlistTab = document.getElementById("playlist-tab");
const playlistPanel = document.getElementById("playlist-panel");
const volumeSlider = document.getElementById("volume-slider");
const playlistColumnEl = document.getElementById("playlist-column");
const songsColumnEl = document.getElementById("songs-column");

volumeSlider.value = audio.volume;

volumeSlider.addEventListener("input", () => {
  setVolume(parseFloat(volumeSlider.value));
});

playlistTab.addEventListener("click", () => {
  const isOpen = playlistPanel.classList.toggle("open");
  playlistTab.classList.toggle("shifted", isOpen);
  playlistTab.textContent = isOpen ? "✕ Close" : "♪ Playlist";
});

// true if this exact song, from this exact list, is the one currently playing
function isCurrentlyPlaying(song, listName){
  return activeList[activeIndex]
    && activeList[activeIndex].id === song.id
    && activeListName === listName
    && !audio.paused;
}

// builds one row — shared shape for both columns, just the button (+ / −) and its click behaviour differ
function buildSongRow(song, list, index, listName, actionSymbol, onAction){
  const row = document.createElement("div");
  row.className = "track-row";
  row.dataset.songId = song.id;

  row.innerHTML = `
    <button class="track-play" aria-label="Play ${song.name}">▶</button>
    <span class="track-name">${song.name}</span>
    <button class="track-action" aria-label="${actionSymbol === '+' ? 'Add' : 'Remove'} ${song.name}">${actionSymbol}</button>
  `;

  const playBtn = row.querySelector(".track-play");
  playBtn.addEventListener("click", () => {
    togglePlay(list, index, listName);
    refreshPlayingUI();
  });

  const actionBtn = row.querySelector(".track-action");
  actionBtn.addEventListener("click", onAction);

  if(isCurrentlyPlaying(song, listName)){
    row.classList.add("playing");
    playBtn.textContent = "⏸";
  }

  return row;
}

// redraws the full Songs list on the right
function renderSongsColumn(){
  songsColumnEl.innerHTML = "";
  songLibrary.forEach((song, index) => {
    const row = buildSongRow(song, songLibrary, index, "library", "+", () => {
      addToPlaylist(song.id);
      renderPlaylistColumn();
    });
    songsColumnEl.appendChild(row);
  });
}

// redraws the user's custom Playlist on the left, with drag-to-reorder wired up on each row
function renderPlaylistColumn(){
  playlistColumnEl.innerHTML = "";
  const playlistSongs = getPlaylistSongs();

  if(playlistSongs.length === 0){
    playlistColumnEl.innerHTML = `<p class="empty-note">Empty — hit "+" on a song to add it here.</p>`;
    return;
  }

  playlistSongs.forEach((song, index) => {
    const row = buildSongRow(song, playlistSongs, index, "playlist", "−", () => {
      removeFromPlaylist(song.id);
      renderPlaylistColumn();
    });

    // drag and drop reordering, playlist column only
    row.draggable = true;
    row.addEventListener("dragstart", (e) => {
      row.classList.add("dragging");
      // Firefox won't start a drag at all unless something is set here
      e.dataTransfer.setData("text/plain", song.id);
      e.dataTransfer.effectAllowed = "move";
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
    });

    playlistColumnEl.appendChild(row);
  });
}

playlistColumnEl.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = playlistColumnEl.querySelector(".dragging");
  if(!dragging) return;

  const afterElement = [...playlistColumnEl.querySelectorAll(".track-row:not(.dragging)")]
    .find((row) => e.clientY < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2);

  if(afterElement){
    playlistColumnEl.insertBefore(dragging, afterElement);
  } else {
    playlistColumnEl.appendChild(dragging);
  }
});

playlistColumnEl.addEventListener("drop", (e) => {
  e.preventDefault();
  const newOrderIds = [...playlistColumnEl.querySelectorAll(".track-row")].map((row) => row.dataset.songId);
  const fromIds = userPlaylist;
  newOrderIds.forEach((id, newIndex) => {
    const oldIndex = fromIds.indexOf(id);
    if(oldIndex !== newIndex){
      reorderPlaylist(oldIndex, newIndex);
    }
  });
  renderPlaylistColumn();
});

// re-renders both columns so the play/pause icons stay in sync with whatever's actually playing
function refreshPlayingUI(){
  renderSongsColumn();
  renderPlaylistColumn();
}

audio.addEventListener("play", refreshPlayingUI);
audio.addEventListener("pause", refreshPlayingUI);

renderSongsColumn();
renderPlaylistColumn();