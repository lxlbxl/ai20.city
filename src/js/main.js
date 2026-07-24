import '../css/style.css';
import { createIcons } from 'lucide';
import { icons } from './icons.js';
import { loadComponents } from './components.js';
import './modal-quiz.js';
import { initHeroBackgrounds } from './hero-bg.js';

// Initialize Components
loadComponents();

// Ambient hero background (no-op on pages without [data-hero-bg])
initHeroBackgrounds();

// Initialize Lucide icons
createIcons({ icons });

console.log('ai20 loaded');
