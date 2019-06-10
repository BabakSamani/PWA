const apiKey = "6e02eb5d1c3c42a6ad87aa2e635074df";

const main = document.querySelector("main");
const selectSource = document.querySelector("#sources");
const defaultSource = "bbc-news";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .register("sw.js")
      .then(registration => console.log("Service Worker registered"))
      .catch(err => "SW registration failed")
  );
}

window.addEventListener("load", async event => {
  updateNews()
    .then()
    .catch(error => {
      alert(`Errors in getting news: ${error}`);
    });

  await getSources()
    .then()
    .catch(error => {
      alert(`Errors in getting sources: ${error}`);
    });

  selectSource.value = defaultSource;
  selectSource.addEventListener("change", e => {
    updateNews(e.target.value)
      .then()
      .catch(error => {
        if (error.message === "Failed to fetch") {
          console.log("Failed to fetch the news!");
        } else {
          alert(`Errors in getting news: ${error.message}`);
        }
      });
  });

  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("sw.js");
      console.log("Service worker is registered!");
    } catch (error) {
      console.log(`Service worker failed: ${error}`);
    }
  }
});

window.addEventListener("online", () => updateNews(selectSource.value));

async function getSources() {
  const res = await fetch(
    `https://newsapi.org/v2/sources?language=en&apiKey=${apiKey}`
  );
  const json = await res.json();

  selectSource.innerHTML = json.sources
    .map(src => `<option value="${src.id}">${src.name}</option>`)
    .join("\n");
}

async function updateNews(source = defaultSource) {
  let topic = "apple";

  const res = await fetch(
    `https://newsapi.org/v2/everything?sources=${source}&q=${topic}&from=2019-06-01&to=2019-06-03&sortBy=popularity&apiKey=${apiKey}`
  );
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticles).join("\n");
}

function createArticles(article) {
  return `
    <div class="article">
        <a href="${article.url}" target="_blank">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage ||
              "./src/images/img-not-found.png"}" alt="${article.source.name}">
            <p>${article.description || " Description is not avaialble!"}</p>
        </a>
    </div>`;
}
