class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.successMessage = document.getElementById('successMessage');
        
        this.fields = {
            fullName: {
                element: document.getElementById('fullName'),
                errorElement: document.getElementById('fullNameError'),
                validators: ['required', 'minLength']
            },
            email: {
                element: document.getElementById('email'),
                errorElement: document.getElementById('emailError'),
                validators: ['required', 'email']
            },
            subject: {
                element: document.getElementById('subject'),
                errorElement: document.getElementById('subjectError'),
                validators: ['required', 'minLength']
            },
            message: {
                element: document.getElementById('message'),
                errorElement: document.getElementById('messageError'),
                validators: ['required', 'minLength']
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input event listeners for real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.element.addEventListener('blur', () => this.validateField(fieldName));
            field.element.addEventListener('input', () => this.clearFieldError(fieldName));
        });
    }

    setupRealTimeValidation() {
        // Add debounced validation on input
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            let timeout;
            
            field.element.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (field.element.value.trim()) {
                        this.validateField(fieldName, true);
                    }
                }, 500);
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.shakeForm();
            return;
        }

        await this.submitForm();
    }

    validateForm() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(fieldName, silent = false) {
        const field = this.fields[fieldName];
        const value = field.element.value.trim();
        const validators = field.validators;
        
        let isValid = true;
        let errorMessage = '';

        // Check each validator
        for (const validator of validators) {
            const result = this.runValidator(validator, value, fieldName);
            if (!result.isValid) {
                isValid = false;
                errorMessage = result.message;
                break;
            }
        }

        if (!silent) {
            this.updateFieldUI(fieldName, isValid, errorMessage);
        }

        return isValid;
    }

    runValidator(validator, value, fieldName) {
        switch (validator) {
            case 'required':
                return {
                    isValid: value.length > 0,
                    message: `${this.getFieldLabel(fieldName)} is required`
                };
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    isValid: emailRegex.test(value),
                    message: 'Please enter a valid email address'
                };
            
            case 'minLength':
                const minLength = fieldName === 'message' ? 10 : 2;
                return {
                    isValid: value.length >= minLength,
                    message: `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`
                };
            
            default:
                return { isValid: true, message: '' };
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Full Name',
            email: 'Email Address',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    updateFieldUI(fieldName, isValid, errorMessage) {
        const field = this.fields[fieldName];
        
        // Update input styling
        field.element.classList.remove('error', 'valid');
        field.element.classList.add(isValid ? 'valid' : 'error');
        
        // Update error message
        field.errorElement.textContent = errorMessage;
        field.errorElement.classList.toggle('show', !isValid);
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        field.element.classList.remove('error');
        field.errorElement.classList.remove('show');
    }

    async submitForm() {
        this.setLoadingState(true);
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm();
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Something went wrong. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    simulateAPICall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000); // Simulate 2 second API call
        });
    }

    setLoadingState(isLoading) {
        this.submitBtn.classList.toggle('loading', isLoading);
        this.submitBtn.disabled = isLoading;
    }

    showSuccessMessage() {
        this.successMessage.classList.add('show');
    }

    showErrorMessage(message) {
        // You could implement a toast notification here
        alert(message);
    }

    resetForm() {
        this.form.reset();
        this.successMessage.classList.remove('show');
        
        // Clear all field states
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.element.classList.remove('error', 'valid');
            field.errorElement.classList.remove('show');
        });
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }
}

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject shake animation
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Add some utility functions for enhanced UX
class FormEnhancements {
    static addFloatingLabels() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    static addProgressIndicator() {
        const form = document.getElementById('contactForm');
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        form.insertBefore(progressBar, form.firstChild);
        
        // Update progress based on filled fields
        const updateProgress = () => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            const filledInputs = Array.from(inputs).filter(input => input.value.trim());
            const progress = (filledInputs.length / inputs.length) * 100;
            
            document.querySelector('.progress-fill').style.width = `${progress}%`;
        };
        
        form.addEventListener('input', updateProgress);
    }
}

