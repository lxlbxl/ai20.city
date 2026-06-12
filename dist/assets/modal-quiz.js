import"./style.js";import{c as r,i as n}from"./lucide.js";const l={default:{title:"AI Readiness Assessment",description:"Identify your highest-impact AI opportunities in 2 minutes.",steps:[{id:"general-goal",title:"Primary Objective",questions:[{type:"radio",name:"primary_goal",label:"What is your main goal with AI?",options:["Reduce Operational Costs","Scale Revenue","Improve Customer Experience","Innovate/New Products"],required:!0}]},{id:"general-team",title:"Team Structure",questions:[{type:"radio",name:"team_size",label:"How large is your team?",options:["Solopreneur","2-10 Employees","11-50 Employees","50+ Employees"],required:!0}]}]},"ai-sdr":{title:"AI Sales System Assessment",description:"Let's build your 24/7 automated sales machine.",steps:[{id:"sdr-volume",title:"Outbound Strategy",questions:[{type:"radio",name:"lead_volume",label:"How many leads do you contact monthly?",options:["< 100","100 - 500","500 - 1,000","1,000+"],required:!0},{type:"checkbox",name:"channels",label:"Which channels do you use?",options:["Email","LinkedIn","Cold Calls","SMS"],required:!1}]},{id:"sdr-stack",title:"Tech Stack",questions:[{type:"select",name:"crm",label:"Which CRM do you use?",options:["HubSpot","Salesforce","Pipedrive","GoHighLevel","Spreadsheets/None"],required:!0}]}]},"ai-receptionist":{title:"AI Receptionist Configuration",description:"Customize your 24/7 voice agent.",steps:[{id:"voice-volume",title:"Call Volume",questions:[{type:"radio",name:"call_volume",label:"Approximate inbound calls per day?",options:["1-10","11-30","30-50","50+"],required:!0}]},{id:"voice-tasks",title:"Agent Capabilities",questions:[{type:"checkbox",name:"capabilities",label:"What should the AI handle?",options:["Booking Appointments","Answering FAQs","Emergency Dispatch","Taking Orders"],required:!0}]}]},"ai-support-agent":{title:"Support Automation Setup",description:"Reduce ticket volume by 80%.",steps:[{id:"support-volume",title:"Ticket Volume",questions:[{type:"radio",name:"monthly_tickets",label:"Monthly support tickets?",options:["< 200","200-1,000","1,000-5,000","5,000+"],required:!0}]},{id:"support-channels",title:"Channels",questions:[{type:"checkbox",name:"channels",label:"Where do you need AI support?",options:["Email","Live Chat","WhatsApp","Phone"],required:!0}]}]},plumbing:{title:"Plumbing AI Assessment",description:"Stop missed calls and automate scheduling.",steps:[{id:"plumbing-pain",title:"Business Challenges",questions:[{type:"checkbox",name:"challenges",label:"What are your biggest headaches?",options:["Missed Emergency Calls","Price Shoppers / Tire Kickers","Scheduling Conflicts","Following up with old leads"],required:!0}]},{id:"plumbing-fleet",title:"Operations",questions:[{type:"radio",name:"fleet_size",label:"How many trucks/vans?",options:["1-2","3-5","6-10","10+"],required:!0}]}]},hvac:{title:"HVAC Automation Audit",description:"Streamline dispatch and service agreements.",steps:[{id:"hvac-seasonality",title:"Seasonality",questions:[{type:"radio",name:"busy_season",label:"How do you handle peak season calls?",options:["Overtime for staff","Answering Service","We just miss calls","Owner answers"],required:!0}]},{id:"hvac-systems",title:"Systems",questions:[{type:"text",name:"fsm_software",label:"What Field Service Software do you use? (e.g. ServiceTitan)",required:!1,placeholder:"e.g. ServiceTitan, Housecall Pro"}]}]},"real-estate":{title:"Real Estate AI Accelerator",description:"Automate showing requests and lead qualification.",steps:[{id:"re-volume",title:"Deal Flow",questions:[{type:"radio",name:"transactions",label:"Annual Transactions (Side)",options:["0-10","10-25","25-50","50+"],required:!0}]},{id:"re-automation",title:"Automation Wishlist",questions:[{type:"checkbox",name:"wishlist",label:"What would you automate first?",options:["Lead Qualification","Showing Scheduling","Contract Drafting","Client Database Reactivation"],required:!0}]}]},healthcare:{title:"Healthcare AI Readiness",description:"HIPAA-compliant automation for modern practices.",steps:[{id:"hc-systems",title:"Ehr & Systems",questions:[{type:"text",name:"ehr_system",label:"Which EHR/PMS do you use?",placeholder:"e.g. Epic, Cerner, Dentrix",required:!0}]},{id:"hc-goals",title:"Efficiency Goals",questions:[{type:"checkbox",name:"goals",label:"Primary focus areas",options:["Patient Intake","Billing/Claims","Appointment Reminders","Clinical Decision Support"],required:!0}]}]},legal:{title:"Legal AI Assessment",description:"Secure, private AI for case research and drafting.",steps:[{id:"legal-practice",title:"Practice Area",questions:[{type:"select",name:"practice_area",label:"Primary Practice Area",options:["Corporate","Litigation","Family Law","Real Estate","IP","Other"],required:!0}]},{id:"legal-tasks",title:"Billable Hours",questions:[{type:"checkbox",name:"time_sinks",label:"Where do you lose the most non-billable time?",options:["Legal Research","First Drafts","Client Emails","Document Review"],required:!0}]}]}};class d{constructor(){this.currentStep=0,this.formData={},this.context={},this.currentFlow=null,this.steps=[],this.renderContainer(),this.cacheGlobalDOM(),this.bindGlobalEvents()}renderContainer(){if(document.getElementById("ai20-quiz-modal"))return;document.body.insertAdjacentHTML("beforeend",`
        <div id="ai20-quiz-modal" class="fixed inset-0 z-[9999] hidden flex items-center justify-center">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm" id="quiz-backdrop"></div>
            
            <!-- Modal Content -->
            <div class="relative w-full max-w-2xl bg-[#f4f1ea] border border-[#050505]/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <!-- Close Button -->
                <button id="close-quiz-btn" class="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center border border-[#050505] hover:bg-[#ff3300] hover:text-white transition-colors">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>

                <!-- Progress Bar -->
                <div class="w-full h-1 bg-[#050505]/10">
                    <div class="h-full bg-[#ff3300] transition-all duration-500" id="quiz-progress-bar" style="width: 0%"></div>
                </div>

                <div id="quiz-steps-container" class="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                    <!-- Dynamic Steps Injected Here -->
                </div>
            </div>
        </div>
        `),r({icons:n})}cacheGlobalDOM(){this.modal=document.getElementById("ai20-quiz-modal"),this.container=document.getElementById("quiz-steps-container"),this.progressBar=document.getElementById("quiz-progress-bar"),this.closeBtns=[document.getElementById("close-quiz-btn"),document.getElementById("quiz-backdrop")]}bindGlobalEvents(){this.closeBtns.forEach(e=>{e&&e.addEventListener("click",s=>{(s.target===e||e.contains(s.target))&&this.close()})}),this.container.addEventListener("click",e=>{const s=e.target;s.closest(".quiz-next-btn")&&this.validateStep()&&(this.collectData(),this.goToStep(this.currentStep+1)),s.closest(".quiz-prev-btn")&&this.goToStep(this.currentStep-1),s.closest("#quiz-submit-btn")&&this.validateStep()&&(this.collectData(),this.submit()),s.closest("#close-success-btn")&&this.close()}),this.container.addEventListener("change",e=>{const s=e.target;if(s.tagName==="INPUT")if(s.type==="radio"){const t=s.name;this.container.querySelectorAll(`input[name="${t}"]`).forEach(i=>{i.closest("label")?.classList.remove("bg-[#050505]","text-white")}),s.checked&&s.closest("label")?.classList.add("bg-[#050505]","text-white")}else s.type==="checkbox"&&(s.checked?s.closest("label")?.classList.add("bg-[#ff3300]/10","border-[#ff3300]"):s.closest("label")?.classList.remove("bg-[#ff3300]/10","border-[#ff3300]"))})}renderFlow(e){let s=l[e];s||(console.warn(`Quiz flow '${e}' not found, falling back to default.`),s=l.default),this.currentFlow=s;let t="";t+=`
        <div class="quiz-step" data-step="0">
            <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Free Assessment</span>
            <h2 class="font-serif-display text-4xl italic mb-6">${s.title}</h2>
            <p class="font-sans-tech text-sm opacity-70 mb-8 leading-relaxed">
                ${s.description||"Take this short assessment to get a personalized roadmap."}
            </p>
            <div class="flex flex-col gap-4 p-6 border border-[#050505]/10 mb-8 bg-white/50">
                 <div class="flex items-center gap-4">
                    <div class="w-8 h-8 bg-[#ff3300] text-white flex items-center justify-center font-bold text-sm">1</div>
                    <span class="font-sans-tech text-sm">Analyze your current setup</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 bg-[#ff3300] text-white flex items-center justify-center font-bold text-sm">2</div>
                    <span class="font-sans-tech text-sm">Identify automation opportunities</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 bg-[#ff3300] text-white flex items-center justify-center font-bold text-sm">3</div>
                    <span class="font-sans-tech text-sm">Get your custom Strategy</span>
                </div>
            </div>
            <button class="quiz-next-btn w-full px-8 py-4 bg-[#050505] text-[#f4f1ea] text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                Start Assessment
            </button>
        </div>
        `,s.steps.forEach((a,o)=>{t+=`
            <div class="quiz-step hidden" data-step="${o+1}">
                <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Step ${o+1} of ${s.steps.length+1}</span>
                <h2 class="font-serif-display text-3xl italic mb-8">${a.title}</h2>
                
                <div class="space-y-6">
                    ${a.questions.map(c=>this.renderQuestion(c)).join("")}
                </div>

                <div class="flex gap-4 mt-8">
                    <button class="quiz-prev-btn px-6 py-3 border border-[#050505] text-xs uppercase tracking-widest hover:bg-[#050505] hover:text-[#f4f1ea] transition-colors">Back</button>
                    <button class="quiz-next-btn flex-1 px-8 py-3 bg-[#050505] text-[#f4f1ea] text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">Continue</button>
                </div>
            </div>
            `});const i=s.steps.length+1;t+=`
        <div class="quiz-step hidden" data-step="${i}">
            <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Final Step</span>
            <h2 class="font-serif-display text-3xl italic mb-4">Get Your Roadmap.</h2>
            <p class="font-sans-tech text-sm opacity-70 mb-8">
                We've analyzed your requirements. Enter your details to receive your ${s.title} plan.
            </p>
            
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-2">First Name *</label>
                        <input type="text" name="firstName" required class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                    </div>
                    <div>
                        <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-2">Last Name *</label>
                        <input type="text" name="lastName" required class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                    </div>
                </div>
                <div>
                    <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-2">Work Email *</label>
                    <input type="email" name="email" required class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                </div>
                <div>
                    <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-2">Company Name</label>
                    <input type="text" name="company" class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                </div>
            </div>

            <div class="flex gap-4 mt-8">
                <button class="quiz-prev-btn px-6 py-3 border border-[#050505] text-xs uppercase tracking-widest hover:bg-[#050505] hover:text-[#f4f1ea] transition-colors">Back</button>
                <button id="quiz-submit-btn" class="flex-1 px-8 py-3 bg-[#ff3300] text-white text-xs uppercase tracking-widest hover:bg-[#050505] transition-colors">
                    Get My Roadmap
                </button>
            </div>
        </div>
        `,t+=`
        <div class="quiz-step hidden text-center py-12" data-step="${i+1}">
            <div class="w-20 h-20 bg-[#ff3300] text-white rounded-full flex items-center justify-center mx-auto mb-8">
                <i data-lucide="check" class="w-10 h-10"></i>
            </div>
            <h2 class="font-serif-display text-4xl italic mb-4">Request Received.</h2>
            <p class="font-sans-tech text-sm opacity-70 max-w-md mx-auto mb-8">
                Your personalized AI roadmap is being generated. Check your email in the next 5 minutes.
            </p>
            <button id="close-success-btn" class="px-8 py-3 bg-[#050505] text-[#f4f1ea] text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                Close
            </button>
        </div>
        `,this.container.innerHTML=t,this.steps=this.container.querySelectorAll(".quiz-step"),r({icons:n})}renderQuestion(e){let s="";return e.type==="radio"?s=`
            <div class="grid grid-cols-2 gap-3">
                ${e.options.map(t=>`
                <label class="radio-label flex items-center justify-center p-4 border border-[#050505]/20 cursor-pointer hover:border-[#ff3300] transition-colors">
                    <input type="radio" name="${e.name}" value="${t}" class="sr-only" ${e.required?"required":""}>
                    <span class="font-sans-tech text-sm text-center">${t}</span>
                </label>
                `).join("")}
            </div>`:e.type==="checkbox"?s=`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${e.options.map(t=>`
                <label class="checkbox-label flex items-center gap-3 p-4 border border-[#050505]/20 cursor-pointer hover:border-[#ff3300] transition-colors">
                    <input type="checkbox" name="${e.name}" value="${t}" class="accent-[#ff3300] w-4 h-4">
                    <span class="font-sans-tech text-sm">${t}</span>
                </label>
                `).join("")}
            </div>`:e.type==="select"?s=`
            <select name="${e.name}" ${e.required?"required":""} class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                <option value="">Select an option...</option>
                ${e.options.map(t=>`<option value="${t}">${t}</option>`).join("")}
            </select>`:e.type==="text"&&(s=`
            <input type="text" name="${e.name}" placeholder="${e.placeholder||""}" ${e.required?"required":""} class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
            `),`
        <div>
            <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-4">${e.label} ${e.required?"*":""}</label>
            ${s}
        </div>
        `}open(e={}){this.context=e,this.currentStep=0;const s=window.location.pathname,t=s.match(/\/locations\/([^\/]+)\/([^\/]+)/);t&&(this.context.location||(this.context.location=t[1]),this.context.niche||(this.context.niche=t[2]),this.context.industry||(this.context.industry=t[2]));const i=s.match(/\/services\/([^\/.]+)/);i&&(this.context.serviceId||(this.context.serviceId=i[1]),this.context.industry||(this.context.industry="General")),this.formData={...this.context};let a="default";this.context.niche?a=this.context.niche.toLowerCase().replace(/\s+/g,"-"):this.context.serviceId?a=this.context.serviceId:this.context.industry&&(a=this.context.industry.toLowerCase()),console.log("Open Context (Auto-detected):",this.context),console.log(`Resolved Flow Key: ${a}`),this.renderFlow(a),this.modal.classList.remove("hidden"),this.goToStep(0)}close(){this.modal.classList.add("hidden")}goToStep(e){this.currentStep=e,this.steps.forEach((t,i)=>{i===e?t.classList.remove("hidden"):t.classList.add("hidden")});const s=this.steps.length-1;if(e<s){const t=e/(s-1)*100;this.progressBar&&(this.progressBar.style.width=`${t}%`)}}validateStep(){if(!this.steps[this.currentStep])return!0;const e=this.steps[this.currentStep],s=e.querySelectorAll("[required]");let t=!0;return s.forEach(i=>{if(i.type==="radio"){const a=i.name,o=e.querySelector(`input[name="${a}"]:checked`);i.closest(".grid"),o||(t=!1)}else i.value?i.classList.remove("border-[#ff3300]"):(t=!1,i.classList.add("border-[#ff3300]"))}),t}collectData(){if(!this.steps[this.currentStep])return;this.steps[this.currentStep].querySelectorAll("input, select").forEach(t=>{t.type==="checkbox"?(this.formData[t.name]||(this.formData[t.name]=[]),t.checked&&!this.formData[t.name].includes(t.value)&&this.formData[t.name].push(t.value)):t.type==="radio"?t.checked&&(this.formData[t.name]=t.value):this.formData[t.name]=t.value})}async submit(){const e=document.getElementById("quiz-submit-btn");e&&(e.textContent="Processing...",e.disabled=!0,e.classList.add("opacity-50","cursor-not-allowed")),console.log("FINAL QUIZ SUBMISSION:",this.formData);try{const t=await(await fetch("/backend/api/leads.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)})).text();try{const i=JSON.parse(t);if(i.status==="success"){const a=this.steps.length-1;this.goToStep(a)}else throw new Error(i.message||"Submission failed")}catch{throw console.error("Server Response:",t),new Error("Invalid Server Response. Check console.")}}catch(s){console.error("Submission Error:",s),alert("Error: "+s.message)}finally{e&&(e.textContent="Get My Roadmap",e.disabled=!1,e.classList.remove("opacity-50","cursor-not-allowed"))}}}window.AI20Quiz=new d;
