import '../css/style.css';
import { loadComponents } from './components.js';

loadComponents();

const steps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const submitBtn = document.querySelector('.submit-btn');
const progressBar = document.getElementById('progress-bar');

let currentStep = 0;
const totalSteps = steps.length;

// Store form data
const formData = {};

function updateStep() {
    steps.forEach((step, index) => {
        if (index === currentStep) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });

    // Update Progress (skip step 0 which is intro)
    const progress = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function collectFormData() {
    // Collect all form inputs from current step
    const currentStepEl = steps[currentStep];
    const inputs = currentStepEl.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (!formData[input.name]) formData[input.name] = [];
            if (input.checked) formData[input.name].push(input.value);
        } else if (input.type === 'radio') {
            if (input.checked) formData[input.name] = input.value;
        } else {
            formData[input.name] = input.value;
        }
    });
}

function validateStep() {
    const currentStepEl = steps[currentStep];
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let valid = true;

    requiredInputs.forEach(input => {
        if (!input.value) {
            valid = false;
            input.classList.add('border-[#ff3300]');
        } else {
            input.classList.remove('border-[#ff3300]');
        }
    });

    return valid;
}

// Next button handlers
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Skip validation for intro step
        if (currentStep > 0 && !validateStep()) {
            return;
        }

        collectFormData();

        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateStep();
        }
    });
});

// Previous button handlers
prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    });
});

// Submit handler
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        if (!validateStep()) return;

        collectFormData();

        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            const response = await fetch('/backend/api/leads.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                setTimeout(() => {
                    // Redirect to thank you page
                    window.location.href = './thank-you.html';
                }, 1000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('Error: ' + error.message);
            submitBtn.textContent = 'Get My Roadmap';
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

// Radio button visual selection
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const name = radio.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
            r.closest('label').classList.remove('bg-[#050505]', 'text-white');
        });
        if (radio.checked) {
            radio.closest('label').classList.add('bg-[#050505]', 'text-white');
        }
    });
});

// Initialize
updateStep();
