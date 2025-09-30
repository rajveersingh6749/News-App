// Configuration file for the News App
export const CONFIG = {
    // Using a mock API service that doesn't require API keys and supports CORS
    API_BASE_URL: 'https://jsonplaceholder.typicode.com/posts',
    DEFAULT_QUERY: 'technology',
    ITEMS_PER_PAGE: 12
};

// Mock news data for demonstration since News API has CORS restrictions
export const MOCK_NEWS_DATA = {
    articles: [
        {
            title: "Breaking: Major Technology Breakthrough Announced",
            description: "Scientists have made a significant breakthrough in quantum computing that could revolutionize the tech industry.",
            urlToImage: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/tech-breakthrough",
            source: { name: "Tech News" },
            publishedAt: "2024-01-15T10:30:00Z"
        },
        {
            title: "IPL 2024: Record-Breaking Season Begins",
            description: "The Indian Premier League kicks off with unprecedented viewership and exciting new player acquisitions.",
            urlToImage: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/ipl-2024",
            source: { name: "Sports Today" },
            publishedAt: "2024-01-14T15:45:00Z"
        },
        {
            title: "Global Finance Markets Show Strong Recovery",
            description: "International markets demonstrate resilience with significant gains across major indices worldwide.",
            urlToImage: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/finance-recovery",
            source: { name: "Financial Times" },
            publishedAt: "2024-01-13T09:20:00Z"
        },
        {
            title: "Political Reforms Gain Momentum Across Nations",
            description: "Several countries announce comprehensive political reforms aimed at improving governance and transparency.",
            urlToImage: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/political-reforms",
            source: { name: "Global Politics" },
            publishedAt: "2024-01-12T14:10:00Z"
        },
        {
            title: "Environmental Initiative Launches Worldwide",
            description: "A new global environmental initiative aims to reduce carbon emissions by 50% within the next decade.",
            urlToImage: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/environment-initiative",
            source: { name: "Green News" },
            publishedAt: "2024-01-11T11:30:00Z"
        },
        {
            title: "Healthcare Innovation Transforms Patient Care",
            description: "Revolutionary healthcare technology promises to improve patient outcomes and reduce treatment costs significantly.",
            urlToImage: "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400",
            url: "https://example.com/healthcare-innovation",
            source: { name: "Health Today" },
            publishedAt: "2024-01-10T16:20:00Z"
        }
    ]
};