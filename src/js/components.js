// Region-aware component loader (header + footer + region switcher).

import { region, ALL_REGIONS, switchRegion, getRegionCookie } from './region-config.js';

// Region switcher pill — current region highlighted, sibling(s) clickable.
const regionSwitcherHtml = (idSuffix = '', dark = false) => {
    const base = dark ? 'text-[#f4f1ea]' : 'text-[#050505]';
    const border = dark ? 'border-[#f4f1ea]/30' : 'border-[#050505]/20';
    const buttons = Object.values(ALL_REGIONS)
        .map((r) => {
            const active = r.key === region.key;
            const activeCls = dark
                ? 'bg-[#f4f1ea] text-[#050505]'
                : 'bg-[#050505] text-[#f4f1ea]';
            const idleCls = dark ? 'text-[#f4f1ea]/70' : 'text-[#050505]/60';
            return `<button data-region="${r.key}" aria-label="Switch to ${r.label}" class="px-3 py-1.5 transition-colors ${active ? activeCls : idleCls + ' hover:text-[#ff3300]'}">${r.shortLabel}</button>`;
        })
        .join('');
    return `<div id="region-switcher${idSuffix}" class="flex items-center border ${border} rounded-full overflow-hidden text-[10px] uppercase tracking-widest font-sans-tech ${base}">${buttons}</div>`;
};

const headerHtml = `
<nav class="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center bg-[#f4f1ea]/90 backdrop-blur-sm" id="main-nav">
  <a href="./index.html" class="flex items-center gap-3 group cursor-pointer z-[101]">
    <div class="w-3 h-3 bg-[#ff3300] rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
    <span class="font-serif-display text-2xl md:text-3xl tracking-tight font-medium italic text-[#050505]">ai20.</span>
  </a>

  <div class="hidden md:flex gap-10 font-sans-tech text-xs tracking-[0.2em] uppercase font-medium">
    <a href="./services.html" class="hover:text-[#ff3300] transition-colors">Expertise</a>
    <a href="./offers.html" class="hover:text-[#ff3300] transition-colors">Offers</a>
    <a href="./locations.html" class="hover:text-[#ff3300] transition-colors">Markets</a>
    <a href="./case-studies.html" class="hover:text-[#ff3300] transition-colors">Case Studies</a>
    <a href="./about.html" class="hover:text-[#ff3300] transition-colors">About</a>
  </div>

  <div class="flex items-center gap-4 z-[101]">
    <div class="hidden md:block">${regionSwitcherHtml()}</div>
    <a href="./quiz.html" class="hidden md:block px-6 py-2 bg-[#ff3300] text-white text-[10px] uppercase tracking-widest hover:bg-[#050505] transition-colors duration-300">
      Free Assessment
    </a>
    <button class="md:hidden flex items-center gap-2 group relative z-50 text-[#050505]" id="mobile-menu-btn">
      <span class="font-sans-tech text-[10px] uppercase tracking-widest font-bold transition-colors duration-300" id="menu-text">Menu</span>
      <div class="flex flex-col gap-1.5 w-8">
          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-top"></div>
          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-bottom"></div>
      </div>
    </button>
  </div>
</nav>

<!-- Mobile Menu Overlay -->
<div id="mobile-menu" class="fixed inset-0 bg-[#050505] text-[#f4f1ea] z-[90] translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col justify-center px-6 md:px-12">
    <div class="grid grid-cols-1 w-full max-w-7xl mx-auto gap-8">
        <div class="flex flex-col gap-2" id="mobile-links">
             <a href="./services.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 hover:text-[#ff3300] hover:italic">Expertise</a>
             <a href="./offers.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[50ms] hover:text-[#ff3300] hover:italic">Offers</a>
             <a href="./locations.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[100ms] hover:text-[#ff3300] hover:italic">Markets</a>
             <a href="./case-studies.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[150ms] hover:text-[#ff3300] hover:italic">Case Studies</a>
             <a href="./about.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[200ms] hover:text-[#ff3300] hover:italic">About</a>
             <a href="./contact.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[250ms] hover:text-[#ff3300] hover:italic">Contact</a>
        </div>

        <div class="border-t border-[#f4f1ea]/10 pt-8 opacity-0 transition-all duration-500 delay-[300ms]" id="mobile-footer">
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <p class="font-sans-tech text-xs uppercase tracking-widest text-[#ff3300]">Region</p>
                    ${regionSwitcherHtml('-mobile', true)}
                </div>
                <p class="font-serif-display text-2xl opacity-80 max-w-sm">"${region.focusQuote}"</p>
                <a href="./quiz.html" class="mt-4 px-8 py-4 bg-[#ff3300] text-white text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors w-fit">
                    Start Assessment
                </a>
            </div>
        </div>
    </div>
</div>
`;

