const songsDiv = document.getElementById("songs");
const loadingText = document.getElementById("loading");

function getMusic(mood) {
  songsDiv.innerHTML = "";
  loadingText.innerText = "Loading...";

  // Add Indian keywords
  let query = mood + " bollywood india";

  fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=30&country=IN`)
    .then(res => res.json())
    .then(data => {
      loadingText.innerText = "";

      if (data.results.length === 0) {
        loadingText.innerText = "No songs found";
        return;
      }

      data.results.forEach(song => {
        let div = document.createElement("div");
        div.className = "song";

        div.innerHTML = `
          <img src="${song.artworkUrl100}">
          <h3>${song.trackName}</h3>
          <p>${song.artistName}</p>
          <audio controls src="${song.previewUrl}"></audio>
        `;

        songsDiv.appendChild(div);
      });
    })
    .catch(() => {
      loadingText.innerText = "Error loading data";
    });
}