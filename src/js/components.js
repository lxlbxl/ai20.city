// Region-aware component behaviour.
//
// The header and footer markup is server-rendered at build time by
// vite-plugin-region.js, so every nav link exists in the raw HTML for crawlers.
// This module no longer injects markup - it only binds behaviour (mobile menu,
// region switcher) to whatever the server rendered.

import { region, switchRegion } from './region-config.js';

function bindRegionSwitchers() {
    document.querySelectorAll('[id^="region-switcher"] button[data-region]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.region;
            if (key && key !== region.key) switchRegion(key);
        });
    });
}

function bindMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuText = document.getElementById('menu-text');
    const topBar = document.getElementById('hamburger-top');
    const bottomBar = document.getElementById('hamburger-bottom');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileFooter = document.getElementById('mobile-footer');

    if (!mobileBtn || !mobileMenu) return;

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('translate-x-full');
        const isOpen = !mobileMenu.classList.contains('translate-x-full');

        mobileBtn.classList.toggle('text-[#050505]', !isOpen);
        mobileBtn.classList.toggle('text-[#f4f1ea]', isOpen);
        if (menuText) menuText.textContent = isOpen ? 'Close' : 'Menu';

        if (topBar) topBar.classList.toggle('rotate-45', isOpen);
        if (topBar) topBar.classList.toggle('translate-y-[3px]', isOpen);
        if (bottomBar) bottomBar.classList.toggle('-rotate-45', isOpen);
        if (bottomBar) bottomBar.classList.toggle('-translate-y-[3px]', isOpen);

        mobileLinks.forEach((link) => {
            link.classList.toggle('opacity-0', !isOpen);
            link.classList.toggle('translate-x-[-20px]', !isOpen);
        });
        if (mobileFooter) mobileFooter.classList.toggle('opacity-0', !isOpen);
    });
}

export function loadComponents() {
    bindRegionSwitchers();
    bindMobileMenu();
}
