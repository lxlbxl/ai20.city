
import '../css/style.css';
import { quizFlows } from './quiz-data.js';
import { createIcons } from 'lucide';
import { icons } from './icons.js';

export class QuizModal {
    constructor() {
        this.currentStep = 0;
        this.formData = {};
        this.context = {};
        this.currentFlow = null;
        this.steps = [];

        this.renderContainer();
        this.cacheGlobalDOM();
        this.bindGlobalEvents();
    }

    renderContainer() {
        if (document.getElementById('ai20-quiz-modal')) return;

        const modalHTML = `
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
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        createIcons({ icons });
    }

    cacheGlobalDOM() {
        this.modal = document.getElementById('ai20-quiz-modal');
        this.container = document.getElementById('quiz-steps-container');
        this.progressBar = document.getElementById('quiz-progress-bar');
        this.closeBtns = [
            document.getElementById('close-quiz-btn'),
            document.getElementById('quiz-backdrop')
        ];
    }

    bindGlobalEvents() {
        // Close Modal
        this.closeBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', (e) => {
                if (e.target === btn || btn.contains(e.target)) this.close();
            });
        });

        // Event Delegation for Dynamic Elements
        this.container.addEventListener('click', (e) => {
            const target = e.target;

            // Next Button
            if (target.closest('.quiz-next-btn')) {
                if (this.validateStep()) {
                    this.collectData();
                    this.goToStep(this.currentStep + 1);
                }
            }

            // Prev Button
            if (target.closest('.quiz-prev-btn')) {
                this.goToStep(this.currentStep - 1);
            }

            // Submit Button
            if (target.closest('#quiz-submit-btn')) {
                if (this.validateStep()) {
                    this.collectData();
                    this.submit();
                }
            }

            // Close Success
            if (target.closest('#close-success-btn')) {
                this.close();
            }
        });

        // Event Delegation for Inputs (Styling)
        this.container.addEventListener('change', (e) => {
            const target = e.target;
            if (target.tagName === 'INPUT') {
                if (target.type === 'radio') {
                    // Reset all labels in group
                    const name = target.name;
                    this.container.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                        r.closest('label')?.classList.remove('bg-[#050505]', 'text-white');
                    });
                    // Highlight selected
                    if (target.checked) {
                        target.closest('label')?.classList.add('bg-[#050505]', 'text-white');
                    }
                } else if (target.type === 'checkbox') {
                    if (target.checked) {
                        target.closest('label')?.classList.add('bg-[#ff3300]/10', 'border-[#ff3300]');
                    } else {
                        target.closest('label')?.classList.remove('bg-[#ff3300]/10', 'border-[#ff3300]');
                    }
                }
            }
        });
    }

    renderFlow(flowKey) {
        let flow = quizFlows[flowKey];
        // Fallback
        if (!flow) {
            console.warn(`Quiz flow '${flowKey}' not found, falling back to default.`);
            flow = quizFlows['default'];
        }
        this.currentFlow = flow;

        let html = '';

        // 1. Intro Step
        html += `
        <div class="quiz-step" data-step="0">
            <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Free Assessment</span>
            <h2 class="font-serif-display text-4xl italic mb-6">${flow.title}</h2>
            <p class="font-sans-tech text-sm opacity-70 mb-8 leading-relaxed">
                ${flow.description || "Take this short assessment to get a personalized roadmap."}
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
        `;

        // 2. Dynamic Question Steps
        flow.steps.forEach((step, index) => {
            html += `
            <div class="quiz-step hidden" data-step="${index + 1}">
                <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Step ${index + 1} of ${flow.steps.length + 1}</span>
                <h2 class="font-serif-display text-3xl italic mb-8">${step.title}</h2>
                
                <div class="space-y-6">
                    ${step.questions.map(q => this.renderQuestion(q)).join('')}
                </div>

                <div class="flex gap-4 mt-8">
                    <button class="quiz-prev-btn px-6 py-3 border border-[#050505] text-xs uppercase tracking-widest hover:bg-[#050505] hover:text-[#f4f1ea] transition-colors">Back</button>
                    <button class="quiz-next-btn flex-1 px-8 py-3 bg-[#050505] text-[#f4f1ea] text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">Continue</button>
                </div>
            </div>
            `;
        });

        // 3. Contact Step (Static for now, but could be dynamic)
        const contactStepIndex = flow.steps.length + 1;
        html += `
        <div class="quiz-step hidden" data-step="${contactStepIndex}">
            <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest block mb-4">Final Step</span>
            <h2 class="font-serif-display text-3xl italic mb-4">Get Your Roadmap.</h2>
            <p class="font-sans-tech text-sm opacity-70 mb-8">
                We've analyzed your requirements. Enter your details to receive your ${flow.title} plan.
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
        `;

        // 4. Success Step
        html += `
        <div class="quiz-step hidden text-center py-12" data-step="${contactStepIndex + 1}">
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
        `;

        this.container.innerHTML = html;
        this.steps = this.container.querySelectorAll('.quiz-step');
        createIcons({ icons });
    }

    renderQuestion(q) {
        let inputHtml = '';

        if (q.type === 'radio') {
            inputHtml = `
            <div class="grid grid-cols-2 gap-3">
                ${q.options.map(opt => `
                <label class="radio-label flex items-center justify-center p-4 border border-[#050505]/20 cursor-pointer hover:border-[#ff3300] transition-colors">
                    <input type="radio" name="${q.name}" value="${opt}" class="sr-only" ${q.required ? 'required' : ''}>
                    <span class="font-sans-tech text-sm text-center">${opt}</span>
                </label>
                `).join('')}
            </div>`;
        } else if (q.type === 'checkbox') {
            inputHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${q.options.map(opt => `
                <label class="checkbox-label flex items-center gap-3 p-4 border border-[#050505]/20 cursor-pointer hover:border-[#ff3300] transition-colors">
                    <input type="checkbox" name="${q.name}" value="${opt}" class="accent-[#ff3300] w-4 h-4">
                    <span class="font-sans-tech text-sm">${opt}</span>
                </label>
                `).join('')}
            </div>`;
        } else if (q.type === 'select') {
            inputHtml = `
            <select name="${q.name}" ${q.required ? 'required' : ''} class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
                <option value="">Select an option...</option>
                ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`;
        } else if (q.type === 'text') {
            inputHtml = `
            <input type="text" name="${q.name}" placeholder="${q.placeholder || ''}" ${q.required ? 'required' : ''} class="w-full bg-white p-4 border border-[#050505]/20 font-sans-tech text-sm outline-none focus:border-[#ff3300]">
            `;
        }

