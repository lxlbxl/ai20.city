import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Layers, 
  Menu,
  X,
  ChevronRight,
  Terminal,
  Play
} from 'lucide-react';

const Fonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      
      :root {
        --color-alabaster: #f4f1ea;
        --color-obsidian: #050505;
        --color-orange: #ff3300;
      }
      
      body {
        background-color: var(--color-alabaster);
        color: var(--color-obsidian);
      }
      
      .font-serif-display {
        font-family: 'Cormorant Garamond', serif;
      }
      
      .font-sans-tech {
        font-family: 'Space Grotesk', sans-serif;
      }

      .noise-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
        opacity: 0.04;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      .hover-underline-animation {
        display: inline-block;
        position: relative;
      }

      .hover-underline-animation::after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: currentColor;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
      }

      .hover-underline-animation:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    `}
  </style>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center ${scrolled ? 'bg-[#f4f1ea]/80 backdrop-blur-md border-b border-[#050505]/5' : ''}`}>
        <div className="flex items-center gap-3 group cursor-pointer z-[101]">
          <div className="w-3 h-3 bg-[#ff3300] rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          <span className="font-serif-display text-2xl md:text-3xl tracking-tight font-medium italic text-[#050505]">Imperium AI.</span>
        </div>

        <div className="hidden md:flex gap-10 font-sans-tech text-xs tracking-[0.2em] uppercase font-medium">
          {['Expertise', 'Markets', 'Intelligence', 'Company'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover-underline-animation opacity-70 hover:opacity-100">
              {item}
            </a>
          ))}
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 group z-[101] relative"
        >
          <span className={`hidden md:block font-sans-tech text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isOpen ? 'text-[#f4f1ea]' : 'text-[#050505]'}`}>
            {isOpen ? 'Close' : 'Menu'}
          </span>
          <div className={`p-2 transition-colors duration-500 ${isOpen ? 'text-[#f4f1ea]' : 'text-[#050505]'}`}>
            {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#050505] text-[#f4f1ea] z-[90] flex flex-col justify-center items-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-6 md:px-12 h-full py-32">
              <div className="flex flex-col justify-center gap-2">
                {['Fractional CAIO', 'Strategy & Audit', 'Implementation', 'Training & Enablement', 'The Lab'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.6 }}
                    className="overflow-hidden"
                  >
                    <a href="#" className="block font-serif-display text-5xl md:text-7xl hover:italic hover:text-[#ff3300] transition-colors duration-300 leading-[1.1]">
                      {item}
                    </a>
                  </motion.div>
                ))}
              </div>
              
              <div className="hidden md:flex flex-col justify-center items-start border-l border-[#f4f1ea]/10 pl-12 gap-12">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.8 }}
                  className="space-y-6"
                >
                  <h4 className="font-sans-tech text-xs uppercase tracking-[0.2em] text-[#ff3300]">Current Focus</h4>
                  <p className="font-serif-display text-2xl max-w-sm text-[#f4f1ea]/80">
                    "Navigating the EU AI Act: A strategic roadmap for enterprise compliance in 2026."
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 font-sans-tech text-xs uppercase border-b border-[#f4f1ea]/30 pb-1">
                    Read Report <ArrowRight size={14} />
                  </a>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1 }}
                  className="grid grid-cols-2 gap-8 w-full"
                >
                   <div>
                      <h4 className="font-sans-tech text-xs uppercase tracking-[0.2em] text-[#ff3300] mb-4">Contact</h4>
                      <div className="font-serif-display text-xl opacity-70">
                         London<br/>Berlin<br/>Paris
                      </div>
                   </div>
                   <div>
                      <h4 className="font-sans-tech text-xs uppercase tracking-[0.2em] text-[#ff3300] mb-4">Social</h4>
                      <div className="font-serif-display text-xl opacity-70">
                         LinkedIn<br/>Twitter<br/>Substack
                      </div>
                   </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-12 overflow-hidden pt-40">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative element */}
          <div className="absolute -top-20 -left-10 md:-left-20 w-40 h-40 md:w-64 md:h-64 border border-[#ff3300]/20 rounded-full blur-3xl" />
          
          <h1 className="font-serif-display text-[15vw] md:text-[11rem] leading-[0.8] tracking-tighter text-[#050505] mix-blend-darken">
            Imperium<span className="text-[#ff3300] text-[1.5rem] md:text-[2rem] align-top font-sans-tech font-bold tracking-normal ml-2">AI</span>
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-end mt-12 md:mt-4 border-t border-[#050505] pt-8">
             <div className="w-full md:w-1/2">
                <p className="font-serif-display text-3xl md:text-5xl leading-[1.1] text-[#050505]">
                  Intelligence, <span className="italic font-light text-[#555]">Institutionalized.</span>
                </p>
             </div>
             
             <div className="w-full md:w-1/3 mt-8 md:mt-0 flex flex-col justify-between h-full">
                <p className="font-sans-tech text-sm md:text-base leading-relaxed opacity-80 max-w-md">
                  We provide Fractional Chief AI Officers and enterprise-grade implementation for the European market. 
                  Bridging Silicon Valley velocity with European compliance.
                </p>
                <div className="flex gap-4 mt-8">
                   <button className="bg-[#050505] text-[#f4f1ea] px-8 py-4 font-sans-tech text-xs uppercase tracking-[0.2em] hover:bg-[#ff3300] transition-colors duration-300">
                     Partner With Us
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 right-12 hidden md:block"
      >
        <div className="w-[1px] h-24 bg-[#050505]/20 overflow-hidden">
          <motion.div 
            animate={{ y: [0, 96] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-1/2 bg-[#050505]"
          />
        </div>
      </motion.div>
    </section>
  );
};

const Marquee = () => {
  return (
    <div className="w-full border-y border-[#050505] py-4 overflow-hidden bg-[#f4f1ea]">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-4 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="font-serif-display text-2xl italic">Fortune 500 Trusted</span>
            <div className="w-2 h-2 bg-[#ff3300] rounded-full" />
            <span className="font-sans-tech uppercase text-sm tracking-widest">Compliance First</span>
            <div className="w-2 h-2 bg-[#ff3300] rounded-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const ServiceCard = ({ number, title, desc, tags }) => (
  <div className="group border-b border-[#050505]/20 py-12 md:py-16 hover:bg-[#fff] transition-colors duration-500 cursor-pointer relative">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-start justify-between gap-8">
      <div className="font-sans-tech text-xs font-bold text-[#ff3300] w-24 pt-2">
        {number}
      </div>
      
      <div className="flex-1">
        <h3 className="font-serif-display text-4xl md:text-6xl mb-4 group-hover:text-[#ff3300] transition-colors duration-300">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
          {tags.map(tag => (
            <span key={tag} className="border border-[#050505]/20 px-3 py-1 text-[10px] font-sans-tech uppercase tracking-widest rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3 relative overflow-hidden">
        <p className="font-sans-tech text-sm leading-7 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          {desc}
        </p>
        <div className="mt-8 flex items-center gap-2 text-[#ff3300] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          <span className="font-sans-tech text-xs uppercase tracking-widest font-bold">Explore</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  </div>
);

const Services = () => {
  const offerings = [
    { 
      number: "01",
      title: "Fractional CAIO", 
      desc: "Executive leadership without the headcount. We provide strategic AI governance, board advisory, and technical roadmap development for mid-market to enterprise organizations.",
      tags: ["Governance", "Strategy", "Board Advisory"]
    },
    { 
      number: "02",
      title: "Strategic Audit", 
      desc: "Comprehensive analysis of your current technical infrastructure, data readiness, and regulatory exposure under the EU AI Act.",
      tags: ["Risk Assessment", "GDPR", "Data Maturity"]
    },
    { 
      number: "03",
      title: "Implementation", 
      desc: "Done-for-you automation pipelines, RAG systems, and custom internal tools. We build the infrastructure that powers your competitive advantage.",
      tags: ["Automation", "LLM Ops", "Custom Dev"]
    },
    { 
      number: "04",
      title: "Enablement", 
      desc: "Upskilling your workforce to leverage generative AI safely. From prompt engineering workshops to executive briefings.",
      tags: ["Training", "Workshops", "Culture"]
    },
  ];

  return (
    <section className="bg-[#f4f1ea] pt-32 pb-12">
      <div className="px-6 md:px-12 mb-16 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end">
        <h2 className="font-serif-display text-5xl md:text-7xl leading-none">
          Productized <br/><span className="italic text-[#050505]/40">Services</span>
        </h2>
        <div className="mt-8 md:mt-0">
          <p className="font-sans-tech text-xs uppercase tracking-[0.2em] border-l-2 border-[#ff3300] pl-4">
            Bespoke Impact, Standardized Delivery
          </p>
        </div>
      </div>
      
      <div className="border-t border-[#050505]/20">
        {offerings.map((offer, i) => (
          <ServiceCard key={i} {...offer} />
        ))}
      </div>
    </section>
  );
};

const Locations = () => {
  return (
    <section className="bg-[#050505] text-[#f4f1ea] py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
        <div>
          <div className="inline-block border border-[#ff3300] px-3 py-1 rounded-full text-[#ff3300] font-sans-tech text-[10px] uppercase tracking-[0.2em] mb-8">
            European Focus
          </div>
          <h2 className="font-serif-display text-5xl md:text-8xl mb-12 leading-[0.9]">
            Local Laws.<br />
            <span className="text-[#ff3300] italic">Global Tech.</span>
          </h2>
          <p className="font-sans-tech text-lg opacity-60 mb-16 max-w-md font-light">
            We navigate the complexity of GDPR, the EU AI Act, and local market nuances. From the financial districts of Frankfurt to the creative hubs of London.
          </p>
          
          <div className="grid grid-cols-2 gap-y-12 gap-x-12 font-sans-tech text-sm tracking-widest">
            {[
              { city: 'London', status: 'Active Hub' },
              { city: 'Berlin', status: 'Active Hub' },
              { city: 'Paris', status: 'Expansion' },
              { city: 'Zurich', status: 'Active Hub' },
              { city: 'Amsterdam', status: 'Coming Soon' },
              { city: 'Madrid', status: 'Partner Network' }
            ].map((loc) => (
              <div key={loc.city} className="flex flex-col gap-2 group cursor-pointer border-l border-[#333] pl-6 hover:border-[#ff3300] transition-colors duration-300">
                <span className="uppercase font-bold text-xl">{loc.city}</span>
                <span className="text-[10px] text-[#ff3300] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">{loc.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[600px] w-full border border-[#333] bg-[#0a0a0a] overflow-hidden">
            {/* Stylized Map / Data Vis */}
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-[80%] h-[80%] border border-[#333] relative rotate-3">
                  <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-[#555]">
                    SYSTEM_STATUS: ONLINE<br/>
                    REGION: EU_WEST
                  </div>
                  
                  {/* Abstract connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="#ff3300" strokeWidth="0.5" strokeOpacity="0.4" />
                    <line x1="20%" y1="30%" x2="70%" y2="20%" stroke="#ff3300" strokeWidth="0.5" strokeOpacity="0.4" />
                    <line x1="80%" y1="70%" x2="70%" y2="20%" stroke="#ff3300" strokeWidth="0.5" strokeOpacity="0.4" />
                    
                    <circle cx="20%" cy="30%" r="4" fill="#ff3300" />
                    <circle cx="80%" cy="70%" r="4" fill="#ff3300" />
                    <circle cx="70%" cy="20%" r="4" fill="#ff3300" />
                  </svg>

                  <div className="absolute bottom-8 right-8 text-right">
                    <div className="font-serif-display text-4xl italic text-[#f4f1ea]">85%</div>
                    <div className="font-sans-tech text-[10px] uppercase text-[#555]">Compliance Rating</div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </section>
  );
};

const QuizCTA = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-[#ff3300] text-[#f4f1ea] flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 border border-[#f4f1ea]/30 px-4 py-2 rounded-full mb-8 font-sans-tech text-xs uppercase tracking-widest bg-[#ff3300]">
            <Terminal size={12} />
            <span>Free 4-Minute Assessment</span>
          </div>
          
          <h2 className="font-serif-display text-6xl md:text-9xl mb-8 leading-[0.85] tracking-tight">
            Ready to <br/><span className="italic opacity-80">Modernize?</span>
          </h2>
          
          <p className="font-sans-tech text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90 font-light">
            Discover your AI Maturity Score. Get a customized roadmap for your vertical. No sales call required.
          </p>
          
          <a href="/quiz" className="group relative inline-flex items-center justify-center overflow-hidden rounded-none bg-[#050505] text-[#f4f1ea] px-12 py-6 font-sans-tech font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#f4f1ea] hover:text-[#ff3300]">
            <span className="relative z-10 flex items-center gap-4">Start Audit <ChevronRight size={16} /></span>
          </a>
          
          <div className="mt-8 flex justify-center gap-8 font-sans-tech text-xs opacity-60">
             <span>No Credit Card Required</span>
             <span>•</span>
             <span>Instant Results</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#f4f1ea] text-[#050505] pt-24 pb-12 px-6 md:px-12 border-t border-[#050505]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
          <div className="w-full lg:w-1/3">
            <h3 className="font-serif-display text-4xl italic mb-6">Imperium AI.</h3>
            <p className="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">
              Architecting the future of European enterprise through applied artificial intelligence and strategic governance.
            </p>
            <div className="mt-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 border border-[#050505] rounded-full flex items-center justify-center hover:bg-[#050505] hover:text-[#f4f1ea] transition-colors cursor-pointer">
                    <span className="font-sans-tech text-xs font-bold">LI</span>
                 </div>
                 <div className="w-12 h-12 border border-[#050505] rounded-full flex items-center justify-center hover:bg-[#050505] hover:text-[#f4f1ea] transition-colors cursor-pointer">
                    <span className="font-sans-tech text-xs font-bold">X</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3">
            {[
              { title: "Sectors", items: ["Healthcare", "Legal", "Finance", "Real Estate", "Manufacturing"] },
              { title: "Product", items: ["Fractional CAIO", "Strategy", "Implementation", "Training"] },
              { title: "Company", items: ["About", "Careers", "Partners", "Contact"] },
              { title: "Legal", items: ["Privacy", "Imprint", "Terms", "Cookies"] }
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-sans-tech text-xs uppercase tracking-[0.2em] text-[#ff3300] mb-6">{col.title}</h4>
                <ul className="space-y-3 font-serif-display text-xl text-[#050505]/60">
                  {col.items.map((item) => (
                    <li key={item} className="hover:text-[#050505] hover:italic cursor-pointer transition-colors duration-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">
          <div className="flex flex-col gap-1">
            <p>© 2026 Imperium AI.</p>
            <p>Made in Berlin.</p>
          </div>
          <p className="mt-4 md:mt-0">All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen">
      <Fonts />
      <div className="noise-overlay" />
      <Navigation />
      <Hero />
      <Marquee />
      <Services />
      <Locations />
      <QuizCTA />
      <Footer />
    </div>
  );
};

export default App;