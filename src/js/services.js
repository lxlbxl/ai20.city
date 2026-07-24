import '../css/style.css';
import { loadComponents } from './components.js';
import { offers, coreServices } from './data.js';
import { createIcons, icons } from 'lucide';
import './modal-quiz.js';

loadComponents();

const grid = document.getElementById('services-grid');
const coreGrid = document.getElementById('core-services-grid');
const filters = document.getElementById('service-filters');

// Create Quote Modal (Centralized Logic is preferred, but keeping fallback)
// Ideally we typically use window.AI20Quiz, but some logic here might be redundant.
// We will focus on rendering logic first.

function renderCoreServices() {
    if (!coreGrid) return;
    // Server-rendered for crawlers - leave it alone.
    if (coreGrid.dataset.ssr === 'true') return;
    coreGrid.innerHTML = '';

    coreServices.forEach(service => {
        const card = document.createElement('div');
        card.className = "group border border-[#050505]/10 p-8 hover:bg-[#050505] hover:text-[#f4f1ea] transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]";
        card.onclick = () => window.location.href = `./services/${service.id}.html`;

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border border-[#050505] px-2 py-1 rounded-full group-hover:border-[#f4f1ea] transition-colors">${service.category}</span>
                    <i data-lucide="arrow-up-right" class="group-hover:text-[#ff3300] transition-colors"></i>
                </div>
                <h3 class="font-serif-display text-4xl italic mb-6 group-hover:text-white transition-colors leading-tight">${service.title}</h3>
                <p class="font-sans-tech text-sm opacity-70 group-hover:opacity-100 mb-8 leading-relaxed max-w-md">${service.description}</p>
                
                 <ul class="space-y-2 mb-8 border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6">
                    ${service.benefits.slice(0, 3).map(benefit => `
                        <li class="flex items-center gap-2 text-xs font-sans-tech opacity-60 group-hover:opacity-90">
                            <span class="w-1 h-1 bg-[#ff3300] rounded-full"></span> ${benefit}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="flex items-center justify-between border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6 mt-auto">
                <div class="flex flex-col">
                    <span class="text-[10px] uppercase tracking-widest opacity-50">${service.price.label}</span>
                    <span class="font-serif-display text-lg">${service.price.amount}</span>
                </div>
                <button class="bg-[#ff3300] text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    View Logic
                </button>
            </div>
        `;
        coreGrid.appendChild(card);
    });
}

function renderServices(filterCategory = 'All') {
    if (!grid) return;
    // The unfiltered grid is server-rendered for crawlers; only take over the
    // DOM once the visitor actually filters.
    if (filterCategory === 'All' && grid.dataset.ssr === 'true' && !grid.dataset.hydrated) {
        grid.dataset.hydrated = 'true';
        attachQuoteHandlers();
        return;
    }
    grid.dataset.hydrated = 'true';
    grid.innerHTML = '';

    const filtered = filterCategory === 'All'
        ? offers
        : offers.filter(offer => offer.category.includes(filterCategory) || offer.category === filterCategory); // Loose matching

    filtered.forEach((offer, index) => {
        const card = document.createElement('div');
        card.className = "group border-b border-[#050505]/10 pb-8 hover:bg-white/50 transition-colors duration-500 p-6 rounded-sm";

        let priceHtml = '';
        if (offer.price) {
            priceHtml = `
            <div class="mt-8 p-4 bg-[#f4f1ea] border border-[#ff3300]/20 rounded-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-[#ff3300] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    50% Off Setup
                </div>
                <div class="flex flex-col font-sans-tech">
                    <span class="text-xs opacity-50 uppercase tracking-widest line-through decoration-[#ff3300]">
                        Setup: ${offer.price.currency}${offer.price.setup.toLocaleString()}
                    </span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-xl font-bold text-[#ff3300]">
                            ${offer.price.currency}${offer.price.discountedSetup.toLocaleString()} Setup
                        </span>
                        <span class="text-xs opacity-60">
                        + ${offer.price.currency}${offer.price.monthly}/mo
                        </span>
                    </div>
                </div>
            </div>`;
        }

        const tagsHtml = offer.tags.map(tag =>
            `<span class="px-2 py-1 border border-[#050505]/20 text-[10px] uppercase tracking-wider rounded-full">${tag}</span>`
        ).join('');

        card.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8 justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-4 mb-4">
                        <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest">${String(index + 1).padStart(2, '0')}</span>
                        <h3 class="font-serif-display text-3xl italic group-hover:text-[#ff3300] transition-colors">${offer.title}</h3>
                    </div>
                    <p class="font-sans-tech text-sm opacity-70 max-w-xl mb-6 leading-relaxed">${offer.description}</p>
                    <div class="flex flex-wrap gap-2 mb-6">${tagsHtml}</div>
                </div>
                <div class="w-full md:w-80">
                    ${priceHtml}
                    ${offer.valueStack ? `
                        <ul class="mt-4 space-y-2 text-[10px] font-sans-tech opacity-60 border-t border-[#050505]/10 pt-4">
                            ${offer.valueStack.map(item => `<li>+ ${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <button class="request-quote-btn mt-6 w-full px-6 py-3 bg-[#050505] text-[#f4f1ea] font-sans-tech text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors" data-offer-id="${offer.id}">
                        Request Quote
                    </button>
                    <a href="./services/${offer.id}.html" class="block text-center mt-4 font-sans-tech text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-[#ff3300] transition-colors">
                        Learn More →
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    attachQuoteHandlers();
}

function attachQuoteHandlers() {
    document.querySelectorAll('.request-quote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const offerId = btn.dataset.offerId;
            const offer = offers.find(o => o.id === offerId);
            if (offer && window.AI20Quiz) {
                // Use the centralized quiz modal, routing to the offer's tailored flow.
                window.AI20Quiz.open({
                    niche: offer.flow || 'default',
                    serviceId: offer.id,
                    title: offer.title,
                    source: 'services_grid'
                });
            } else {
                console.warn('AI20Quiz not found or offer invalid');
            }
        });
    });
}

// Event Listeners for Filters
if (filters) {
    filters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            Array.from(filters.children).forEach(btn => {
                btn.classList.remove('bg-[#050505]', 'text-[#f4f1ea]');
            });
            e.target.classList.add('bg-[#050505]', 'text-[#f4f1ea]');

            renderServices(e.target.dataset.filter);
            createIcons({ icons });
        }
    });
}


// Initial Render based on page type
if (coreGrid) {
    renderCoreServices();
}

if (grid) {
    renderServices();
}

// Initialize Lucide icons after rendering
createIcons({ icons });
