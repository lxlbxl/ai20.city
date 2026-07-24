export const quizFlows = {
    // --- DEFAULT FALLBACK ---
    'default': {
        title: "AI Readiness Assessment",
        description: "Identify your highest-impact AI opportunities in 2 minutes.",
        steps: [
            {
                id: "general-goal",
                title: "Primary Objective",
                questions: [
                    {
                        type: "radio",
                        name: "primary_goal",
                        label: "What is your main goal with AI?",
                        options: ["Reduce Operational Costs", "Scale Revenue", "Improve Customer Experience", "Innovate/New Products"],
                        required: true
                    }
                ]
            },
            {
                id: "general-team",
                title: "Team Structure",
                questions: [
                    {
                        type: "radio",
                        name: "team_size",
                        label: "How large is your team?",
                        options: ["Solopreneur", "2-10 Employees", "11-50 Employees", "50+ Employees"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- SERVICE SPECIFIC FLOWS ---

    // 1. AI SDR (Sales)
    'ai-sdr': {
        title: "AI Sales System Assessment",
        description: "Let's build your 24/7 automated sales machine.",
        steps: [
            {
                id: "sdr-volume",
                title: "Outbound Strategy",
                questions: [
                    {
                        type: "radio",
                        name: "lead_volume",
                        label: "How many leads do you contact monthly?",
                        options: ["< 100", "100 - 500", "500 - 1,000", "1,000+"],
                        required: true
                    },
                    {
                        type: "checkbox",
                        name: "channels",
                        label: "Which channels do you use?",
                        options: ["Email", "LinkedIn", "Cold Calls", "SMS"],
                        required: false
                    }
                ]
            },
            {
                id: "sdr-stack",
                title: "Tech Stack",
                questions: [
                    {
                        type: "select",
                        name: "crm",
                        label: "Which CRM do you use?",
                        options: ["HubSpot", "Salesforce", "Pipedrive", "GoHighLevel", "Spreadsheets/None"],
                        required: true
                    }
                ]
            }
        ]
    },

    // 2. AI Receptionist (Voice)
    'ai-receptionist': {
        title: "AI Receptionist Configuration",
        description: "Customize your 24/7 voice agent.",
        steps: [
            {
                id: "voice-volume",
                title: "Call Volume",
                questions: [
                    {
                        type: "radio",
                        name: "call_volume",
                        label: "Approximate inbound calls per day?",
                        options: ["1-10", "11-30", "30-50", "50+"],
                        required: true
                    }
                ]
            },
            {
                id: "voice-tasks",
                title: "Agent Capabilities",
                questions: [
                    {
                        type: "checkbox",
                        name: "capabilities",
                        label: "What should the AI handle?",
                        options: ["Booking Appointments", "Answering FAQs", "Emergency Dispatch", "Taking Orders"],
                        required: true
                    }
                ]
            }
        ]
    },

    // 3. Customer Support Agent
    'ai-support-agent': {
        title: "Support Automation Setup",
        description: "Reduce ticket volume by 80%.",
        steps: [
            {
                id: "support-volume",
                title: "Ticket Volume",
                questions: [
                    {
                        type: "radio",
                        name: "monthly_tickets",
                        label: "Monthly support tickets?",
                        options: ["< 200", "200-1,000", "1,000-5,000", "5,000+"],
                        required: true
                    }
                ]
            },
            {
                id: "support-channels",
                title: "Channels",
                questions: [
                    {
                        type: "checkbox",
                        name: "channels",
                        label: "Where do you need AI support?",
                        options: ["Email", "Live Chat", "WhatsApp", "Phone"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- LOCAL NICHE FLOWS (Mapped from 'niche' parameter) ---

    // Plumbing
    'plumbing': {
        title: "Plumbing AI Assessment",
        description: "Stop missed calls and automate scheduling.",
        steps: [
            {
                id: "plumbing-pain",
                title: "Business Challenges",
                questions: [
                    {
                        type: "checkbox",
                        name: "challenges",
                        label: "What are your biggest headaches?",
                        options: ["Missed Emergency Calls", "Price Shoppers / Tire Kickers", "Scheduling Conflicts", "Following up with old leads"],
                        required: true
                    }
                ]
            },
            {
                id: "plumbing-fleet",
                title: "Operations",
                questions: [
                    {
                        type: "radio",
                        name: "fleet_size",
                        label: "How many trucks/vans?",
                        options: ["1-2", "3-5", "6-10", "10+"],
                        required: true
                    }
                ]
            }
        ]
    },

    // HVAC
    'hvac': {
        title: "HVAC Automation Audit",
        description: "Streamline dispatch and service agreements.",
        steps: [
            {
                id: "hvac-seasonality",
                title: "Seasonality",
                questions: [
                    {
                        type: "radio",
                        name: "busy_season",
                        label: "How do you handle peak season calls?",
                        options: ["Overtime for staff", "Answering Service", "We just miss calls", "Owner answers"],
                        required: true
                    }
                ]
            },
            {
                id: "hvac-systems",
                title: "Systems",
                questions: [
                    {
                        type: "text",
                        name: "fsm_software",
                        label: "What Field Service Software do you use? (e.g. ServiceTitan)",
                        required: false,
                        placeholder: "e.g. ServiceTitan, Housecall Pro"
                    }
                ]
            }
        ]
    },

    // Real Estate
    'real-estate': {
        title: "Real Estate AI Accelerator",
        description: "Automate showing requests and lead qualification.",
        steps: [
            {
                id: "re-volume",
                title: "Deal Flow",
                questions: [
                    {
                        type: "radio",
                        name: "transactions",
                        label: "Annual Transactions (Side)",
                        options: ["0-10", "10-25", "25-50", "50+"],
                        required: true
                    }
                ]
            },
            {
                id: "re-automation",
                title: "Automation Wishlist",
                questions: [
                    {
                        type: "checkbox",
                        name: "wishlist",
                        label: "What would you automate first?",
                        options: ["Lead Qualification", "Showing Scheduling", "Contract Drafting", "Client Database Reactivation"],
                        required: true
                    }
                ]
            }
        ]
    },


    // --- INDUSTRY FLOWS ---

    'healthcare': {
        title: "Healthcare AI Readiness",
        description: "HIPAA-compliant automation for modern practices.",
        steps: [
            {
                id: "hc-systems",
                title: "Ehr & Systems",
                questions: [
                    {
                        type: "text",
                        name: "ehr_system",
                        label: "Which EHR/PMS do you use?",
                        placeholder: "e.g. Epic, Cerner, Dentrix",
                        required: true
                    }
                ]
            },
            {
                id: "hc-goals",
                title: "Efficiency Goals",
                questions: [
                    {
                        type: "checkbox",
                        name: "goals",
                        label: "Primary focus areas",
                        options: ["Patient Intake", "Billing/Claims", "Appointment Reminders", "Clinical Decision Support"],
                        required: true
                    }
                ]
            }
        ]
    },

    'legal': {
        title: "Legal AI Assessment",
        description: "Secure, private AI for case research and drafting.",
        steps: [
            {
                id: "legal-practice",
                title: "Practice Area",
                questions: [
                    {
                        type: "select",
                        name: "practice_area",
                        label: "Primary Practice Area",
                        options: ["Corporate", "Litigation", "Family Law", "Real Estate", "IP", "Other"],
                        required: true
                    }
                ]
            },
            {
                id: "legal-tasks",
                title: "Billable Hours",
                questions: [
                    {
                        type: "checkbox",
                        name: "time_sinks",
                        label: "Where do you lose the most non-billable time?",
                        options: ["Legal Research", "First Drafts", "Client Emails", "Document Review"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- TRIPWIRE: PAID AUDIT ---
    'audit': {
        title: "Book Your AI Opportunity Audit",
        description: "Tell us where it hurts. We'll scope a senior-led audit and 90-day roadmap — fee credited toward your build.",
        steps: [
            {
                id: "audit-focus",
                title: "Where To Look First",
                questions: [
                    {
                        type: "checkbox",
                        name: "focus_areas",
                        label: "Which parts of the business should we audit?",
                        options: ["Sales & Lead Response", "Customer Service", "Back-Office & Admin", "Finance & Collections", "Marketing & Content", "Operations"],
                        required: true
                    }
                ]
            },
            {
                id: "audit-scale",
                title: "Scale & Urgency",
                questions: [
                    {
                        type: "radio",
                        name: "revenue",
                        label: "Approximate annual revenue?",
                        options: ["< $1M", "$1M – $10M", "$10M – $50M", "$50M+"],
                        required: true
                    },
                    {
                        type: "radio",
                        name: "timeline",
                        label: "When do you want systems live?",
                        options: ["ASAP", "This quarter", "This year", "Just exploring"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- HOME SERVICES (US wedge vertical) ---
    'home-services': {
        title: "Home Services AI Audit",
        description: "Stop missed calls and win more jobs on autopilot.",
        steps: [
            {
                id: "hs-trade",
                title: "Your Trade",
                questions: [
                    {
                        type: "select",
                        name: "trade",
                        label: "What trade are you in?",
                        options: ["HVAC", "Plumbing", "Roofing", "Electrical", "Restoration", "General Contractor", "Other"],
                        required: true
                    }
                ]
            },
            {
                id: "hs-pain",
                title: "Where Jobs Leak",
                questions: [
                    {
                        type: "checkbox",
                        name: "leaks",
                        label: "Where are you losing jobs?",
                        options: ["Missed / after-hours calls", "Slow to follow up on leads", "No-shows & cancellations", "Not enough reviews"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- FINANCE & ACCOUNTING ---
    'finance': {
        title: "Finance Automation Assessment",
        description: "Clean books, faster collections, compliant reporting.",
        steps: [
            {
                id: "fin-focus",
                title: "Priorities",
                questions: [
                    {
                        type: "checkbox",
                        name: "priorities",
                        label: "What would you automate first?",
                        options: ["Bookkeeping & Expenses", "Invoicing & Collections", "Reporting & Forecasting", "Document Processing"],
                        required: true
                    }
                ]
            }
        ]
    },

    // --- E-COMMERCE & RETAIL ---
    'ecommerce': {
        title: "E-commerce Growth Assessment",
        description: "Lift AOV and margin with AI merchandising.",
        steps: [
            {
                id: "ecom-platform",
                title: "Your Store",
                questions: [
                    {
                        type: "select",
                        name: "platform",
                        label: "Which platform do you run on?",
                        options: ["Shopify", "WooCommerce", "Amazon", "BigCommerce", "Custom", "Other"],
                        required: true
                    },
                    {
                        type: "radio",
                        name: "monthly_revenue",
                        label: "Monthly store revenue?",
                        options: ["< $10k", "$10k – $50k", "$50k – $250k", "$250k+"],
                        required: true
                    }
                ]
            }
        ]
    }
};
