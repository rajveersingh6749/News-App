// const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
// const url = "https://newsapi.org/v2/everything?q=";

const API_KEY="f02058324ff04f49a624acbf7a0c6dee";
const url="https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Error fetching data: ${res.statusText}`);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!cardsContainer || !newsCardTemplate) {
        console.error("Required DOM elements not found");
        return;
    }

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    if (newsImg) {
        newsImg.src = article.urlToImage;
    } else {
        console.error("newsImg element not found");
    }

    if (newsTitle) {
        newsTitle.innerHTML = article.title;
    } else {
        console.error("newsTitle element not found");
    }

    if (newsDesc) {
        newsDesc.innerHTML = article.description;
    } else {
        console.error("newsDesc element not found");
    }

    if (newsSource) {
        const date = new Date(article.publishedAt).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        });
        newsSource.innerHTML = `${article.source.name} · ${date}`;
    } else {
        console.error("newsSource element not found");
    }

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
