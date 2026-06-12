import"./style.js";import{l as g}from"./components.js";import{o as l,c as m}from"./data.js";import{c as p,i as f}from"./lucide.js";import"./modal-quiz.js";g();const a=document.getElementById("services-grid"),o=document.getElementById("core-services-grid"),d=document.getElementById("service-filters");function v(){o&&(o.innerHTML="",m.forEach(t=>{const s=document.createElement("div");s.className="group border border-[#050505]/10 p-8 hover:bg-[#050505] hover:text-[#f4f1ea] transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px]",s.onclick=()=>window.location.href=`./services/${t.id}.html`,s.innerHTML=`
            <div>
                <div class="flex justify-between items-start mb-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border border-[#050505] px-2 py-1 rounded-full group-hover:border-[#f4f1ea] transition-colors">${t.category}</span>
                    <i data-lucide="arrow-up-right" class="group-hover:text-[#ff3300] transition-colors"></i>
                </div>
                <h3 class="font-serif-display text-4xl italic mb-6 group-hover:text-white transition-colors leading-tight">${t.title}</h3>
                <p class="font-sans-tech text-sm opacity-70 group-hover:opacity-100 mb-8 leading-relaxed max-w-md">${t.description}</p>
                
                 <ul class="space-y-2 mb-8 border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6">
                    ${t.benefits.slice(0,3).map(e=>`
                        <li class="flex items-center gap-2 text-xs font-sans-tech opacity-60 group-hover:opacity-90">
                            <span class="w-1 h-1 bg-[#ff3300] rounded-full"></span> ${e}
                        </li>
                    `).join("")}
                </ul>
            </div>
            
            <div class="flex items-center justify-between border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6 mt-auto">
                <div class="flex flex-col">
                    <span class="text-[10px] uppercase tracking-widest opacity-50">${t.price.label}</span>
                    <span class="font-serif-display text-lg">${t.price.amount}</span>
                </div>
                <button class="bg-[#ff3300] text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    View Logic
                </button>
            </div>
        `,o.appendChild(s)}))}function u(t="All"){if(!a)return;a.innerHTML="",(t==="All"?l:l.filter(e=>e.category.includes(t)||e.category===t)).forEach((e,n)=>{const r=document.createElement("div");r.className="group border-b border-[#050505]/10 pb-8 hover:bg-white/50 transition-colors duration-500 p-6 rounded-sm";let i="";e.price&&(i=`
            <div class="mt-8 p-4 bg-[#f4f1ea] border border-[#ff3300]/20 rounded-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-[#ff3300] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    50% Off Setup
                </div>
                <div class="flex flex-col font-sans-tech">
                    <span class="text-xs opacity-50 uppercase tracking-widest line-through decoration-[#ff3300]">
                        Setup: ${e.price.currency}${e.price.setup.toLocaleString()}
                    </span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-xl font-bold text-[#ff3300]">
                            ${e.price.currency}${e.price.discountedSetup.toLocaleString()} Setup
                        </span>
                        <span class="text-xs opacity-60">
                        + ${e.price.currency}${e.price.monthly}/mo
                        </span>
                    </div>
                </div>
            </div>`);const x=e.tags.map(c=>`<span class="px-2 py-1 border border-[#050505]/20 text-[10px] uppercase tracking-wider rounded-full">${c}</span>`).join("");r.innerHTML=`
            <div class="flex flex-col md:flex-row gap-8 justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-4 mb-4">
                        <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest">${String(n+1).padStart(2,"0")}</span>
                        <h3 class="font-serif-display text-3xl italic group-hover:text-[#ff3300] transition-colors">${e.title}</h3>
                    </div>
                    <p class="font-sans-tech text-sm opacity-70 max-w-xl mb-6 leading-relaxed">${e.description}</p>
                    <div class="flex flex-wrap gap-2 mb-6">${x}</div>
                </div>
                <div class="w-full md:w-80">
                    ${i}
                    ${e.valueStack?`
                        <ul class="mt-4 space-y-2 text-[10px] font-sans-tech opacity-60 border-t border-[#050505]/10 pt-4">
                            ${e.valueStack.map(c=>`<li>+ ${c}</li>`).join("")}
                        </ul>
                    `:""}
                    <button class="request-quote-btn mt-6 w-full px-6 py-3 bg-[#050505] text-[#f4f1ea] font-sans-tech text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors" data-offer-id="${e.id}">
                        Request Quote
                    </button>
                    <a href="./services/${e.id}.html" class="block text-center mt-4 font-sans-tech text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-[#ff3300] transition-colors">
                        Learn More →
                    </a>
                </div>
            </div>
        `,a.appendChild(r)}),document.querySelectorAll(".request-quote-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.offerId,r=l.find(i=>i.id===n);r&&window.AI20Quiz?window.AI20Quiz.open({serviceId:r.id,title:r.title,source:"services_grid"}):console.warn("AI20Quiz not found or offer invalid")})})}d&&d.addEventListener("click",t=>{t.target.tagName==="BUTTON"&&(Array.from(d.children).forEach(s=>{s.classList.remove("bg-[#050505]","text-[#f4f1ea]")}),t.target.classList.add("bg-[#050505]","text-[#f4f1ea]"),u(t.target.dataset.filter),p({icons:f}))});o&&v();a&&u();p({icons:f});
