import { CONFIG } from './config.js';
import { shareManager } from './share.js';

class UIManager {
    constructor() {
        this.cardsContainer = document.getElementById("cards-container");
        this.newsCardTemplate = document.getElementById("template-news-card");
        this.loadingElement = this.createLoadingElement();
        this.errorElement = this.createErrorElement();
        this.currentSelectedNav = null;
    }

    createLoadingElement() {
        const loading = document.createElement('div');
        loading.className = 'loading-container';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading news articles...</p>
        `;
        return loading;
    }

    createErrorElement() {
        const error = document.createElement('div');
        error.className = 'error-container';
        error.innerHTML = `
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p class="error-message"></p>
            <button class="retry-button" onclick="window.location.reload()">Try Again</button>
        `;
        return error;
    }

    showLoading() {
        this.cardsContainer.innerHTML = "";
        this.cardsContainer.appendChild(this.loadingElement);
    }

    showError(message) {
        this.cardsContainer.innerHTML = "";
        const errorClone = this.errorElement.cloneNode(true);
        errorClone.querySelector('.error-message').textContent = message;
        this.cardsContainer.appendChild(errorClone);
    }

    bindData(articles) {
        if (!this.cardsContainer || !this.newsCardTemplate) {
            console.error("Required DOM elements not found");
            return;
        }

        this.cardsContainer.innerHTML = "";

        if (!articles || articles.length === 0) {
            this.showNoResults();
            return;
        }

        articles.forEach((article, index) => {
            if (!article.urlToImage) return;
            const cardClone = this.newsCardTemplate.content.cloneNode(true);
            this.fillDataInCard(cardClone, article, index);
            this.cardsContainer.appendChild(cardClone);
        });
    }

    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-icon">📰</div>
            <h3>No articles found</h3>
            <p>Try searching for something else or check back later.</p>
        `;
        this.cardsContainer.appendChild(noResults);
    }

    fillDataInCard(cardClone, article, index) {
        const newsImg = cardClone.querySelector("#news-img");
        const newsTitle = cardClone.querySelector("#news-title");
        const newsSource = cardClone.querySelector("#news-source");
        const newsDesc = cardClone.querySelector("#news-desc");
        const card = cardClone.querySelector(".card");

        if (newsImg) {
            newsImg.src = article.urlToImage;
            newsImg.alt = article.title || 'News article image';
            newsImg.onerror = () => {
                newsImg.src = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400';
                newsImg.alt = 'Default news image';
            };
        }

        if (newsTitle) {
            newsTitle.textContent = article.title || 'No title available';
        }

        if (newsDesc) {
            newsDesc.textContent = article.description || 'No description available';
        }

        if (newsSource) {
            const date = new Date(article.publishedAt).toLocaleString("en-US", {
                timeZone: "Asia/Jakarta",
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            newsSource.textContent = `${article.source.name} · ${date}`;
        }

        // Add accessibility attributes
        if (card) {
            card.setAttribute('role', 'article');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Read article: ${article.title}`);
            
            // Add keyboard navigation
            card.addEventListener("keydown", (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openArticle(article.url);
                }
            });

            card.addEventListener("click", () => {
                this.openArticle(article.url);
            });

            // Setup sharing functionality
            shareManager.setupCardSharing(card, article);
        }
    }

    openArticle(url) {
        if (url && url !== '#') {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }

    updateNavSelection(selectedId) {
        // Remove active class from current selection
        if (this.currentSelectedNav) {
            this.currentSelectedNav.classList.remove("active");
        }

        // Add active class to new selection
        if (selectedId) {
            const navItem = document.getElementById(selectedId);
            if (navItem) {
                this.currentSelectedNav = navItem;
                navItem.classList.add("active");
            }
        } else {
            this.currentSelectedNav = null;
        }
    }
}

export const uiManager = new UIManager();