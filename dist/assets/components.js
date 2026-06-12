const f=`
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

  <div class="flex items-center gap-6 z-[101]">
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
                <p class="font-sans-tech text-xs uppercase tracking-widest text-[#ff3300]">Focus</p>
                <p class="font-serif-display text-2xl opacity-80 max-w-sm">"Navigating the EU AI Act: A strategic roadmap for 2026."</p>
                <a href="./quiz.html" class="mt-4 px-8 py-4 bg-[#ff3300] text-white text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors w-fit">
                    Start Assessment
                </a>
            </div>
        </div>
    </div>
</div>
`,d=`
<footer class="bg-[#f4f1ea] border-t border-[#050505]/10 pt-24 pb-12 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div class="w-full lg:w-1/3">
                <h3 class="font-serif-display text-4xl italic mb-6">ai20.</h3>
                <p class="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">
                    Architecting the future of European enterprise through applied artificial intelligence and strategic governance.
                </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3">
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Expertise</span>
                    <a href="./services.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">All Services</a>
                    <a href="./case-studies.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Case Studies</a>
                    <a href="./locations.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Markets</a>
                </div>
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Company</span>
                    <a href="./about.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">About</a>
                    <a href="./contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Contact</a>
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
                    <a href="https://linkedin.com" target="_blank" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">Twitter/X</a>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">
            <div class="flex flex-col gap-1">
                <p>© 2026 ai20.</p>
                <p>Made in Berlin.</p>
            </div>
            <p class="mt-4 md:mt-0">All Rights Reserved.</p>
        </div>
    </div>
</footer>
`;function p(){const s=document.getElementById("header-placeholder"),i=document.getElementById("footer-placeholder");s&&(s.innerHTML=f),i&&(i.innerHTML=d);const t=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu"),l=document.getElementById("menu-text"),o=document.getElementById("hamburger-top"),r=document.getElementById("hamburger-bottom"),n=document.querySelectorAll(".mobile-link"),c=document.getElementById("mobile-footer");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("translate-x-full"),!e.classList.contains("translate-x-full")?(t.classList.remove("text-[#050505]"),t.classList.add("text-[#f4f1ea]"),l.textContent="Close",o.classList.add("rotate-45","translate-y-[3px]"),r.classList.add("-rotate-45","-translate-y-[3px]"),n.forEach(a=>{a.classList.remove("opacity-0","translate-x-[-20px]")}),c.classList.remove("opacity-0")):(t.classList.remove("text-[#f4f1ea]"),t.classList.add("text-[#050505]"),l.textContent="Menu",o.classList.remove("rotate-45","translate-y-[3px]"),r.classList.remove("-rotate-45","-translate-y-[3px]"),n.forEach(a=>{a.classList.add("opacity-0","translate-x-[-20px]")}),c.classList.add("opacity-0"))})}export{p as l};
