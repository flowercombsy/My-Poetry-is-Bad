// pulls the poem/story id out of the page's URL (the ?id=... part)
function getIdFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// finds the matching poem or story and fills in the title, date, body and category on the page
function renderDetailPage(entries, categoryLabel){
  const id = getIdFromUrl();
  const entry = entries.find((e) => e.id === id);

  const titleEl = document.getElementById("detail-title");
  const dateEl = document.getElementById("detail-date");
  const bodyEl = document.getElementById("detail-body");
  const categoryEl = document.getElementById("detail-category");

  if(!entry){
    titleEl.textContent = "Not found";
    bodyEl.textContent = "That link doesn't match anything here — it may have been renamed or removed.";
    document.title = "Not found";
    return;
  }

  document.title = entry.title;
  titleEl.textContent = entry.title;
  dateEl.textContent = entry.date || "";
  bodyEl.textContent = entry.body.trim();
  categoryEl.textContent = categoryLabel;

  // poems get a "#N" number in front of the title, same as on the home page
  if(categoryLabel === "Poem"){
    const index = entries.findIndex((e) => e.id === id);
    const number = entries.length - index;
    const numberEl = document.createElement("span");
    numberEl.className = "entry-number";
    numberEl.textContent = `#${number} `;
    titleEl.prepend(numberEl);
  }
}
