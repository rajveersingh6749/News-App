import { newsAPI } from './api.js';
import { uiManager } from './ui.js';
import { articleCreator } from './create-article.js';

class NewsApp {
    constructor() {
        this.searchButton = document.getElementById("search-button");
        this.searchText = document.getElementById("search-text");
        this.createButton = document.getElementById("create-article-btn");
        this.currentQuery = "technology";
        this.init();
    }

    init() {
        // Load initial news
        this.fetchNews(this.currentQuery);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard navigation for search
        this.setupKeyboardNavigation();
        
        // Initialize article creator
        articleCreator.init();
        
        // Listen for article creation events
        window.addEventListener('articleCreated', () => {
            this.refreshFeed();
        });
    }

    setupEventListeners() {
        // Search functionality
        this.searchButton.addEventListener("click", () => this.handleSearch());
        
        // Enter key for search
        this.searchText.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.handleSearch();
            }
        });
        // Create article button
        this.createButton.addEventListener("click", () => {
            articleCreator.openModal();
        });

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => this.onNavItemClick(item.id));
            item.addEventListener('keydown', (e) => {
                // Trigger refresh event
                window.dispatchEvent(new CustomEvent('articleCreated'));
            });
        });

        // Logo click
        const logo = document.querySelector('.company-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.reload();
            });
        }
    }

    setupKeyboardNavigation() {
        // Add tabindex to navigation items for keyboard accessibility
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });
    }

    async fetchNews(query) {
        this.currentQuery = query;
        try {
            uiManager.showLoading();
            const data = await newsAPI.fetchNews(query);
            uiManager.bindData(data.articles);
        } catch (error) {
            console.error("Error fetching news:", error);
            uiManager.showError(error.message || "Failed to load news articles. Please try again.");
        }
    }

    refreshFeed() {
        // Refresh current view without changing query
        this.fetchNews(this.currentQuery);
    }

    handleSearch() {
        const query = this.searchText.value.trim();
        if (!query) {
            this.showSearchError("Please enter a search term");
            return;
        }
        
        this.fetchNews(query);
        uiManager.updateNavSelection(null);
        
        // Clear any previous search errors
        this.clearSearchError();
    }

    showSearchError(message) {
        // Remove existing error
        this.clearSearchError();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'search-error';
        errorDiv.textContent = message;
        
        const searchBar = document.querySelector('.search-bar');
        searchBar.appendChild(errorDiv);
        
        // Auto-remove error after 3 seconds
        setTimeout(() => this.clearSearchError(), 3000);
    }

    clearSearchError() {
        const existingError = document.querySelector('.search-error');
        if (existingError) {
            existingError.remove();
        }
    }

    onNavItemClick(id) {
        this.fetchNews(id);
        uiManager.updateNavSelection(id);
        
        // Clear search input when navigating via categories
        this.searchText.value = '';
        this.clearSearchError();
    }

    reload() {
        // Clear cache and reload with default content
        newsAPI.clearCache();
        this.searchText.value = '';
        uiManager.updateNavSelection(null);
        this.fetchNews("technology");
        this.clearSearchError();
    }
}

// Initialize the app
const app = new NewsApp();

// Make reload function globally available for the logo click
window.reload = () => app.reload();