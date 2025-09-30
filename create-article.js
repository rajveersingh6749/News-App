class ArticleCreator {
    constructor() {
        this.modal = null;
        this.form = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.modal = document.getElementById('create-modal');
        this.form = document.getElementById('create-article-form');
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupEventListeners() {
        if (!this.modal || !this.form) return;

        // Close modal events
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        
        closeBtn?.addEventListener('click', () => this.closeModal());
        cancelBtn?.addEventListener('click', () => this.closeModal());

        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    openModal() {
        if (!this.modal) return;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = this.form.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        if (!this.form) return;
        
        this.form.reset();
        this.clearAllErrors();
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id.replace('article-', '');
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'title':
                if (!value) {
                    errorMessage = 'Title is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Title must be at least 10 characters';
                    isValid = false;
                } else if (value.length > 200) {
                    errorMessage = 'Title must be less than 200 characters';
                    isValid = false;
                }
                break;

            case 'description':
                if (!value) {
                    errorMessage = 'Description is required';
                    isValid = false;
                } else if (value.length < 20) {
                    errorMessage = 'Description must be at least 20 characters';
                    isValid = false;
                } else if (value.length > 500) {
                    errorMessage = 'Description must be less than 500 characters';
                    isValid = false;
                }
                break;

            case 'source':
                if (!value) {
                    errorMessage = 'Source is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Source must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'image':
                if (value && !this.isValidUrl(value)) {
                    errorMessage = 'Please enter a valid image URL';
                    isValid = false;
                }
                break;

            case 'url':
                if (value && !this.isValidUrl(value)) {
                    errorMessage = 'Please enter a valid URL';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(fieldName, errorMessage);
        return isValid;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(field) {
        const fieldName = field.id.replace('article-', '');
        this.showFieldError(fieldName, '');
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const articleData = {
            title: document.getElementById('article-title').value.trim(),
            description: document.getElementById('article-description').value.trim(),
            source: document.getElementById('article-source').value.trim(),
            imageUrl: document.getElementById('article-image').value.trim(),
            url: document.getElementById('article-url').value.trim()
        };

        // Validate all fields
        let isFormValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        // Validate optional URL fields
        const urlFields = this.form.querySelectorAll('input[type="url"]');
        urlFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showSubmissionError('Please fix the errors above');
            return;
        }

        try {
            // Import newsAPI dynamically to avoid circular dependency
            const { newsAPI } = await import('./api.js');
            const { uiManager } = await import('./ui.js');
            
            // Add article to API
            const newArticle = newsAPI.addUserArticle(articleData);
            
            // Show success message
            this.showSuccessMessage('Article created successfully!');
            
            // Close modal after short delay
            setTimeout(() => {
                this.closeModal();
                // Refresh the news feed to show the new article without page reload
                if (window.app && window.app.refreshFeed) {
                    window.app.refreshFeed();
                }
            }, 1500);
            
        } catch (error) {
            console.error('Error creating article:', error);
            this.showSubmissionError('Failed to create article. Please try again.');
        }
    }

    showSubmissionError(message) {
        // Remove existing error
        const existingError = this.form.querySelector('.submission-error');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'submission-error';
        errorDiv.style.cssText = `
            background-color: var(--error-color);
            color: white;
            padding: 12px;
            border-radius: var(--border-radius);
            margin-bottom: 16px;
            font-size: 14px;
        `;
        errorDiv.textContent = message;

        // Insert before form actions
        const formActions = this.form.querySelector('.form-actions');
        formActions.parentNode.insertBefore(errorDiv, formActions);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccessMessage(message) {
        // Remove existing messages
        const existingError = this.form.querySelector('.submission-error');
        if (existingError) {
            existingError.remove();
        }

        // Create success element
        const successDiv = document.createElement('div');
        successDiv.className = 'submission-success';
        successDiv.style.cssText = `
            background-color: var(--success-color);
            color: white;
            padding: 12px;
            border-radius: var(--border-radius);
            margin-bottom: 16px;
            font-size: 14px;
        `;
        successDiv.textContent = message;

        // Insert before form actions
        const formActions = this.form.querySelector('.form-actions');
        formActions.parentNode.insertBefore(successDiv, formActions);
    }
}

export const articleCreator = new ArticleCreator();