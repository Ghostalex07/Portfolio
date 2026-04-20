import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Code2, 
  ExternalLink, 
  Mail, 
  Linkedin, 
  MapPin, 
  Award, 
  BookOpen,
  Briefcase,
  ChevronRight,
  Github,
  Globe,
  Star,
  GitFork,
  Lock,
  Menu,
  X,
  ChevronDown,
  Copy,
  Check,
  Sun,
  Moon,
  User
} from "lucide-react";

const GITHUB_USERNAME = "Ghostalex07";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const SectionTitle = ({ title, icon: Icon, isOpen, onToggle }: { title: string; icon: any; isOpen?: boolean; onToggle?: () => void }) => (
  <div 
    className="flex items-center justify-between mb-8 border-b border-cyber-green/20 pb-2 cursor-pointer group"
    onClick={onToggle}
  >
    <div className="flex items-center gap-3">
      <Icon className="text-cyber-green w-6 h-6 group-hover:scale-110 transition-transform" />
      <h2 className="text-2xl font-bold tracking-tight group-hover:text-cyber-green transition-colors">{title}</h2>
    </div>
    {onToggle && (
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown className="text-cyber-green w-6 h-6" />
      </motion.div>
    )}
  </div>
);

const CollapsibleSection = ({ 
  id, 
  title, 
  icon, 
  children, 
  defaultOpen = true 
}: { 
  id: string; 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section id={id} className="scroll-mt-24">
      <SectionTitle 
        title={title} 
        icon={icon} 
        isOpen={isOpen} 
        onToggle={() => setIsOpen(!isOpen)} 
      />
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string; key?: string | number }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`bg-cyber-gray border border-[var(--border-color)] p-6 rounded-xl hover:shadow-xl hover:shadow-cyber-green/5 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(!isLightMode);

  const copyEmail = () => {
    navigator.clipboard.writeText("Alejandro.bj007@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fallback projects in case GitHub API fails or is slow
  const fallbackProjects = [
    {
      id: 1,
      name: "MIPS-Processor-Simulator",
      description: "A detailed simulator for MIPS architecture, focusing on instruction execution and memory management.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "C"
    },
    {
      id: 2,
      name: "Cyber-Security-Lab",
      description: "Virtual laboratory setups for testing network security, penetration testing, and vulnerability assessment.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "Docker"
    },
    {
      id: 3,
      name: "Text-Game-Engine",
      description: "A custom engine for narrative-driven text games with complex state management and branching paths.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "Python"
    }
  ];

  useEffect(() => {
    // Safety timeout: if data doesn't load in 5 seconds, show fallbacks anyway
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Data fetch timed out, using fallbacks.");
        setRepos(fallbackProjects as any);
        setLoading(false);
      }
    }, 5000);

    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Filter to show only non-forked repositories if preferred, 
            // but the user asked for "all", so we'll show all.
            setRepos(data);
          } else {
            setRepos(fallbackProjects as any);
          }
        } else {
          setRepos(fallbackProjects as any);
        }
      } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        setRepos(fallbackProjects as any);
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    };
    fetchRepos();
    return () => clearTimeout(timer);
  }, []);

  const skills = [
    { name: "Java", category: "Backend" },
    { name: "Python", category: "Scripting/AI" },
    { name: "C", category: "Low Level" },
    { name: "MIPS Assembly", category: "Low Level" },
    { name: "HTML/CSS", category: "Frontend" },
    { name: "Docker", category: "DevOps" },
    { name: "Git", category: "Tools" },
    { name: "Transformers", category: "AI" },
    { name: "Jupyter Notebook", category: "Data Science" },
    { name: "R", category: "Data Science" },
    { name: "Cobol", category: "Legacy" },
    { name: "Flet", category: "UI" },
  ];

  const certifications = [
    { title: "Junior Cybersecurity Analyst", issuer: "Cisco", desc: "Foundations of cybersecurity operations and threat analysis" },
    { title: "Microsoft AZ-500", issuer: "Microsoft", desc: "Azure Security Technologies" },
    { title: "Microsoft SC-900", issuer: "Microsoft", desc: "Security, Compliance, and Identity Fundamentals" },
    { title: "Microsoft MS-900", issuer: "Microsoft", desc: "Microsoft 365 Fundamentals" },
    { title: "AI & Critical Thinking", issuer: "Planeta Formación", desc: "Advanced AI concepts" },
    { title: "International Hackathon", issuer: "Universidad Pontificia de Salamanca", desc: "Digital solutions challenge" },
    { title: "AWS Academy", issuer: "Amazon Web Services", desc: "Cloud computing fundamentals" },
    { title: "Experis Academy", issuer: "Experis", desc: "Soft skills & Professional development" },
  ];

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="font-sans text-cyber-green font-bold text-xl tracking-tighter">
              AB
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-cyber-green transition-colors">About</a>
            <a href="#experience" className="hover:text-cyber-green transition-colors">Experience</a>
            <a href="#skills" className="hover:text-cyber-green transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyber-green transition-colors">Projects</a>
            <a href="#certs" className="hover:text-cyber-green transition-colors">Certs</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-cyber-green flex items-center justify-center"
                title="Toggle Theme"
              >
                {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/alejandroblancojimenez/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 hover:text-cyber-blue transition-colors flex items-center"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={`https://github.com/${GITHUB_USERNAME}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 hover:text-[var(--text-primary)] transition-colors flex items-center"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                className="text-cyber-green p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-cyber-dark border-b border-[var(--border-color)] px-6 py-8 space-y-6 font-sans text-lg font-medium"
          >
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyber-green">About</a>
            <a href="#experience" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyber-green">Experience</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyber-green">Skills</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyber-green">Projects</a>
            <a href="#certs" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyber-green">Certs</a>
            <div className="flex gap-6 pt-4 border-t border-[var(--border-color)]">
              <a href="https://www.linkedin.com/in/alejandroblancojimenez/" target="_blank" rel="noreferrer">
                <Linkedin className="w-5 h-5 text-cyber-blue" />
              </a>
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                <Github className="w-5 h-5 text-[var(--text-primary)]" />
              </a>
              <a href="mailto:Alejandro.bj007@gmail.com">
                <Mail className="w-5 h-5 text-cyber-green" />
              </a>
            </div>
          </motion.div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 md:space-y-32">
        
        {/* Hero Section */}
        <section className="pt-8 md:pt-24 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-sans text-cyber-green text-sm font-semibold mb-4 block tracking-[0.2em] uppercase">Computer Engineering</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tighter">
              ALEJANDRO <br />
              <span className="text-cyber-green">BLANCO</span>
            </h1>
            <p className="text-lg md:text-2xl text-[var(--text-secondary)] max-w-2xl font-light leading-relaxed">
              Computer Engineering student at <span className="text-[var(--text-primary)] font-medium">UNIE Universidad</span>. 
              Dedicated to <span className="text-cyber-green font-medium">Cybersecurity</span> and digital defense.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm bg-cyber-gray px-4 py-2 rounded-full border border-[var(--border-color)]">
                <MapPin className="w-4 h-4 text-cyber-green" />
                Madrid, Spain
              </div>
              <div className="flex items-center gap-2 text-sm bg-cyber-gray px-4 py-2 rounded-full border border-[var(--border-color)]">
                <Globe className="w-4 h-4 text-cyber-blue" />
                Spanish (Native) / English (Advanced)
              </div>
              <div className="flex items-center gap-2 text-sm font-medium bg-cyber-green/10 text-cyber-green px-4 py-2 rounded-full border border-cyber-green/20">
                <Shield className="w-4 h-4" />
                Security Specialist
              </div>
            </div>
          </motion.div>
        </section>

        {/* About / Education */}
        <section id="about" className="grid md:grid-rows-1 md:grid-cols-2 gap-12">
          <div>
            <SectionTitle title="Professional Profile" icon={User} />
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Computer Engineering student at UNIE University, based in Madrid. 
              My professional focus is entirely dedicated to <span className="text-[var(--text-primary)] font-medium">Cybersecurity</span>.
            </p>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              I combine engineering training with a proactive approach to threat analysis, 
              securing digital systems and protecting infrastructure against modern vulnerabilities.
            </p>
          </div>
          <div>
            <SectionTitle title="Education" icon={BookOpen} />
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-cyber-green/30">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-cyber-green rounded-full shadow-[0_0_10px_#00ff41]" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">UNIE Universidad</h3>
                <p className="text-cyber-green font-mono text-sm">2023 — 2027</p>
                <p className="text-[var(--text-secondary)] mt-2">Bachelor's Degree in Computer Engineering</p>
                <ul className="mt-2 text-sm text-[var(--text-secondary)] opacity-70 space-y-1">
                  <li>• Cybersecurity & Blockchain Specialization</li>
                  <li>• Cloud Computing (AWS/Azure)</li>
                  <li>• AI & Data Analysis</li>
                </ul>
              </div>
              <div className="relative pl-6 border-l border-[var(--border-color)]">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-[var(--text-secondary)] opacity-30 rounded-full" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Colegio Nuestra Señora de la Merced</h3>
                <p className="text-[var(--text-secondary)] font-mono text-sm">2021 — 2023</p>
                <p className="text-[var(--text-secondary)] mt-2">High School Diploma in Science and Technology</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <CollapsibleSection id="experience" title="Experience" icon={Briefcase}>
          <Card className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">IT Specialist</h3>
                <p className="text-cyber-green font-medium">RTTC</p>
              </div>
              <p className="text-[var(--text-secondary)] text-sm mt-2 md:mt-0">01/2024 — 03/2025</p>
            </div>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-cyber-green shrink-0" />
                <span>Resolved complex technical issues and modernized legacy hardware and systems.</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-cyber-green shrink-0" />
                <span>Optimized infrastructure processes and provided specialized technical support.</span>
              </li>
            </ul>
          </Card>
        </CollapsibleSection>

        {/* Skills */}
        <CollapsibleSection id="skills" title="Technical Skills" icon={Code2}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ y: -5 }}
                className="bg-cyber-gray border border-[var(--border-color)] p-4 rounded flex flex-col items-center justify-center text-center group hover:border-cyber-green/50 transition-all"
              >
                <span className="text-[var(--text-primary)] font-medium group-hover:text-cyber-green transition-colors">{skill.name}</span>
                <span className="text-[10px] text-[var(--text-secondary)] opacity-60 uppercase mt-1 tracking-wider">{skill.category}</span>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Projects (Dynamic from GitHub) */}
        <CollapsibleSection id="projects" title="Projects" icon={Github}>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white/5 animate-pulse rounded-lg border border-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <Card key={repo.id} className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Code2 className="w-6 h-6 text-cyber-green" />
                      <div className="flex gap-3 text-xs text-[var(--text-secondary)] opacity-60">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 truncate text-[var(--text-primary)] group-hover:text-cyber-green transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs mb-6 flex-grow leading-relaxed line-clamp-3">
                      {repo.description || "No description provided for this repository."}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.language && (
                        <span className="text-[10px] font-mono bg-cyber-blue/10 px-2 py-1 rounded border border-cyber-blue/20 text-cyber-blue">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-medium text-cyber-green flex items-center gap-1 hover:underline"
                    >
                      Repository <ExternalLink className="w-3 h-3" />
                    </a>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 border border-dashed border-[var(--border-color)] rounded-lg">
                  <p className="text-[var(--text-secondary)] font-mono">No public repositories found for {GITHUB_USERNAME}.</p>
                </div>
              )}
            </div>
          )}
        </CollapsibleSection>

        {/* Certifications */}
        <CollapsibleSection id="certs" title="Certifications" icon={Award}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div key={cert.title} className="flex gap-4 items-start p-4 border border-[var(--border-color)] rounded-lg hover:bg-cyber-gray transition-colors">
                <div className="bg-cyber-green/10 p-2 rounded">
                  <Shield className="w-5 h-5 text-cyber-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{cert.title}</h4>
                  <p className="text-xs text-cyber-blue font-medium mt-1">{cert.issuer}</p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-70 mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Contact / Footer */}
        <footer className="pt-24 pb-12 border-t border-[var(--border-color)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">Contact Me</h2>
              <p className="text-[var(--text-secondary)]">Available for collaborations and professional inquiries.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <a 
                href="https://www.linkedin.com/in/alejandroblancojimenez/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-cyber-blue/10 text-cyber-blue px-8 py-4 rounded-full hover:bg-cyber-blue hover:text-[var(--bg-main)] transition-all text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <button 
                onClick={copyEmail}
                className="flex items-center justify-center gap-2 bg-cyber-green/10 text-cyber-green px-8 py-4 rounded-full hover:bg-cyber-green hover:text-[var(--bg-main)] transition-all text-sm font-medium group"
              >
                {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>
          </div>
          <div className="mt-24 text-center text-[var(--text-secondary)] text-sm opacity-50">
            &copy; {new Date().getFullYear()} Alejandro Blanco
          </div>
        </footer>

      </main>
    </div>
  );
}
