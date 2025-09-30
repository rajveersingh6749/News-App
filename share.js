class ShareManager {
    constructor() {
        this.activeMenu = null;
        this.setupGlobalClickHandler();
    }

    setupGlobalClickHandler() {
        // Close share menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeMenu && !e.target.closest('.share-container')) {
                this.closeShareMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeMenu) {
                this.closeShareMenu();
            }
        });
    }

    setupCardSharing(card, article) {
        const shareButton = card.querySelector('#share-btn');
        const shareMenu = card.querySelector('#share-menu');
        const shareOptions = card.querySelectorAll('.share-option');

        if (!shareButton || !shareMenu) return;

        // Remove IDs to avoid duplicates
        shareButton.removeAttribute('id');
        shareMenu.removeAttribute('id');

        // Share button click handler
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleShareMenu(shareMenu);
        });

        // Share option handlers
        shareOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const platform = option.dataset.platform;
                this.shareArticle(article, platform);
                this.closeShareMenu();
            });

            // Keyboard navigation for share options
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const platform = option.dataset.platform;
                    this.shareArticle(article, platform);
                    this.closeShareMenu();
                }
            });
        });
    }

    toggleShareMenu(menu) {
        // Close any other open menu
        if (this.activeMenu && this.activeMenu !== menu) {
            this.activeMenu.classList.remove('active');
        }

        // Toggle current menu
        menu.classList.toggle('active');
        this.activeMenu = menu.classList.contains('active') ? menu : null;

        // Focus first option when opening
        if (this.activeMenu) {
            const firstOption = menu.querySelector('.share-option');
            if (firstOption) {
                setTimeout(() => firstOption.focus(), 100);
            }
        }
    }

    closeShareMenu() {
        if (this.activeMenu) {
            this.activeMenu.classList.remove('active');
            this.activeMenu = null;
        }
    }

    shareArticle(article, platform) {
        const title = encodeURIComponent(article.title || 'Check out this news article');
        const description = encodeURIComponent(article.description || '');
        const url = encodeURIComponent(article.url || window.location.href);
        const fullText = encodeURIComponent(`${article.title} - ${article.description}`);

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
                break;
            
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
                break;
            
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${fullText}%20${url}`;
                break;
            
            case 'email':
                const subject = encodeURIComponent(`Interesting article: ${article.title}`);
                const body = encodeURIComponent(`I thought you might find this article interesting:\n\n${article.title}\n\n${article.description}\n\nRead more: ${article.url}`);
                shareUrl = `mailto:?subject=${subject}&body=${body}`;
                break;
            
            case 'copy':
                this.copyToClipboard(article);
                return;
            
            default:
                console.error('Unknown sharing platform:', platform);
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
        }
    }

    async copyToClipboard(article) {
        const textToCopy = `${article.title}\n\n${article.description}\n\nRead more: ${article.url}`;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showCopyFeedback('Article link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            this.showCopyFeedback('Failed to copy link. Please try again.', true);
        }
    }

    showCopyFeedback(message, isError = false) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.copy-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create new feedback
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = message;
        
        if (isError) {
            feedback.style.backgroundColor = 'var(--error-color)';
        }

        document.body.appendChild(feedback);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }

    // Web Share API support (for mobile devices)
    async nativeShare(article) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.description,
                    url: article.url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
    }
}

export const shareManager = new ShareManager();