const footerHtml = `
<footer class="bg-[#f4f1ea] border-t border-[#050505]/10 pt-24 pb-12 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div class="w-full lg:w-1/3">
                <h3 class="font-serif-display text-4xl italic mb-6">ai20.</h3>
                <p class="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">
                    ${region.footerBlurb}
                </p>
                <p class="font-sans-tech text-[10px] uppercase tracking-widest opacity-50 mt-6">${region.complianceLine}</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3">
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Expertise</span>
                    <a href="./services.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">All Services</a>
                    <a href="./offers.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Offers</a>
                    <a href="./locations.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Markets</a>
                </div>
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Company</span>
                    <a href="./about.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">About</a>
                    <a href="./contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Contact</a>
                    <a href="./audit.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">AI Audit</a>
                    <a href="./quiz.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Assessment</a>
                </div>
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Legal</span>
                    <a href="./contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Privacy</a>
                    <a href="./contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Terms</a>
                    <a href="./contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Compliance</a>
                </div>
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Social</span>
                    <a href="https://linkedin.com" target="_blank" rel="noopener" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Twitter/X</a>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">
            <div class="flex flex-col gap-1">
                <p>© 2026 ai20.</p>
                <p>${region.madeIn}</p>
            </div>
            <p class="mt-4 md:mt-0">All Rights Reserved.</p>
        </div>
    </div>
</footer>
`;

function bindRegionSwitchers() {
    document.querySelectorAll('[id^="region-switcher"] button[data-region]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.region;
            if (key && key !== region.key) switchRegion(key);
        });
    });
}

export function loadComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

    bindRegionSwitchers();

    // Initialize Mobile Menu Logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuText = document.getElementById('menu-text');
    const topBar = document.getElementById('hamburger-top');
    const bottomBar = document.getElementById('hamburger-bottom');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileFooter = document.getElementById('mobile-footer');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('translate-x-full');
            const isMenuOpen = !mobileMenu.classList.contains('translate-x-full');

            if (isMenuOpen) {
                mobileBtn.classList.remove('text-[#050505]');
                mobileBtn.classList.add('text-[#f4f1ea]');
                menuText.textContent = 'Close';
                topBar.classList.add('rotate-45', 'translate-y-[3px]');
                bottomBar.classList.add('-rotate-45', '-translate-y-[3px]');
                mobileLinks.forEach((link) => link.classList.remove('opacity-0', 'translate-x-[-20px]'));
                mobileFooter.classList.remove('opacity-0');
            } else {
                mobileBtn.classList.remove('text-[#f4f1ea]');
                mobileBtn.classList.add('text-[#050505]');
                menuText.textContent = 'Menu';
                topBar.classList.remove('rotate-45', 'translate-y-[3px]');
                bottomBar.classList.remove('-rotate-45', '-translate-y-[3px]');
                mobileLinks.forEach((link) => link.classList.add('opacity-0', 'translate-x-[-20px]'));
                mobileFooter.classList.add('opacity-0');
            }
        });
    }

    // Respect a prior cross-subdomain choice: if the visitor previously chose a
    // different region, gently reflect it in the switcher (no forced redirect
    // here — the edge/apex layer handles routing).
    void getRegionCookie;
}
