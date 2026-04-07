const songsDiv = document.getElementById("songs");
const loadingText = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let allSongs = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch music
function getMusic(mood) {
  songsDiv.innerHTML = "";
  loadingText.innerText = "Loading...";

  let query = mood + " bollywood india";

  fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=30&country=IN`)
    .then(res => res.json())
    .then(data => {
      loadingText.innerText = "";

      if (data.results.length === 0) {
        loadingText.innerText = "No songs found";
        return;
      }

      allSongs = data.results;
      displaySongs(allSongs);
    })
    .catch(() => {
      loadingText.innerText = "Error loading data";
    });
}

// Display songs
function displaySongs(songs) {
  songsDiv.innerHTML = "";

  songs.map(song => {
    let div = document.createElement("div");
    div.className = "song";

    let isFav = favorites.includes(song.trackId);

    div.innerHTML = `
      <img src="${song.artworkUrl100}">
      <h3>${song.trackName}</h3>
      <p>${song.artistName}</p>
      <button onclick="toggleFavorite(${song.trackId})">
        ${isFav ? "❤️ Favorited" : "🤍 Favorite"}
      </button>
      <audio controls src="${song.previewUrl}"></audio>
    `;

    songsDiv.appendChild(div);
  });
}

// Search (HOF: filter)
searchInput.addEventListener("input", () => {
  let value = searchInput.value.toLowerCase();

  let filtered = allSongs.filter(song =>
    song.trackName.toLowerCase().includes(value)
  );

  displaySongs(filtered);
});

// Sort (HOF: sort)
sortSelect.addEventListener("change", () => {
  let sorted = [...allSongs];

  if (sortSelect.value === "asc") {
    sorted.sort((a, b) => a.trackName.localeCompare(b.trackName));
  } else if (sortSelect.value === "desc") {
    sorted.sort((a, b) => b.trackName.localeCompare(a.trackName));
  }

  displaySongs(sorted);
});

// Favorite feature
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displaySongs(allSongs);
}
