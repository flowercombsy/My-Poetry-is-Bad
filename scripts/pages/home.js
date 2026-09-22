// engine — you don't need to edit this file

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

function setupUnifiedList(){
  const container = document.getElementById("entry-list");
  const categorySelect = document.getElementById("category-select");
  const searchInput = document.getElementById("entry-search");
  const pageSize = 5;

  const numberedPoems = poems.map((entry, i) => ({
    ...entry,
    number: poems.length - i,
    type: "poem",
    pageFile: "poem.html"
  }));

  const taggedStories = stories.map((entry) => ({
    ...entry,
    number: null,
    type: "story",
    pageFile: "story.html"
  }));

  const allEntries = [...taggedStories, ...numberedPoems];

  let shown = pageSize;
  let query = "";
  let category = "all";

  function getFiltered(){
    let list = category === "all" ? allEntries : allEntries.filter((e) => e.type === category);
    if(query){
      list = list.filter((e) => e.title.toLowerCase().includes(query));
    }
    return list;
  }

  function render(){
    container.innerHTML = "";
    const filtered = getFiltered();

    if(filtered.length === 0){
      container.innerHTML = `<p class="empty-note">Nothing matches "${searchInput.value}".</p>`;
      return;
    }

    const visible = query ? filtered : filtered.slice(0, shown);

    visible.forEach((entry) => {
      container.appendChild(buildLinkRow(entry, entry.pageFile, entry.number));
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

  categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    shown = pageSize;
    render();
  });

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    render();
  });

  render();
}

setupUnifiedList();
