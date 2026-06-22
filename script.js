// ── Modal ────────────────────────────────────────────────────────────────────

function openModal(plant) {
  const modal = document.getElementById("plantModal");
  const details = document.getElementById("modalDetails");

  const zuluNoteHTML =
    plant.zuluNote && plant.zuluNote.trim() !== ""
      ? `<span class="zulu-note">${plant.zuluNote}</span>`
      : "";

  let ritualsHTML = "";
  if (
    plant.rituals &&
    Array.isArray(plant.rituals) &&
    plant.rituals.length > 0
  ) {
    const ritualCards = plant.rituals
      .map(function (ritual) {
        const name = ritual && ritual.name ? ritual.name : "";
        const method = ritual && ritual.method ? ritual.method : "";
        return `
        <div class="ritual-card">
          <p class="ritual-name">${name}</p>
          <p class="ritual-method">${method}</p>
        </div>`;
      })
      .join("");

    ritualsHTML = `
      <div class="rituals-section">
        <p class="rituals-section-title">— Rituals &amp; Spiritual Practice —</p>
        ${ritualCards}
      </div>`;
  }

  const physicalHTML =
    plant.physical && Array.isArray(plant.physical)
      ? plant.physical.map((item) => `<li>${item}</li>`).join("")
      : "";

  const prepHTML =
    plant.preparation && Array.isArray(plant.preparation)
      ? plant.preparation
          .map((step) => `<li style="margin-bottom:10px;">${step}</li>`)
          .join("")
      : "";

  const tipsText = plant.tips && plant.tips.trim() !== "" ? plant.tips : "";

  details.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <img src="${plant.image}" alt="${plant.name}"
           style="width:130px; height:130px; border-radius:50%; border:4px solid white;
           object-fit:cover; margin-top:-100px; box-shadow:0 8px 20px rgba(0,0,0,0.2); background:white;">
    </div>

    <h2 style="color:#1B3022; font-size:2.2rem; margin-bottom:0px; font-family:serif;">
      ${plant.name || ""}
    </h2>

    <p style="color:#8A5A44; font-family:serif; font-size:1.2rem; margin-bottom:2px; letter-spacing:1px;">
      <em>Heritage Name: ${plant.heritageName || ""}</em>
    </p>

    ${zuluNoteHTML}

    <p style="font-style:italic; color:#A68160; margin-bottom:25px; font-size:0.9rem;">
      ${plant.scientific || ""}
    </p>

    <div style="text-align:left; border-top:1px solid rgba(138,90,68,0.2); padding-top:20px;">
      <p style="color:#3E2B1E; font-weight:bold; margin-bottom:10px; text-transform:uppercase; font-size:0.8rem; letter-spacing:1px;">
        Physical Healing &amp; Uses
      </p>
      <ul style="list-style-type:'— '; padding-left:20px; color:#3E2B1E; line-height:1.6; margin-bottom:25px;">
        ${physicalHTML}
      </ul>

      <div style="margin-top:30px; padding:20px; border:1px solid rgba(215,192,145,0.5); border-radius:12px; background-color:rgba(252,249,240,0.6);">
        <p style="color:#8A5A44; text-transform:uppercase; letter-spacing:2px; font-size:0.75rem; font-weight:bold; margin-bottom:15px; text-align:center;">
          — The Ritual of Preparation —
        </p>
        <ol style="padding-left:20px; color:#3E2B1E; line-height:1.6; font-size:0.95rem; margin:0;">
          ${prepHTML}
        </ol>
      </div>

      <div style="background:#E5D9B6; padding:20px; border-radius:12px;
                  border-left:6px solid #849B84; margin-top:25px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);">
        <strong style="color:#8A5A44; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px;">
          Spiritual Wisdom
        </strong>
        <p style="font-style:italic; margin-top:10px; color:#3E2B1E; line-height:1.6;">
          ${tipsText}
        </p>
      </div>

      ${ritualsHTML}
    </div>`;

  modal.style.display = "block";
}

// ── Pagination state ─────────────────────────────────────────────────────────

const PAGE_SIZE = 12;
let currentPage = 1;
let currentFilteredList = [];
let originStoryHidden = false;

// ── Hide origin story (once, permanently, when user goes past page 1) ────────

function hideOriginStory() {
  if (originStoryHidden) return;
  const story = document.getElementById("originStory");
  if (!story) return;
  story.style.transition = "opacity 0.4s ease, max-height 0.5s ease";
  story.style.overflow = "hidden";
  story.style.opacity = "0";
  story.style.maxHeight = story.scrollHeight + "px";
  setTimeout(() => {
    story.style.maxHeight = "0";
    story.style.padding = "0";
    story.style.margin = "0";
  }, 50);
  originStoryHidden = true;
}

// ── Render the current page of cards ─────────────────────────────────────────

function displayPlants(plantList, resetPage) {
  const container = document.getElementById("plantContainer");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageIndicator = document.getElementById("pageIndicator");
  if (!container) return;

  if (resetPage) currentPage = 1;
  currentFilteredList = plantList;

  const totalPages = Math.ceil(plantList.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = plantList.slice(start, end);

  container.innerHTML = "";

  visible.forEach((plant) => {
    const card = document.createElement("div");
    card.classList.add("plant-card");
    card.style.cursor = "pointer";
    card.addEventListener("click", () => openModal(plant));

    const displayCategory = plant.category || plant.benefit || "Botanical";

    card.innerHTML = `
      <h2>${plant.name}</h2>
      <img src="${plant.image}" alt="${plant.name}" class="plant-image" onerror="this.src='images/Hero.webp'">
      <p><strong>Category:</strong> ${displayCategory}</p>
      <p>${plant.description.substring(0, 60)}...</p>
      <small style="color:#849B84; font-weight:bold;">CLICK TO READ MORE WISDOM</small>`;

    container.appendChild(card);
  });

  // Pagination controls
  if (totalPages <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (pageIndicator) pageIndicator.textContent = "";
  } else {
    if (prevBtn)
      prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
    if (nextBtn)
      nextBtn.style.display =
        currentPage < totalPages ? "inline-block" : "none";
    if (pageIndicator)
      pageIndicator.textContent = `${currentPage} of ${totalPages}`;
  }
}

// ── Recipe cross-sell (search results) ───────────────────────────────────────

function getRecipeSearchText(recipe) {
  return [
    recipe.name,
    recipe.sub,
    recipe.teaser,
    recipe.category,
    ...(Array.isArray(recipe.keywords) ? recipe.keywords : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderRecipeCrossSell(term, plantMatchCount) {
  const wrap = document.getElementById("recipeCrossSell");
  if (!wrap) return;

  if (!term) {
    wrap.innerHTML = "";
    return;
  }

  const matches =
    typeof recipes !== "undefined"
      ? recipes.filter((r) => getRecipeSearchText(r).includes(term))
      : [];

  if (matches.length === 0) {
    wrap.innerHTML = "";
    return;
  }

  const cardsHTML = matches
    .slice(0, 4)
    .map((r) => {
      const statusHTML = r.free
        ? `<span class="rc-status">&#10003; Free recipe &mdash; view ingredients</span>`
        : `<span class="rc-status">&#128274; Full recipe in the collection</span>`;
      const subHTML = r.sub
        ? `<p style="font-style:normal; font-size:0.8rem; color:#8a5a44; margin-bottom:4px;">${r.sub}</p>`
        : "";
      return `
        <div class="rc-card">
          <h4>${r.name}</h4>
          ${subHTML}
          <p>${r.teaser}</p>
          ${statusHTML}
        </div>`;
    })
    .join("");

  const noteHTML =
    plantMatchCount === 0
      ? `<p class="rc-note">No matches in the free Botanical Library for &ldquo;${term}&rdquo; &mdash; but it appears in recipes below.</p>`
      : "";

  wrap.innerHTML = `
    ${noteHTML}
    <div class="recipe-crosssell">
      <span class="rc-eyebrow">&#10022; Recipes for this, from Alchemy of Nature</span>
      ${cardsHTML}
      <a href="alchemy.html${matches[0].anchor || ""}" class="rc-link-btn">See ${matches.length > 1 ? "these" : "it"} on Alchemy of Nature &rarr;</a>
    </div>`;
}

