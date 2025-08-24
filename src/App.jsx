import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
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
  Download,
  Code,
  Award
} from 'lucide-react';
import './App.css';
import abrarImage from './assets/abrar.JPG';
import abrarMobileImage from './assets/abrar-2.jpg';
import colorSampleImage from './assets/color-sample.png';
import basementImage from './assets/basement.png';
import vapeSocietyImage from './assets/vape-society.png';
import fundamentosImage from './assets/fundamentos.png';
import pickleheadsImage from './assets/pickleheads.png';
import pickleballImage from './assets/picklkeball.png';
import unitedSecuredImage from './assets/united-secured.png';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('projects');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [projectFit, setProjectFit] = useState({ platform: '', budget: '', timeline: '' });
  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);
  const [formStatus, setFormStatus] = useState({ isSubmitting: false, message: '', type: '' });

  const skills = [
    { icon: 'ri-html5-line', name: 'HTML5', color: '#E34F26' },
    { icon: 'ri-css3-line', name: 'CSS3', color: '#1572B6' },
    { icon: 'ri-javascript-line', name: 'JavaScript', color: '#F7DF1E' },
    { icon: 'ri-reactjs-line', name: 'React', color: '#61DAFB' },
    { icon: 'ri-wordpress-line', name: 'WordPress', color: '#21759B' },
    { icon: 'ri-git-merge-line', name: 'Git', color: '#F05032' },
    { icon: 'ri-tailwind-css-line', name: 'Tailwind', color: '#06B6D4' },
    { icon: 'ri-nodejs-line', name: 'Node.js', color: '#339933' },
    { icon: 'ri-figma-line', name: 'Figma', color: '#F24E1E' },
    { icon: 'fa-brands fa-shopify', name: 'Shopify', color: '#7AB55C' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Free Color Sample Plugin',
      description: 'A custom WooCommerce plugin developed from scratch that enables customers to add color attributes to their cart as free samples, enhancing the shopping experience for products requiring color selection.',
      image: colorSampleImage,
      technologies: ['ri-wordpress-line', 'ri-code-s-slash-line', 'ri-database-2-line'],
      link: 'https://www.veneta.com/kleurenstalen/nl/page/382/?SelectedGroups=109,40,34,111&CustomFilters='
    },
    {
      id: 2,
      title: 'Basement88 Fashion Store',
      description: 'Custom Shopify theme development with specialized sections designed to optimize conversion rates for this premium fashion e-commerce platform, featuring enhanced user experience and performance.',
      image: basementImage,
      technologies: ['fa-brands fa-shopify', 'ri-css3-line', 'ri-javascript-line'],
      link: 'https://basement88.com/'
    },
    {
      id: 3,
      title: 'Vape Society Supplies',
      description: 'Complete WordPress e-commerce solution featuring a custom PUDO shipping plugin that integrates with PUDO API and automates shipping processes through ShipStation integration.',
      image: vapeSocietyImage,
      technologies: ['ri-wordpress-line', 'ri-truck-line', 'ri-settings-4-line'],
      link: 'https://vapesocietysupplies.com/'
    },
    {
      id: 4,
      title: 'Fundamentos Website',
      description: 'Modern website design and development using WordPress and Elementor Pro, creating an intuitive and visually appealing digital presence with custom layouts and responsive design.',
      image: fundamentosImage,
      technologies: ['ri-wordpress-line', 'ri-palette-line', 'ri-layout-4-line'],
      link: 'https://devjca.com/fundamentos/'
    },
    {
      id: 5,
      title: 'Pickleheads Platform',
      description: 'Full-stack web application built with modern technologies including React, Next.js, MongoDB, and Node.js, featuring interactive paddle quiz functionality and dynamic user experiences.',
      image: pickleheadsImage,
      technologies: ['ri-reactjs-line', 'ri-nodejs-line', 'ri-database-2-line'],
      link: 'https://www.pickleheads.com/paddle-quiz'
    },
    {
      id: 6,
      title: 'United Secured Capital',
      description: 'Professional corporate website developed using HTML5, CSS3, and Bootstrap framework, delivering a clean and responsive design optimized for financial services presentation.',
      image: unitedSecuredImage,
      technologies: ['ri-html5-line', 'ri-css3-line', 'ri-bootstrap-line'],
      link: 'https://www.unitedsecuredcapital.com/'
    },
    {
      id: 7,
      title: 'Unlimited Pickleball Zone',
      description: 'Custom Shopify theme designed and developed from scratch for the pickleball sports equipment market, featuring specialized product showcases and optimized checkout processes.',
      image: pickleballImage,
      technologies: ['fa-brands fa-shopify', 'ri-palette-line', 'ri-code-line'],
      link: 'https://unlimitedpickleballzone.com/'
    }
  ];

  const services = [
    {
      id: 1,
      title: 'Shopify Theme & Sections',
      description:
        'Custom themes and high-converting sections built from scratch, tuned for CRO and clean code. Used on Basement88 and Unlimited Pickleball Zone.',
      icon: 'fa-brands fa-shopify',
      color: '#10B981',
      features: ['Custom sections/blocks', 'Speed & CRO focused', 'App & payment integrations']
    },
    {
      id: 2,
      title: 'WordPress & WooCommerce Plugins',
      description:
        'From idea to shipped plugin: WooCommerce features, admin tools, and 3rd-party APIs. Includes complex logic like shipping and pricing.',
      icon: 'ri-wordpress-line',
      color: '#1DA1F2',
      features: ['Custom Woo features', 'Admin settings UX', 'Secure, update-safe code']
    },
    {
      id: 3,
      title: 'E-commerce Ops & Integrations',
      description:
        'Automate fulfillment and logistics. Example: PUDO API + ShipStation pipeline for Vape Society to speed up order processing.',
      icon: 'ri-plug-2-line',
      color: '#F59E0B',
      features: ['PUDO/ShipStation flows', '3rd-party APIs & webhooks', 'Order/checkout automation']
    },
    {
      id: 4,
      title: 'Site Speed & Performance',
      description:
        'Front-end audits and fixes to hit Lighthouse goals (~90+ targets). Image strategy, critical CSS, script splitting, and caching.',
      icon: 'ri-speed-up-line',
      color: '#EF4444',
      features: ['Lighthouse 90+ targets', 'Core Web Vitals', 'Asset optimization']
    },
    {
      id: 5,
      title: 'Custom Web Apps (React/Next.js)',
      description:
        'Interactive apps and microsites with modern stacks. Ex: Pickleheads paddle quiz (React/Next/Mongo/Node).',
      icon: 'ri-reactjs-line',
      color: '#61DAFB',
      features: ['React/Next.js builds', 'API & DB integration', 'Interactive UI/UX']
    },
    {
      id: 6,
      title: 'UI/UX & Brand Websites',
      description:
        'Clean, modern websites (WordPress/Elementor or static) that feel trustworthy—like Fundamentos and United Secured Capital.',
      icon: 'ri-palette-line',
      color: '#8B5CF6',
      features: ['Wireframe → polish', 'Design systems', 'Accessible, responsive layouts']
    }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'Basement88 Fashion',
      before: 'Standard theme',
      after: 'Custom conversion-focused design',
      metric: '+38% checkout CTR',
      image: basementImage
    },
    {
      id: 2,
      title: 'Vape Society',
      before: 'Manual shipping',
      after: 'PUDO API integration',
      metric: '70% faster fulfillment',
      image: vapeSocietyImage
    },
    {
      id: 3,
      title: 'Pickleheads',
      before: 'Static website',
      after: 'Interactive platform',
      metric: '3x user engagement',
      image: pickleheadsImage
    }
  ];

  const projectFitOptions = {
    platform: ['Shopify', 'WordPress', 'Custom Build', 'Not Sure'],
    budget: ['<$1k', '$1k-$3k', '$3k-$10k', '$10k+'],
    timeline: ['ASAP', '2-4 weeks', '1-2 months', '3+ months']
  };



  const navigationItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home', section: 'hero-section' },
    { id: 'projects', icon: <Briefcase size={20} />, label: 'Projects', section: 'projects-section' },
    { id: 'services', icon: <Code size={20} />, label: 'Services', section: 'services-section' },
    { id: 'experience', icon: <Award size={20} />, label: 'Experience', section: 'experience-section' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact', section: 'contact-section' }
  ];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init({
      publicKey: '1D8ANMO5otmU-UCd8', // You'll need to replace this with your actual public key
    });
  }, []);

  // Mouse tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Rotate case studies every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaseStudy((prev) => (prev + 1) % caseStudies.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [caseStudies.length]);

  // Scroll spy using IntersectionObserver for better performance
  useEffect(() => {
    const sections = document.querySelectorAll('.hero-section, .projects-section, .services-section, .experience-section, .contact-section');
    
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = entry.target.className.split(' ')[0];
          const sectionId = sectionClass === 'hero-section' ? 'home' : sectionClass.replace('-section', '');
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
      rootMargin: '-10% 0px -70% 0px'
    });

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Function to scroll to section
  const scrollToSection = (sectionClass) => {
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, message: '', type: '' });

    try {
      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        message: contactForm.message,
        to_name: 'Abrar Ul Hoque', // Your name
      };

      await emailjs.send(
        'service_vkc229v', // Your service ID
        'template_iy3g2n1', // You'll need to replace this with your template ID
        templateParams
      );

      setFormStatus({
        isSubmitting: false,
        message: 'Message sent successfully! Thank you for reaching out.',
        type: 'success'
      });
      
      // Reset form
      setContactForm({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ isSubmitting: false, message: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('EmailJS error:', error);
      setFormStatus({
        isSubmitting: false,
        message: 'Failed to send message. Please try again or contact me directly.',
        type: 'error'
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setFormStatus({ isSubmitting: false, message: '', type: '' });
      }, 5000);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectFitChange = (field, value) => {
    setProjectFit({
      ...projectFit,
      [field]: value
    });
  };

  const checkProjectFit = () => {
    if (projectFit.platform && projectFit.budget && projectFit.timeline) {
      // Scroll to contact section with context
      scrollToSection('contact-section');
      // You could also set form context here
      return "Perfect fit\u2014book a 15-min intro";
    }
    return null;
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
                <div className="stat-chip">4+ yrs</div>
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
                {/* Mobile Profile Image - Only visible on mobile */}
                <div className="hero-mobile-profile-wrapper">
                  <div className="gradient-border">
                    <motion.img 
                      src={abrarMobileImage} 
                      alt="Abrar Ul Hoque" 
                      className="hero-mobile-profile"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      loading="eager"
                    />
                  </div>
                </div>
                
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
                

                {/* Mobile Social Links - Only visible on mobile */}
                <motion.div 
                  className="hero-mobile-social"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <motion.a 
                    href="https://www.linkedin.com/in/abrarulhoque/" 
                    className="hero-social-link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="LinkedIn"
                  >
                    <i className="ri-linkedin-line" style={{ fontSize: '18px' }}></i>
                  </motion.a>
                  <motion.a 
                    href="https://github.com/abrarulhoque" 
                    className="hero-social-link"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="GitHub"
                  >
                    <i className="ri-github-line" style={{ fontSize: '18px' }}></i>
                  </motion.a>
                  <motion.a 
                    href="https://wa.me/+8801865801291" 
                    className="hero-social-link hero-whatsapp-social"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="WhatsApp"
                  >
                    <i className="ri-whatsapp-line" style={{ fontSize: '18px' }}></i>
                  </motion.a>
                </motion.div>
                
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
                    onClick={() => scrollToSection('contact-section')}
                  >
                    <Send size={16} />
                    Start a Project
                  </motion.button>
                  <motion.button 
                    className="secondary-nav-btn hero-services-btn"
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

          {/* Right Column - Project Fit */}
          <div className="right-column">
            <motion.div 
              className="project-fit-card"
              variants={cardVariants}
            >
              <h3 className="project-fit-title">Project Fit Quick-Check</h3>
              
              <p className="project-fit-description">
                Get an instant assessment to see if we're a perfect match.
              </p>
              
              <div className="project-fit-form">
                <div className="fit-step">
                  <label className="fit-step-label">Platform</label>
                  <div className="fit-chips">
                    {projectFitOptions.platform.map((option) => (
                      <motion.button
                        key={option}
                        className={`fit-chip ${projectFit.platform === option ? 'active' : ''}`}
                        onClick={() => handleProjectFitChange('platform', option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="fit-step">
                  <label className="fit-step-label">Budget</label>
                  <div className="fit-chips">
                    {projectFitOptions.budget.map((option) => (
                      <motion.button
                        key={option}
                        className={`fit-chip ${projectFit.budget === option ? 'active' : ''}`}
                        onClick={() => handleProjectFitChange('budget', option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="fit-step">
                  <label className="fit-step-label">Timeline</label>
                  <div className="fit-chips">
                    {projectFitOptions.timeline.map((option) => (
                      <motion.button
                        key={option}
                        className={`fit-chip ${projectFit.timeline === option ? 'active' : ''}`}
                        onClick={() => handleProjectFitChange('timeline', option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {checkProjectFit() && (
                  <motion.div 
                    className="fit-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="fit-result-text">{checkProjectFit()}</p>
                    <motion.button 
                      className="primary-cta magnetic-btn"
                      onClick={() => scrollToSection('contact-section')}
                      whileHover={{ 
                        y: -2, 
                        scale: 1.02,
                        transition: { duration: 0.15 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send size={16} />
                      Get Started
                    </motion.button>
                  </motion.div>
                )}
              </div>
              
              {/* Mini Case Study Spotlight */}
              <motion.div 
                className="case-study-spotlight"
                key={currentCaseStudy}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="case-study-image">
                  <img 
                    src={caseStudies[currentCaseStudy].image} 
                    alt={caseStudies[currentCaseStudy].title}
                    className="case-study-img"
                  />
                </div>
                <div className="case-study-content">
                  <h4 className="case-study-title">{caseStudies[currentCaseStudy].title}</h4>
                  <p className="case-study-metric">{caseStudies[currentCaseStudy].metric}</p>
                  <motion.button 
                    className="case-study-cta"
                    onClick={() => scrollToSection('projects-section')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    See full case study
                  </motion.button>
                </div>
              </motion.div>
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
                      onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
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

      {/* Third Section - Services */}
      <section className="services-section">
        <motion.div 
          className="services-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="services-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            SERVICES I OFFER
          </motion.h2>
          
          <motion.div 
            className="services-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
              >
                <div className="service-header">
                  <div 
                    className="service-icon"
                    style={{ backgroundColor: service.color + '20', color: service.color }}
                  >
                    <i className={service.icon} style={{ fontSize: '24px' }}></i>
                  </div>
                </div>
                
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-features">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="feature-tag">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Fourth Section - Experience */}
      <section className="experience-section">
        <motion.div 
          className="experience-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="experience-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            EXPERIENCE
          </motion.h2>
          
          <motion.div 
            className="experience-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="experience-card">
              <div className="experience-logo">
                <span className="company-name">Fiverr</span>
              </div>
              <div className="experience-details">
                <h4 className="experience-position">Freelance Web Developer</h4>
                <p className="experience-duration">2022 - Present</p>
                <p className="experience-description">
                  Successfully delivered 100+ WordPress and Shopify projects as a freelance developer, 
                  specializing in custom theme development, e-commerce solutions, and performance optimization 
                  for clients worldwide.
                </p>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-logo">
                <span className="company-name">Clique<br />Lab</span>
              </div>
              <div className="experience-details">
                <h4 className="experience-position">WordPress Plugin Developer</h4>
                <p className="experience-duration">2024 - 2025</p>
                <p className="experience-description">
                  Developed multiple custom WordPress plugins from scratch, focusing on WooCommerce 
                  integrations, API implementations, and complex functionality enhancements that 
                  improved user experience and business operations.
                </p>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-logo">
                <span className="company-name">Aircon<br />Rescue</span>
              </div>
              <div className="experience-details">
                <h4 className="experience-position">WordPress Developer</h4>
                <p className="experience-duration">2023 - 2024</p>
                <p className="experience-description">
                  Built and maintained responsive WordPress websites with focus on performance 
                  optimization, SEO implementation, and user-friendly content management systems 
                  for service-based business operations.
                </p>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-logo">
                <span className="company-name">Heedee<br />Studio</span>
              </div>
              <div className="experience-details">
                <h4 className="experience-position">Shopify Developer</h4>
                <p className="experience-duration">2022 - 2023</p>
                <p className="experience-description">
                  Created custom Shopify themes and e-commerce solutions, implementing conversion-focused 
                  designs, payment integrations, and enhanced shopping experiences that drove sales growth 
                  for multiple retail clients.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Fifth Section - Contact */}
      <section className="contact-section">
        <motion.div 
          className="contact-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="contact-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            CONTACT ME
          </motion.h2>
          
          <motion.div 
            className="contact-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="contact-form-container">
              <form className="main-contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="sr-only">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Names"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="form-input"
                      required
                      disabled={formStatus.isSubmitting}
                      aria-label="Full Name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email" className="sr-only">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="form-input"
                      required
                      disabled={formStatus.isSubmitting}
                      aria-label="Email Address"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message" className="sr-only">Project Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    className="form-textarea"
                    rows="6"
                    required
                    disabled={formStatus.isSubmitting}
                    aria-label="Project Message"
                  ></textarea>
                </div>
                
                {/* Form Status Message */}
                {formStatus.message && (
                  <motion.div 
                    className={`form-status ${formStatus.type}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formStatus.message}
                  </motion.div>
                )}
                
                <motion.button 
                  type="submit"
                  className="primary-cta contact-submit-btn"
                  disabled={formStatus.isSubmitting}
                  whileHover={!formStatus.isSubmitting ? { 
                    y: -2, 
                    scale: 1.02,
                    transition: { duration: 0.15 }
                  } : {}}
                  whileTap={!formStatus.isSubmitting ? { scale: 0.98 } : {}}
                >
                  {formStatus.isSubmitting ? (
                    <>
                      <motion.div
                        className="loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <motion.div 
          className="footer-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footer-content">
            <div className="footer-brand">
              <motion.h3 
                className="footer-logo"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Abrar Ul Hoque
              </motion.h3>
            </div>
            
            <motion.nav 
              className="footer-nav"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={() => scrollToSection('hero-section')} 
                className="footer-nav-link"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('projects-section')} 
                className="footer-nav-link"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('services-section')} 
                className="footer-nav-link"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('experience-section')} 
                className="footer-nav-link"
              >
                Experience
              </button>
              <button 
                onClick={() => scrollToSection('contact-section')} 
                className="footer-nav-link"
              >
                Contact
              </button>
            </motion.nav>
            
            <motion.div 
              className="footer-social"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.a 
                href="https://wa.me/+8801865801291" 
                className="footer-social-link"
                whileHover={{ scale: 1.1, rotate: 5 }}
                aria-label="Whatsapp"
              >
                <i className="ri-whatsapp-fill"></i>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/abraaar__07/" 
                className="footer-social-link"
                whileHover={{ scale: 1.1, rotate: -5 }}
                aria-label="Instagram"
              >
                <i className="ri-instagram-line"></i>
              </motion.a>
              <motion.a 
                href="https://x.com/iamabrarul" 
                className="footer-social-link"
                whileHover={{ scale: 1.1, rotate: 5 }}
                aria-label="Twitter"
              >
                <i className="ri-twitter-x-line"></i>
              </motion.a>
            </motion.div>
          </div>
          
          <motion.div 
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="footer-divider"></div>
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © 2025 Abrar Ul Hoque. All rights reserved.
              </p>
              <motion.button 
                className="back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to top"
              >
                <i className="ri-arrow-up-line"></i>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </footer>

      {/* Sidebar Navigation */}
      <motion.div 
        className="sidebar-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        {navigationItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`nav-icon ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(item.id);
              scrollToSection(item.section);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveSection(item.id);
                scrollToSection(item.section);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
            aria-label={`Navigate to ${item.label} section`}
            aria-current={activeSection === item.id ? 'true' : 'false'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            tabIndex={0}
          >
            {item.icon}
            <span className="sr-only">{item.label}</span>
          </motion.button>
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