import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Shield, 
  Terminal, 
  Cpu, 
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
  Lock
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
  topics: string[];
}

const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-8 border-b border-cyber-green/20 pb-2">
    <Icon className="text-cyber-green w-6 h-6" />
    <h2 className="text-2xl font-bold uppercase tracking-widest">{title}</h2>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string; key?: string | number }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className={`bg-cyber-gray border border-white/5 p-6 rounded-lg hover:border-cyber-green/30 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback projects in case GitHub API fails or is slow
  const fallbackProjects = [
    {
      id: 1,
      name: "MIPS-Processor-Simulator",
      description: "A detailed simulator for MIPS architecture, focusing on instruction execution and memory management.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "C",
      topics: ["architecture", "assembly"]
    },
    {
      id: 2,
      name: "Cyber-Security-Lab",
      description: "Virtual laboratory setups for testing network security, penetration testing, and vulnerability assessment.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "Docker",
      topics: ["security", "networking"]
    },
    {
      id: 3,
      name: "Text-Game-Engine",
      description: "A custom engine for narrative-driven text games with complex state management and branching paths.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 0,
      forks_count: 0,
      language: "Python",
      topics: ["logic", "gamedev"]
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
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
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
      <div className="scanline"></div>
      
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-mono text-cyber-green font-bold text-xl tracking-tighter">
            AB<span className="animate-pulse">_</span>
          </div>
          <nav className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest">
            <a href="#about" className="hover:text-cyber-green transition-colors">About</a>
            <a href="#experience" className="hover:text-cyber-green transition-colors">Experience</a>
            <a href="#skills" className="hover:text-cyber-green transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyber-green transition-colors">Projects</a>
            <a href="#certs" className="hover:text-cyber-green transition-colors">Certs</a>
          </nav>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/alejandroblancojimenez/" target="_blank" rel="noreferrer">
              <Linkedin className="w-5 h-5 hover:text-cyber-blue transition-colors" />
            </a>
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
              <Github className="w-5 h-5 hover:text-white transition-colors" />
            </a>
            <a href="mailto:Alejandro.bj007@gmail.com">
              <Mail className="w-5 h-5 hover:text-cyber-green transition-colors" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-32">
        
        {/* Hero Section */}
        <section className="pt-12 md:pt-24 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-cyber-green text-sm mb-4 block tracking-[0.3em] uppercase">System.Initialize()</span>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-none tracking-tighter">
              ALEJANDRO <br />
              <span className="text-cyber-green glow-text">BLANCO</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed">
              Computer Engineering student at <span className="text-white font-medium">UNIE Universidad</span>. 
              Specializing in <span className="text-cyber-green font-medium">Cybersecurity</span> and Digital Defense. 
              I build secure architectures and analyze threats to protect the digital frontier.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-mono bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <MapPin className="w-4 h-4 text-cyber-green" />
                Madrid, Spain
              </div>
              <div className="flex items-center gap-2 text-sm font-mono bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Globe className="w-4 h-4 text-cyber-blue" />
                Spanish (Native) / English (Advanced)
              </div>
              <div className="flex items-center gap-2 text-sm font-mono bg-cyber-green/10 text-cyber-green px-4 py-2 rounded-full border border-cyber-green/20">
                <Lock className="w-4 h-4" />
                Cybersecurity Focused
              </div>
            </div>
          </motion.div>
        </section>

        {/* About / Education */}
        <section id="about" className="grid md:grid-rows-1 md:grid-cols-2 gap-12">
          <div>
            <SectionTitle title="Mission Brief" icon={Terminal} />
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Computer Engineer based in Madrid with strong knowledge in Java, Python, and C. 
              I bring discipline, consistency, and a continuous improvement mindset to every project, 
              inspired by my dedication to fitness and technology.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              My core focus is on <span className="text-white">Cybersecurity</span>, secure software architectures, 
              and threat analysis. I leverage my background in Cloud (AWS/Azure) to build 
              resilient and protected digital environments.
            </p>
          </div>
          <div>
            <SectionTitle title="Education" icon={BookOpen} />
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-cyber-green/30">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-cyber-green rounded-full shadow-[0_0_10px_#00ff41]" />
                <h3 className="text-xl font-bold">UNIE Universidad</h3>
                <p className="text-cyber-green font-mono text-sm">2023 — 2027</p>
                <p className="text-gray-400 mt-2">Bachelor's Degree in Computer Engineering</p>
                <ul className="mt-2 text-sm text-gray-500 space-y-1">
                  <li>• Cybersecurity & Blockchain Specialization</li>
                  <li>• Cloud Computing (AWS/Azure)</li>
                  <li>• AI & Data Analysis</li>
                </ul>
              </div>
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-white/20 rounded-full" />
                <h3 className="text-xl font-bold">Colegio Nuestra Señora de la Merced</h3>
                <p className="text-gray-500 font-mono text-sm">2021 — 2023</p>
                <p className="text-gray-400 mt-2">Technological Baccalaureate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
          <SectionTitle title="Field Experience" icon={Briefcase} />
          <Card className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">IT Specialist</h3>
                <p className="text-cyber-green font-mono">RTTC</p>
              </div>
              <p className="text-gray-500 font-mono text-sm mt-2 md:mt-0">01/2024 — 03/2025</p>
            </div>
            <ul className="space-y-3 text-gray-400">
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
        </section>

        {/* Skills */}
        <section id="skills">
          <SectionTitle title="Technical Arsenal" icon={Code2} />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 p-4 rounded flex flex-col items-center justify-center text-center group hover:border-cyber-green/50 transition-all"
              >
                <span className="text-white font-medium group-hover:text-cyber-green transition-colors">{skill.name}</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase mt-1">{skill.category}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects (Dynamic from GitHub) */}
        <section id="projects">
          <div className="flex justify-between items-end mb-8 border-b border-cyber-green/20 pb-2">
            <div className="flex items-center gap-3">
              <Github className="text-cyber-green w-6 h-6" />
              <h2 className="text-2xl font-bold uppercase tracking-widest">Live Repositories</h2>
            </div>
            <a 
              href={`https://github.com/${GITHUB_USERNAME}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-mono text-gray-500 hover:text-cyber-green transition-colors flex items-center gap-1 mb-1"
            >
              View all <ExternalLink className="w-3 h-3" />
            </a>
          </div>

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
                      <Terminal className="w-6 h-6 text-cyber-green" />
                      <div className="flex gap-3 text-xs font-mono text-gray-500">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 truncate text-white group-hover:text-cyber-green transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-6 flex-grow leading-relaxed line-clamp-3">
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
                      className="text-xs font-mono text-cyber-green flex items-center gap-1 hover:underline"
                    >
                      Source Code <ExternalLink className="w-3 h-3" />
                    </a>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-lg">
                  <p className="text-gray-500 font-mono">No public repositories found for {GITHUB_USERNAME}.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Certifications */}
        <section id="certs">
          <SectionTitle title="Certifications" icon={Award} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div key={cert.title} className="flex gap-4 items-start p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="bg-cyber-green/10 p-2 rounded">
                  <Shield className="w-5 h-5 text-cyber-green" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{cert.title}</h4>
                  <p className="text-xs text-cyber-blue font-mono mt-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Footer */}
        <footer className="pt-24 pb-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Initialize Contact</h2>
              <p className="text-gray-500 font-mono">Secure connection ready. Awaiting input...</p>
            </div>
            <div className="flex gap-6">
              <a 
                href="https://www.linkedin.com/in/alejandroblancojimenez/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-cyber-blue/10 text-cyber-blue px-6 py-3 rounded-full hover:bg-cyber-blue hover:text-white transition-all font-mono text-sm"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a 
                href="mailto:Alejandro.bj007@gmail.com"
                className="flex items-center gap-2 bg-cyber-green/10 text-cyber-green px-6 py-3 rounded-full hover:bg-cyber-green hover:text-white transition-all font-mono text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
          <div className="mt-24 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Alejandro Blanco // Secure Portfolio v2.0
          </div>
        </footer>

      </main>
    </div>
  );
}
