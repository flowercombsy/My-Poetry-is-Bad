const tracks = [
  { name: "when-she-laughs.mp3", file: "audios/when-she-laughs.mp3" },
  { name: "Placeholder", file: "audios/placeholder.mp3" }
];

const audio = new Audio();
audio.volume = 0.8;
let currentTrack = -1;

const trackListEl = document.getElementById("track-list");
const volumeSlider = document.getElementById("volume-slider");
const playlistTab = document.getElementById("playlist-tab");
const playlistPanel = document.getElementById("playlist-panel");

const rows = tracks.map((track, i) => {
  const row = document.createElement("div");
  row.className = "track-row";
  row.innerHTML = `
    <button class="track-play" aria-label="Play ${track.name}">▶</button>
    <span class="track-name">${track.name}</span>
  `;
  const btn = row.querySelector(".track-play");
  btn.addEventListener("click", () => {
    if(currentTrack === i && !audio.paused){
      audio.pause();
    } else {
      playTrack(i);
    }
  });
  trackListEl.appendChild(row);
  return row;
});

function setPlayingUI(){
  rows.forEach((row, i) => {
    const btn = row.querySelector(".track-play");
    const isThisTrack = i === currentTrack;
    const isPlaying = isThisTrack && !audio.paused;
    row.classList.toggle("playing", isPlaying);
    btn.textContent = isPlaying ? "⏸" : "▶";
  });
}

function playTrack(i){
  currentTrack = (i + tracks.length) % tracks.length;
  audio.src = tracks[currentTrack].file;
  audio.play().catch(() => {
  });
  setPlayingUI();
}

audio.addEventListener("play", setPlayingUI);
audio.addEventListener("pause", setPlayingUI);
audio.addEventListener("ended", () => playTrack(currentTrack + 1));

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

playlistTab.addEventListener("click", () => {
  const isOpen = playlistPanel.classList.toggle("open");
  playlistTab.classList.toggle("shifted", isOpen);
  playlistTab.textContent = isOpen ? "✕ Close" : "♪ Playlist";
});
