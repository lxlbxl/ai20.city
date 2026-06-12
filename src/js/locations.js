import '../css/style.css';
import { loadComponents } from './components.js';
import { cities } from './data.js';

loadComponents();

const grid = document.getElementById('locations-grid');

function renderLocations() {
    grid.innerHTML = '';
    cities.forEach(loc => {
        const item = document.createElement('div');
        item.className = "flex flex-col gap-2 group cursor-pointer border-l border-[#333] pl-6 hover:border-[#ff3300] transition-colors duration-300";
        item.innerHTML = `
            <a href="./locations/${loc.slug}.html" class="uppercase font-bold text-lg text-obsidian hover:text-[#ff3300] transition-colors">${loc.city}</a>
            <span class="text-[10px] text-[#ff3300] opacity-50 group-hover:opacity-100 transition-opacity">${loc.status}</span>
        `;
        grid.appendChild(item);
    });
}

renderLocations();
