import '../css/style.css';
import { createIcons, icons } from 'lucide';
import { loadComponents } from './components.js';
import './modal-quiz.js';

// Initialize Components
loadComponents();

// Initialize Lucide icons
createIcons({ icons });

console.log('ai20 loaded');
