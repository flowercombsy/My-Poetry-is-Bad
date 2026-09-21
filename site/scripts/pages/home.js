

function buildLinkRow(entry, pageFile, numberLabel){
  const row = document.createElement("a");
  row.className = "entry";
  row.href = `${pageFile}?id=${entry.id}`;

  row.innerHTML = `
    <span class="entry-row">
      <span class="entry-mark">&rsaquo;</span>
      <span class="entry-heading">
        <span class="entry-title">${numberLabel ? `<span class="entry-number">#${numberLabel}</span> ` : ""}${entry.title}</span>
        <span class="entry-preview">${entry.preview || ""}</span>
      </span>
      <span class="entry-date">${entry.date || ""}</span>
    </span>
  `;

  return row;
}

function renderStoryList(){
  const container = document.getElementById("story-list");
  if(stories.length === 0){
    container.innerHTML = `<p class="empty-note">No stories yet.</p>`;
    return;
  }
  stories.forEach((story) => {
    container.appendChild(buildLinkRow(story, "story.html", null));
  });
}


function setupPoemsList(){
  const container = document.getElementById("poem-list");
  const searchInput = document.getElementById("poem-search");
  const pageSize = 5;

  const numbered = poems.map((entry, i) => ({
    ...entry,
    number: poems.length - i
  }));

  let shown = pageSize;
  let query = "";

  function render(){
    container.innerHTML = "";

    const filtered = query
      ? numbered.filter((entry) => entry.title.toLowerCase().includes(query))
      : numbered;

    if(filtered.length === 0){
      container.innerHTML = `<p class="empty-note">No poems match "${searchInput.value}".</p>`;
      return;
    }

    const visible = query ? filtered : filtered.slice(0, shown);

    visible.forEach((entry) => {
      container.appendChild(buildLinkRow(entry, "poem.html", entry.number));
    });

    if(!query && shown < filtered.length){
      const loadMoreBtn = document.createElement("button");
      loadMoreBtn.className = "load-more";
      loadMoreBtn.innerHTML = `
        <span class="load-more-line"></span>
        <span class="load-more-icon">⌄</span> Show more <span class="load-more-icon">⌄</span>
        <span class="load-more-line"></span>
      `;
      loadMoreBtn.addEventListener("click", () => {
        shown += pageSize;
        render();
      });
      container.appendChild(loadMoreBtn);
    }
  }

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    render();
  });

  render();
}

renderStoryList();
setupPoemsList();
