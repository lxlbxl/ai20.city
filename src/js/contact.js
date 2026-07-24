import '../css/style.css';
import { loadComponents } from './components.js';
import { createIcons } from 'lucide';
import { icons } from './icons.js';

loadComponents();
createIcons({ icons });

const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // Simulate submission
    setTimeout(() => {
        alert('Message sent successfully! We will be in touch within 24 hours.');
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }, 1500);
});
