import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Send,
  Download
} from 'lucide-react';
import './App.css';
import abrarImage from './assets/abrar.JPG';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('projects');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contactForm, setContactForm] = useState({ name: '', email: '' });

  const skills = [
    { icon: 'ri-html5-line', name: 'HTML5', color: '#E34F26' },
    { icon: 'ri-css3-line', name: 'CSS3', color: '#1572B6' },
    { icon: 'ri-javascript-line', name: 'JavaScript', color: '#F7DF1E' },
    { icon: 'ri-reactjs-line', name: 'React', color: '#61DAFB' },
    { icon: 'ri-code-line', name: 'TypeScript', color: '#3178C6' },
    { icon: 'ri-git-merge-line', name: 'Git', color: '#F05032' },
    { icon: 'ri-tailwind-css-line', name: 'Tailwind', color: '#06B6D4' },
    { icon: 'ri-nodejs-line', name: 'Node.js', color: '#339933' },
    { icon: 'ri-figma-line', name: 'Figma', color: '#F24E1E' },
    { icon: 'ri-image-line', name: 'Photoshop', color: '#31A8FF' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Coffee Website',
      description: 'Short description of the project that was carried out in this portfolio.',
      image: abrarImage,
      technologies: ['ri-reactjs-line', 'ri-css3-line', 'ri-javascript-line'],
      link: '#'
    },
    {
      id: 2,
      title: 'Food Product Design',
      description: 'Short description of the project that was carried out in this portfolio.',
      image: abrarImage,
      technologies: ['ri-figma-line', 'ri-image-line'],
      link: '#'
    },
    {
      id: 3,
      title: 'Restaurant Landing Page',
      description: 'Short description of the project that was carried out in this portfolio.',
      image: abrarImage,
      technologies: ['ri-html5-line', 'ri-css3-line', 'ri-javascript-line'],
      link: '#'
    },
    {
      id: 4,
      title: 'E-commerce Platform',
      description: 'Short description of the project that was carried out in this portfolio.',
      image: abrarImage,
      technologies: ['ri-reactjs-line', 'ri-nodejs-line'],
      link: '#'
    },
    {
      id: 5,
      title: 'Mobile App Design',
      description: 'Short description of the project that was carried out in this portfolio.',
      image: abrarImage,
      technologies: ['ri-figma-line', 'ri-image-line'],
      link: '#'
    }
  ];

  const navigationItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'about', icon: <User size={20} />, label: 'About' },
    { id: 'portfolio', icon: <Briefcase size={20} />, label: 'Portfolio' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
    { id: 'external', icon: <ExternalLink size={20} />, label: 'External' }
  ];

  // Mouse tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', contactForm);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="app">
      {/* First Section - Hero */}
      <section className="hero-section">
        <motion.div 
          className="portfolio-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <div className="left-column">
            {/* Profile Card */}
            <motion.div 
              className="profile-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="profile-header">
                <div className="status-dot"></div>
                <span className="profile-name">About Me</span>
              </div>
              
              <div className="profile-image-container">
                <img 
                  src={abrarImage} 
                  alt="Abrar Ul Hoque" 
                  className="profile-image"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              
              <p className="profile-description">
                I design conversion-first websites that feel effortless to use.
              </p>
              
              <div className="credibility-stats">
                <div className="stat-chip">7+ yrs</div>
                <div className="stat-chip">30+ projects</div>
                <div className="stat-chip">~92 Lighthouse</div>
              </div>
              
              <motion.button 
                className="download-cv-btn secondary-btn"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={16} />
                Download CV
              </motion.button>
            </motion.div>

            {/* Skills Card */}
            <motion.div 
              className="skills-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="skills-title">Skills</h3>
              
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.div 
                    key={skill.name}
                    className="skill-icon"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ backgroundColor: skill.color + '20', color: skill.color }}
                  >
                    <i className={skill.icon} style={{ fontSize: '20px' }}></i>
                  </motion.div>
                ))}
              </div>
              
              <p className="skills-description">
                Visit the projects section to see the work done with these web technologies.
              </p>
            </motion.div>
          </div>

          {/* Center Column - Hero */}
          <div className="center-column">
            <motion.div 
              className="hero-card hero-spotlight"
              variants={cardVariants}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mx', `${x}px`);
                e.currentTarget.style.setProperty('--my', `${y}px`);
              }}
            >
              <div className="hero-background-image">
                <img 
                  src={abrarImage} 
                  alt="Abrar Ul Hoque" 
                  className="hero-background-img"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              </div>
              
              <motion.div 
                className="hero-glass-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="hero-content">
                  <motion.h1 
                    className="hero-name"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Abrar<br />Ul Hoque
                  </motion.h1>
                  <motion.p 
                    className="hero-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    Web Designer & Developer
                  </motion.p>
                </div>
                
                <motion.div 
                  className="hero-navigation"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button 
                    className="primary-cta magnetic-btn"
                    whileHover={{ 
                      y: -2, 
                      scale: 1.02,
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.querySelector('.contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Send size={16} />
                    Start a Project
                  </motion.button>
                  <motion.button 
                    className="secondary-nav-btn"
                    onClick={() => setActiveTab(activeTab === 'projects' ? 'services' : 'projects')}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === 'projects' ? 'Services' : 'Projects'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="right-column">
            <motion.div 
              className="contact-card"
              variants={cardVariants}
            >
              <h3 className="contact-title">Let's Connect</h3>
              
              <p className="contact-description">
                Ready to bring your vision to life? Drop me a line and let's get started.
              </p>
              
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="form-input"
                    required
                  />
                </div>
                <motion.button 
                  type="submit"
                  className="primary-cta magnetic-btn"
                  whileHover={{ 
                    y: -2, 
                    scale: 1.02,
                    transition: { duration: 0.15 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={16} />
                  Send Message
                </motion.button>
              </form>
              
              <div className="social-links">
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1 }}
                >
                  <Linkedin size={18} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1 }}
                >
                  <Github size={18} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1 }}
                >
                  <Globe size={18} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Second Section - Recent Projects */}
      <section className="projects-section">
        <motion.div 
          className="projects-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="projects-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            RECENT PROJECTS
          </motion.h2>
          
          <motion.div 
            className="projects-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
              >
                <div className="project-image-container">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="project-overlay">
                    <motion.button
                      className="visit-project-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={16} />
                      Visit Project
                    </motion.button>
                  </div>
                </div>
                
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="tech-icon">
                        <i className={tech}></i>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Sidebar Navigation */}
      <motion.div 
        className="sidebar-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`nav-icon ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
          >
            {item.icon}
          </motion.div>
        ))}
      </motion.div>

      {/* Subtle background texture */}
      <div className="background-texture"></div>
    </div>
  );
}

export default App;

// Add CSS custom properties for the spotlight effect to the document
if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--mx', '50%');
  document.documentElement.style.setProperty('--my', '50%');
}