        return `
        <div>
            <label class="block font-sans-tech text-[10px] uppercase tracking-widest mb-4">${q.label} ${q.required ? '*' : ''}</label>
            ${inputHtml}
        </div>
        `;
    }


    open(context = {}) {
        this.context = context;
        this.currentStep = 0;

        // Auto-detect context from URL if missing
        const path = window.location.pathname;

        // 1. Check for Location/Niche pattern: /locations/city/niche
        const locationMatch = path.match(/\/locations\/([^\/]+)\/([^\/]+)/);
        if (locationMatch) {
            if (!this.context.location) this.context.location = locationMatch[1]; // city
            if (!this.context.niche) this.context.niche = locationMatch[2];       // niche (industry)
            if (!this.context.industry) this.context.industry = locationMatch[2]; // map niche to industry
        }

        // 2. Check for Service pattern: /services/service-name.html
        const serviceMatch = path.match(/\/services\/([^\/.]+)/);
        if (serviceMatch) {
            if (!this.context.serviceId) this.context.serviceId = serviceMatch[1];
            if (!this.context.industry) this.context.industry = 'General'; // Default for services if specific mapping isn't available
        }

        this.formData = { ...this.context };

        // Determine Flow Key
        let flowKey = 'default';
        if (this.context.niche) {
            flowKey = this.context.niche.toLowerCase().replace(/\s+/g, '-');
        } else if (this.context.serviceId) {
            flowKey = this.context.serviceId;
        } else if (this.context.industry) {
            flowKey = this.context.industry.toLowerCase();
        }

        console.log(`Open Context (Auto-detected):`, this.context);
        console.log(`Resolved Flow Key: ${flowKey}`);

        // Render the specific flow
        this.renderFlow(flowKey);

        this.modal.classList.remove('hidden');
        this.goToStep(0);
    }

    close() {
        this.modal.classList.add('hidden');
    }

    goToStep(stepIndex) {
        this.currentStep = stepIndex;
        this.steps.forEach((step, index) => {
            if (index === stepIndex) step.classList.remove('hidden');
            else step.classList.add('hidden');
        });

        const totalSteps = this.steps.length - 1;
        if (stepIndex < totalSteps) {
            const progress = (stepIndex / (totalSteps - 1)) * 100;
            if (this.progressBar) this.progressBar.style.width = `${progress}%`;
        }
    }

    validateStep() {
        if (!this.steps[this.currentStep]) return true;

        const stepTw = this.steps[this.currentStep];
        const required = stepTw.querySelectorAll('[required]');
        let valid = true;

        required.forEach(input => {
            // Radio buttons need special check
            if (input.type === 'radio') {
                const name = input.name;
                const checked = stepTw.querySelector(`input[name="${name}"]:checked`);
                const container = input.closest('.grid'); // Highlight the container if possible, or just strict validation
                if (!checked) {
                    valid = false;
                    // Optional: visual feedback for radio groups
                }
            } else {
                if (!input.value) {
                    valid = false;
                    input.classList.add('border-[#ff3300]');
                } else {
                    input.classList.remove('border-[#ff3300]');
                }
            }
        });
        return valid;
    }

    collectData() {
        if (!this.steps[this.currentStep]) return;

        const stepEl = this.steps[this.currentStep];
        const inputs = stepEl.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) this.formData[input.name] = [];
                if (input.checked && !this.formData[input.name].includes(input.value)) {
                    this.formData[input.name].push(input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) this.formData[input.name] = input.value;
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    async submit() {
        const btn = document.getElementById('quiz-submit-btn');
        if (btn) {
            btn.textContent = 'Processing...';
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        console.log('FINAL QUIZ SUBMISSION:', this.formData);

        try {
            const response = await fetch('/backend/api/leads.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData)
            });

            const text = await response.text();
            try {
                const result = JSON.parse(text);
                if (result.status === 'success') {
                    // Success - Go to last step (Success Step)
                    const successStepIndex = this.steps.length - 1;
                    this.goToStep(successStepIndex);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (jsonError) {
                console.error('Server Response:', text);
                throw new Error('Invalid Server Response. Check console.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('Error: ' + error.message);
        } finally {
            if (btn) {
                btn.textContent = 'Get My Roadmap';
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }
}

// Global accessor
window.AI20Quiz = new QuizModal();