// ── Filter (now also drives the recipe cross-sell) ────────────────────────────

function filterPlants() {
  hideOriginStory();
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const selectedType = document.getElementById("typeFilter").value;
  const selectedCategory = document.getElementById("categoryFilter").value;

  const filtered = plants.filter((plant) => {
    const searchableText = [
      plant.name,
      plant.heritageName,
      plant.description,
      plant.category,
      plant.tips,
      ...(Array.isArray(plant.physical) ? plant.physical : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchableText.includes(searchTerm);
    const matchesType = selectedType === "All" || plant.type === selectedType;
    const plantCat = (plant.category || plant.benefit || "").toLowerCase();
    const matchesCategory =
      selectedCategory === "All" ||
      plantCat.includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesType && matchesCategory;
  });

  renderRecipeCrossSell(searchTerm, filtered.length);
  displayPlants(filtered, true);
}

// ── Reset ────────────────────────────────────────────────────────────────────

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "All";
  document.getElementById("categoryFilter").value = "All";
  hideOriginStory();
  renderRecipeCrossSell("", plants.length);
  displayPlants(plants, true);
}

// ── Pagination button handlers ───────────────────────────────────────────────

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(currentFilteredList.length / PAGE_SIZE);
    if (currentPage < totalPages) {
      currentPage++;
      hideOriginStory();
      displayPlants(currentFilteredList, false);
      // Smooth scroll to top of plant grid
      document
        .getElementById("plants")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPlants(currentFilteredList, false);
      document
        .getElementById("plants")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// ── Event listeners ──────────────────────────────────────────────────────────

if (document.getElementById("searchInput"))
  document
    .getElementById("searchInput")
    .addEventListener("input", filterPlants);
if (document.getElementById("typeFilter"))
  document
    .getElementById("typeFilter")
    .addEventListener("change", filterPlants);
if (document.getElementById("categoryFilter"))
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterPlants);
if (document.getElementById("resetBtn"))
  document.getElementById("resetBtn").addEventListener("click", resetFilters);

// Search button — triggers same filterPlants as typing
if (document.getElementById("searchBtn"))
  document.getElementById("searchBtn").addEventListener("click", filterPlants);

// Also allow pressing Enter in the search box
if (document.getElementById("searchInput"))
  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") filterPlants();
    });

// ── Modal close logic ────────────────────────────────────────────────────────

document.querySelector(".close-button").onclick = () => {
  document.getElementById("plantModal").style.display = "none";
};

window.onclick = (event) => {
  if (event.target === document.getElementById("plantModal")) {
    document.getElementById("plantModal").style.display = "none";
  }
};

// ── Initial load ─────────────────────────────────────────────────────────────

displayPlants(plants, true);
