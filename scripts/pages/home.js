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
  const listPage = document.querySelector("main.list-page");
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

  let poemShown = pageSize;
  let storyShown = pageSize;
  let query = "";
  let category = "all";

  function matchesQuery(entry){
    return !query || entry.title.toLowerCase().includes(query);
  }

  // builds one column's worth of rows + its own "Show more", used both
  // for a single filtered list and for each side of the "All" view
  function fillColumn(listEl, entries, shownCount, emptyMessage, onShowMore){
    const filtered = entries.filter(matchesQuery);

    if(filtered.length === 0){
      listEl.innerHTML = `<p class="empty-note">${emptyMessage}</p>`;
      return;
    }

    filtered.slice(0, shownCount).forEach((entry) => {
      listEl.appendChild(buildLinkRow(entry, entry.pageFile, entry.number));
    });

    if(shownCount < filtered.length){
      const loadMoreBtn = document.createElement("button");
      loadMoreBtn.className = "load-more";
      loadMoreBtn.innerHTML = `
        <span class="load-more-line"></span>
        <span class="load-more-icon">⌄</span> Show more <span class="load-more-icon">⌄</span>
        <span class="load-more-line"></span>
      `;
      loadMoreBtn.addEventListener("click", onShowMore);
      listEl.appendChild(loadMoreBtn);
    }
  }

  function render(){
    container.innerHTML = "";

    if(category === "all"){
      // two side-by-side columns: Poem (left), Story (right)
      listPage.classList.add("wide");
      container.className = "entry-columns";

      const poemList = document.createElement("div");
      poemList.className = "entry-list";
      fillColumn(poemList, numberedPoems, poemShown, "No poems match.", () => {
        poemShown += pageSize;
        render();
      });

      const divider = document.createElement("div");
      divider.className = "divider";

      const storyList = document.createElement("div");
      storyList.className = "entry-list";
      fillColumn(storyList, taggedStories, storyShown, "No stories match.", () => {
        storyShown += pageSize;
        render();
      });

      container.append(poemList, divider, storyList);
    } else {
      // a single, full-width filtered list
      listPage.classList.remove("wide");
      container.className = "entry-list";

      const entries = category === "poem" ? numberedPoems : taggedStories;
      const shownCount = category === "poem" ? poemShown : storyShown;

      fillColumn(container, entries, shownCount, `Nothing matches "${searchInput.value}".`, () => {
        if(category === "poem") poemShown += pageSize; else storyShown += pageSize;
        render();
      });
    }
  }

  categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    poemShown = pageSize;
    storyShown = pageSize;
    render();
  });

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    render();
  });

  render();
}

setupUnifiedList();
