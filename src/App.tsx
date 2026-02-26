import React from "react";
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
  Globe
} from "lucide-react";

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
    { title: "Microsoft AZ-500", issuer: "Microsoft", desc: "Azure Security Technologies" },
    { title: "Microsoft SC-900", issuer: "Microsoft", desc: "Security, Compliance, and Identity Fundamentals" },
    { title: "MS-900", issuer: "Microsoft", desc: "Microsoft 365 Fundamentals" },
    { title: "AI & Critical Thinking", issuer: "Planeta Formación", desc: "Advanced AI concepts" },
    { title: "Hackathon Internacional", issuer: "UPSA", desc: "Digital solutions challenge" },
    { title: "Academia AWS", issuer: "Amazon Web Services", desc: "Cloud computing fundamentals" },
    { title: "Academia Experis", issuer: "Experis", desc: "Soft skills & Professional development" },
  ];

  const projects = [
    {
      title: "MIPS Processor Simulator",
      desc: "A detailed simulator for MIPS architecture, focusing on instruction execution and memory management.",
      tags: ["C", "Assembly", "Architecture"],
      icon: <Cpu className="w-8 h-8 text-cyber-blue" />
    },
    {
      title: "Text-Based Game Engine",
      desc: "A custom engine for narrative-driven text games with complex state management and branching paths.",
      tags: ["Python", "Logic", "GameDev"],
      icon: <Terminal className="w-8 h-8 text-cyber-green" />
    },
    {
      title: "Cybersecurity Lab Environment",
      desc: "Virtual laboratory setups for testing network security, penetration testing, and vulnerability assessment.",
      tags: ["Docker", "Networking", "Security"],
      icon: <Shield className="w-8 h-8 text-purple-500" />
    }
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
              Specializing in <span className="text-cyber-blue font-medium">Cybersecurity</span>, 
              Cloud Infrastructure, and AI.
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
            </div>
          </motion.div>
        </section>

        {/* About / Education */}
        <section id="about" className="grid md:grid-rows-1 md:grid-cols-2 gap-12">
          <div>
            <SectionTitle title="Summary" icon={Terminal} />
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Ingeniero Informático con sede en Madrid, con sólidos conocimientos en Java, Python y C. 
              Apasionado tanto por el fitness como por el mundo de la informática, aportando disciplina, 
              constancia y una mentalidad de mejora continua a cada proyecto.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Enfocado en arquitecturas de software, computación en la nube (AWS/Azure), 
              blockchain, ciberseguridad e IA.
            </p>
          </div>
          <div>
            <SectionTitle title="Education" icon={BookOpen} />
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-cyber-green/30">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-cyber-green rounded-full shadow-[0_0_10px_#00ff41]" />
                <h3 className="text-xl font-bold">UNIE Universidad</h3>
                <p className="text-cyber-green font-mono text-sm">2023 — 2027</p>
                <p className="text-gray-400 mt-2">Licenciatura en Ingeniería Informática</p>
                <ul className="mt-2 text-sm text-gray-500 space-y-1">
                  <li>• Cloud Computing (AWS/Azure)</li>
                  <li>• Cybersecurity & Blockchain</li>
                  <li>• AI & Data Analysis</li>
                </ul>
              </div>
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-white/20 rounded-full" />
                <h3 className="text-xl font-bold">Colegio Nuestra Señora de la Merced</h3>
                <p className="text-gray-500 font-mono text-sm">2021 — 2023</p>
                <p className="text-gray-400 mt-2">Bachillerato Tecnológico</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
          <SectionTitle title="Experience" icon={Briefcase} />
          <Card className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Especialista en TI</h3>
                <p className="text-cyber-green font-mono">RTTC</p>
              </div>
              <p className="text-gray-500 font-mono text-sm mt-2 md:mt-0">01/2024 — 03/2025</p>
            </div>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-cyber-green shrink-0" />
                <span>Resolvió problemas técnicos complejos y modernizó hardware y sistemas anticuados.</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-cyber-green shrink-0" />
                <span>Optimización de procesos de infraestructura y soporte técnico especializado.</span>
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

        {/* Projects */}
        <section id="projects">
          <SectionTitle title="Featured Projects" icon={Cpu} />
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.title} className="flex flex-col h-full">
                <div className="mb-6">{project.icon}</div>
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
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
              <h2 className="text-3xl font-bold mb-2">Let's Connect</h2>
              <p className="text-gray-500 font-mono">Ready for the next security challenge.</p>
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
            &copy; {new Date().getFullYear()} Alejandro Blanco // Built with React & Tailwind
          </div>
        </footer>

      </main>
    </div>
  );
}
