import"./style.js";import{l as r}from"./components.js";import{a as n}from"./data.js";r();const e=document.getElementById("locations-grid");function i(){e.innerHTML="",n.forEach(t=>{const o=document.createElement("div");o.className="flex flex-col gap-2 group cursor-pointer border-l border-[#333] pl-6 hover:border-[#ff3300] transition-colors duration-300",o.innerHTML=`
            <a href="./locations/${t.slug}.html" class="uppercase font-bold text-lg text-obsidian hover:text-[#ff3300] transition-colors">${t.city}</a>
            <span class="text-[10px] text-[#ff3300] opacity-50 group-hover:opacity-100 transition-opacity">${t.status}</span>
        `,e.appendChild(o)})}i();
