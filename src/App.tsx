import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { 
  Shield, 
  Code2, 
  Cpu,
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
  User,
  ExternalLink as LinkIcon
} from "lucide-react";

const GITHUB_USERNAME = "Ghostalex07";
const CONTACT_EMAIL = "Alejandro.bj007@gmail.com";
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/alejandroblancojimenez/",
  github: `https://github.com/${GITHUB_USERNAME}`
};

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const SectionTitle = ({ id, title, icon: Icon, isOpen, onToggle, controlsId }: { id?: string; title: string; icon: any; isOpen?: boolean; onToggle?: () => void; controlsId?: string }) => (
  <button 
    id={id}
    className="flex items-center justify-between w-full mb-8 border-b border-[var(--border-color)] pb-4 cursor-pointer group hover:bg-cyber-green/[0.02] -mx-4 px-4 rounded-t-lg transition-all text-left"
    onClick={onToggle}
    aria-expanded={isOpen}
    aria-controls={controlsId}
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-cyber-green/5 rounded-lg border border-cyber-green/10 group-hover:border-cyber-green/30 transition-all">
        <Icon className="text-cyber-green w-5 h-5 group-hover:scale-110 transition-transform" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight group-hover:text-[var(--text-primary)] transition-colors">{title}</h2>
    </div>
    {onToggle && (
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="opacity-40 group-hover:opacity-100 transition-opacity"
      >
        <ChevronDown className="text-[var(--text-secondary)] w-6 h-6" />
      </motion.div>
    )}
  </button>
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
  const contentId = `${id}-content`;

  return (
    <section id={id} className="scroll-mt-24">
      <SectionTitle 
        title={title} 
        icon={icon} 
        isOpen={isOpen} 
        onToggle={() => setIsOpen(!isOpen)} 
        controlsId={contentId}
      />
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
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

const Card = ({ children, className = "", tag: Tag = "div" }: { children: React.ReactNode; className?: string; key?: string | number; tag?: any }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.01 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-cyber-gray border border-[var(--border-color)] rounded-2xl hover:border-cyber-green/20 hover:shadow-2xl hover:shadow-cyber-green/[0.03] transition-all duration-500 backdrop-blur-sm relative overflow-hidden group/card ${className}`}
  >
    <Tag className="p-6 relative z-10 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {children}
    </Tag>
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
    navigator.clipboard.writeText(CONTACT_EMAIL);
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

  const groupedSkills = React.useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
  }, [skills]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden selection:bg-cyber-green/20 selection:text-cyber-green">
      
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-xl border-b border-[var(--border-color)]">
        <motion.div 
          className="h-[2px] bg-cyber-green origin-left absolute bottom-[-1px] left-0 right-0" 
          style={{ scaleX }}
        />
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="#" className="font-sans text-cyber-green font-bold text-2xl tracking-tighter hover:scale-110 transition-transform" aria-label="Home">
              AB
            </a>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
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
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-cyber-green flex items-center justify-center p-2.5"
                aria-label={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
                title={isLightMode ? "Dark Mode" : "Light Mode"}
              >
                {isLightMode ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-yellow-500 shadow-yellow-500/50" />}
              </button>
              <div className="hidden sm:flex items-center gap-4">
                <a 
                  href={SOCIAL_LINKS.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 hover:text-cyber-blue transition-colors flex items-center"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 text-[var(--text-secondary)]" />
                </a>
                <a 
                  href={SOCIAL_LINKS.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 hover:text-[var(--text-primary)] transition-colors flex items-center"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5 text-[var(--text-secondary)]" />
                </a>
              </div>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-cyber-green"
                aria-label="Toggle Theme"
              >
                {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button 
                className="text-cyber-green p-2.5 bg-white/5 rounded-xl border border-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
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
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
                <Linkedin className="w-5 h-5 text-cyber-blue" />
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
                <Github className="w-5 h-5 text-[var(--text-primary)]" />
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Mail className="w-5 h-5 text-cyber-green" />
              </a>
            </div>
          </motion.div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 md:space-y-32">
        
        {/* Hero Section */}
        <section className="pt-8 md:pt-24 flex flex-col items-start min-h-[60vh] justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="font-sans text-cyber-green text-sm font-semibold mb-4 block tracking-[0.2em] uppercase">Computer Engineering</span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tighter">
              ALEJANDRO <br />
              <span className="text-cyber-green transition-all hover:glow-text">BLANCO</span>
            </h1>
            <p className="text-lg md:text-2xl text-[var(--text-secondary)] max-w-2xl font-light leading-relaxed">
              Computer Engineering student at <span className="text-[var(--text-primary)] font-medium underline decoration-cyber-green/30 decoration-2 underline-offset-4">UNIE Universidad</span>. 
              Dedicated to <span className="text-cyber-green font-medium">Cybersecurity</span> and digital defense.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm bg-cyber-gray px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)]">
                <MapPin className="w-4 h-4 text-cyber-green" />
                Madrid, Spain
              </div>
              <div className="flex items-center gap-2 text-sm bg-cyber-gray px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)]">
                <Globe className="w-4 h-4 text-cyber-blue" />
                Spanish / English (Advanced)
              </div>
              <div className="flex items-center gap-2 text-sm font-medium bg-cyber-green/10 text-cyber-green px-4 py-2 rounded-full border border-cyber-green/20 shadow-lg shadow-cyber-green/5">
                <Shield className="w-4 h-4" />
                Security Specialist
              </div>
            </div>
          </motion.div>
        </section>

        {/* About / Education */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 scroll-mt-32">
          <section aria-labelledby="profile-title">
            <SectionTitle id="profile-title" title="Professional Profile" icon={User} />
            <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
              <p>
                Computer Engineering student at <span className="text-[var(--text-primary)] font-medium">UNIE University</span>, based in Madrid. 
                My professional focus is entirely dedicated to <span className="text-cyber-green font-medium">Cybersecurity</span>.
              </p>
              <p>
                I combine engineering training with a proactive approach to threat analysis, 
                securing digital systems and protecting infrastructure against modern vulnerabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="education-title">
            <SectionTitle id="education-title" title="Education" icon={BookOpen} />
            <div className="space-y-12">
              <article className="relative pl-8 border-l-2 border-cyber-green/20 hover:border-cyber-green/50 transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-cyber-dark border-2 border-cyber-green rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">UNIE Universidad</h3>
                  <p className="text-cyber-green font-medium text-sm">2023 — 2027</p>
                </div>
                <p className="text-[var(--text-primary)] font-medium mt-2">Bachelor's Degree in Computer Engineering</p>
                <ul className="mt-4 text-sm text-[var(--text-secondary)] space-y-4">
                  <li className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-cyber-green/70 shrink-0" />
                    <span>Cybersecurity & Blockchain Specialization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-cyber-blue/70 shrink-0" />
                    <span>Cloud Computing (AWS/Azure)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-cyber-green/70 shrink-0" />
                    <span>AI & Data Analysis</span>
                  </li>
                </ul>
              </article>

              <article className="relative pl-8 border-l-2 border-[var(--border-color)] hover:border-[var(--text-secondary)]/30 transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-cyber-dark border-2 border-[var(--text-secondary)]/30 rounded-full" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Colegio Nuestra Señora de la Merced</h3>
                  <p className="text-[var(--text-secondary)] font-medium text-sm">2021 — 2023</p>
                </div>
                <p className="text-[var(--text-secondary)] mt-2">High School Diploma in Science and Technology</p>
              </article>
            </div>
          </section>
        </div>

        {/* Experience */}
        <CollapsibleSection id="experience" title="Experience" icon={Briefcase}>
          <Card tag="article" className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">IT Specialist</h3>
                <p className="text-cyber-green font-medium flex items-center gap-2 mt-1">
                  RTTC
                  <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)] opacity-30" />
                  <span className="text-[var(--text-secondary)] text-sm font-normal uppercase tracking-wider">Madrid</span>
                </p>
              </div>
              <time className="text-[var(--text-secondary)] text-sm mt-3 md:mt-0 font-medium px-3 py-1 bg-cyber-dark rounded-full border border-[var(--border-color)]">
                01/2024 — 03/2025
              </time>
            </div>
            <ul className="space-y-4 text-[var(--text-secondary)] text-lg">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-green mt-2.5 shrink-0" />
                <span>Resolved complex technical issues and modernized legacy hardware and systems.</span>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-green mt-2.5 shrink-0" />
                <span>Optimized infrastructure processes and provided specialized technical support.</span>
              </li>
            </ul>
          </Card>
        </CollapsibleSection>

        {/* Skills */}
        <CollapsibleSection id="skills" title="Technical Skills" icon={Code2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <Card key={category} className="!p-0 group/skill overflow-visible">
                <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex justify-between items-center bg-cyber-green/[0.02]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyber-green/70">{category}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                </div>
                <div className="p-3.5 flex flex-wrap gap-2">
                  {(items as string[]).map(item => (
                    <motion.span 
                      key={item} 
                      whileHover={{ scale: 1.05, backgroundColor: "var(--accent-primary)", color: "white", borderColor: "var(--accent-primary)" }}
                      className="px-3 py-1.5 bg-cyber-green/[0.03] border border-cyber-green/20 rounded-xl text-sm font-semibold tracking-tight text-[var(--text-primary)] transition-all cursor-default shadow-sm"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleSection>

        {/* Projects (Dynamic from GitHub) */}
        <CollapsibleSection id="projects" title="Projects" icon={Github}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <Card key={repo.id} tag="article" className="h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2 bg-cyber-green/10 rounded-lg">
                        <Code2 className="w-6 h-6 text-cyber-green" />
                      </div>
                      <div className="flex gap-4 text-xs text-[var(--text-secondary)] font-medium">
                        <span className="flex items-center gap-1.5" aria-label={`${repo.stargazers_count} stars`}><Star className="w-3.5 h-3.5" title="Stars" /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1.5" aria-label={`${repo.forks_count} forks`}><GitFork className="w-3.5 h-3.5" title="Forks" /> {repo.forks_count}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover/card:text-cyber-green transition-colors leading-tight">
                      {repo.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                      {repo.description || ""}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border-color)]">
                      {repo.language ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-cyber-blue/10 px-2.5 py-1 rounded-md border border-cyber-blue/20 text-cyber-blue">
                          {repo.language}
                        </span>
                      ) : <span />}
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-cyber-green flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4"
                        aria-label={`View ${repo.name} source code on GitHub`}
                      >
                        Code <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                  <p className="text-[var(--text-secondary)] font-medium">No public repositories found for {GITHUB_USERNAME}.</p>
                </div>
              )}
            </div>
          )}
        </CollapsibleSection>

        {/* Certifications */}
        <CollapsibleSection id="certs" title="Certifications" icon={Award}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.title} tag="article" className="!p-5 h-full">
                <div className="flex gap-4 items-start">
                  <div className="bg-cyber-green/10 p-2.5 rounded-xl border border-cyber-green/10 shrink-0">
                    <Shield className="w-6 h-6 text-cyber-green" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h4 className="font-bold text-base text-[var(--text-primary)] leading-tight">{cert.title}</h4>
                    <p className="text-xs text-cyber-blue font-bold uppercase tracking-wider">{cert.issuer}</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{cert.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleSection>

        {/* Contact / Footer */}
        <footer className="pt-24 pb-12 border-t border-[var(--border-color)]">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="text-center lg:text-left max-w-md">
              <h2 className="text-4xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">Let's connect</h2>
              <p className="text-[var(--text-secondary)] text-lg">
                Available for internships, collaborations, and professional cybersecurity inquiries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href={SOCIAL_LINKS.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-cyber-blue text-white px-10 py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all text-base font-bold shadow-xl shadow-cyber-blue/20"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              <button 
                onClick={copyEmail}
                className="flex items-center justify-center gap-3 bg-white/5 text-[var(--text-primary)] px-10 py-4 rounded-2xl border border-[var(--border-color)] hover:bg-white/10 active:scale-95 transition-all text-base font-bold group"
                aria-label="Copy my email address"
              >
                {copied ? <Check className="w-5 h-5 text-cyber-green" /> : <Mail className="w-5 h-5 text-cyber-green" />}
                {copied ? "Address Copied!" : "Copy Email"}
              </button>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-[var(--border-color)]/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[var(--text-secondary)] text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} Alejandro Blanco Jiménez</p>
            <div className="flex gap-8">
              <a href={SOCIAL_LINKS.github} className="hover:text-cyber-green transition-colors" aria-label="GitHub">GitHub</a>
              <a href={SOCIAL_LINKS.linkedin} className="hover:text-cyber-green transition-colors" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
