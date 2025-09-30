import { CONFIG, MOCK_NEWS_DATA } from './config.js';

class NewsAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.userArticles = [];
    }

    async fetchNews(query = CONFIG.DEFAULT_QUERY) {
        try {
            // Check cache first
            const cacheKey = query.toLowerCase();
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            // Simulate API delay for realistic experience
            await new Promise(resolve => setTimeout(resolve, 800));

            // Combine user articles with mock data
            const allArticles = [...this.userArticles, ...MOCK_NEWS_DATA.articles];
            const filteredArticles = this.filterArticlesByQuery(allArticles, query);
            
            const result = {
                articles: filteredArticles,
                totalResults: filteredArticles.length
            };

            // Cache the result
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw new Error('Failed to fetch news. Please try again later.');
        }
    }

    addUserArticle(articleData) {
        const article = {
            title: articleData.title,
            description: articleData.description,
            urlToImage: articleData.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
            url: articleData.url || '#',
            source: { name: articleData.source },
            publishedAt: new Date().toISOString(),
            isUserCreated: true
        };
        
        // Add to beginning of user articles array
        this.userArticles.unshift(article);
        
        // Clear cache to force refresh
        this.clearCache();
        
        return article;
    }

    filterArticlesByQuery(articles, query) {
        const searchTerm = query.toLowerCase();
        
        // Return all articles for general queries, or filter based on category
        switch (searchTerm) {
            case 'ipl':
                return articles.filter(article => 
                    article.title.toLowerCase().includes('ipl') || 
                    article.description.toLowerCase().includes('cricket') ||
                    article.description.toLowerCase().includes('sport')
                );
            case 'finance':
                return articles.filter(article => 
                    article.title.toLowerCase().includes('finance') || 
                    article.description.toLowerCase().includes('market') ||
                    article.description.toLowerCase().includes('economic')
                );
            case 'politics':
                return articles.filter(article => 
                    article.title.toLowerCase().includes('politic') || 
                    article.description.toLowerCase().includes('government') ||
                    article.description.toLowerCase().includes('reform')
                );
            default:
                return articles.filter(article => 
                    article.title.toLowerCase().includes(searchTerm) || 
                    article.description.toLowerCase().includes(searchTerm)
                );
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

export const newsAPI = new NewsAPI();