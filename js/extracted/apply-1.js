document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('application-form');
            const submitBtn = document.getElementById('submit-button');

            form.addEventListener('submit', () => {
                // Do not preventDefault(). Allow native submission to formsubmit.co.
                // formsubmit.co will handle the redirect to the _next URL.

                // Visual feedback
                if (submitBtn) {
                    submitBtn.textContent = 'Sending...';
                    // We avoid disabling the button immediately to ensure the submit event propagates correctly
                    submitBtn.classList.add('opacity-75', 'cursor-wait');
                }
            });
        });
