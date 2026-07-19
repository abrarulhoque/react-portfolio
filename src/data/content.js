// All portfolio content in one place — the DOM sections and the 3D board
// both read from here so they can never drift apart.
import basementImage from "../assets/basement.png";
import colorSampleImage from "../assets/color-sample.png";
import fundamentosImage from "../assets/fundamentos.png";
import pickleheadsImage from "../assets/pickleheads.png";
import pickleballImage from "../assets/picklkeball.png";
import portraitImage from "../assets/abrarul-hoque-web-designer-developer.jpg";
import unitedSecuredImage from "../assets/united-secured.png";
import vapeSocietyImage from "../assets/vape-society.png";

export const meta = {
  name: "Abrarul Hoque",
  title: "Web Designer & Developer",
  tagline:
    "I design conversion-first websites that feel effortless to use — Shopify, WordPress, and custom React builds.",
  boardRev: "REV 2.0",
  domain: "https://abrarulhoque.com/",
  portrait: portraitImage,
};

export const stats = [
  { label: "years", value: "4+" },
  { label: "projects delivered", value: "100+" },
  { label: "lighthouse target", value: "~92" },
];

// id doubles as the socket label on the 3D breadboard
export const skills = [
  { id: "HTML5", color: "#E34F26", projects: [6] },
  { id: "CSS3", color: "#1572B6", projects: [2, 6] },
  { id: "JS", name: "JavaScript", color: "#F7DF1E", projects: [1, 2, 5, 7] },
  { id: "REACT", name: "React", color: "#61DAFB", projects: [5] },
  { id: "WP", name: "WordPress", color: "#21759B", projects: [1, 3, 4] },
  { id: "GIT", name: "Git", color: "#F05032", projects: [] },
  { id: "TW", name: "Tailwind", color: "#06B6D4", projects: [] },
  { id: "NODE", name: "Node.js", color: "#339933", projects: [5] },
  { id: "FIGMA", name: "Figma", color: "#F24E1E", projects: [4, 7] },
  { id: "SHOPIFY", name: "Shopify", color: "#7AB55C", projects: [2, 7] },
];

export const projects = [
  {
    id: 1,
    title: "Free Color Sample Plugin",
    chip: "COLOR-SMPL",
    description:
      "Custom WooCommerce plugin built from scratch — customers add color attributes to cart as free samples, smoothing the shopping flow for color-dependent products.",
    image: colorSampleImage,
    tech: ["WordPress", "WooCommerce", "PHP"],
    link: "https://www.veneta.com/kleurenstalen/nl/page/382/?SelectedGroups=109,40,34,111&CustomFilters=",
  },
  {
    id: 2,
    title: "Basement88 Fashion Store",
    chip: "BASEMENT88",
    description:
      "Custom Shopify theme with conversion-focused sections for a premium fashion store — enhanced UX and measured checkout gains.",
    image: basementImage,
    tech: ["Shopify", "Liquid", "CSS"],
    link: "https://basement88.com/",
  },
  {
    id: 3,
    title: "Vape Society Supplies",
    chip: "VAPE-SOC",
    description:
      "WordPress e-commerce with a custom PUDO shipping plugin — PUDO API + ShipStation integration automating the whole fulfillment pipeline.",
    image: vapeSocietyImage,
    tech: ["WordPress", "PUDO API", "ShipStation"],
    link: "https://vapesocietysupplies.com/",
  },
  {
    id: 4,
    title: "Fundamentos Website",
    chip: "FNDMNTOS",
    description:
      "Modern brand site in WordPress + Elementor Pro — custom layouts, responsive design, and an intuitive editing experience for the client.",
    image: fundamentosImage,
    tech: ["WordPress", "Elementor", "Design"],
    link: "https://devjca.com/fundamentos/",
  },
  {
    id: 5,
    title: "Pickleheads Platform",
    chip: "PICKLHEDS",
    description:
      "Full-stack interactive paddle quiz — React, Next.js, MongoDB, and Node.js powering dynamic recommendations for a sports platform.",
    image: pickleheadsImage,
    tech: ["React", "Next.js", "MongoDB"],
    link: "https://www.pickleheads.com/paddle-quiz",
  },
  {
    id: 6,
    title: "United Secured Capital",
    chip: "UTD-SECRD",
    description:
      "Clean corporate site for financial services — HTML5, CSS3, Bootstrap, responsive and trust-focused.",
    image: unitedSecuredImage,
    tech: ["HTML5", "CSS3", "Bootstrap"],
    link: "https://www.unitedsecuredcapital.com/",
  },
  {
    id: 7,
    title: "Unlimited Pickleball Zone",
    chip: "UPZ-STORE",
    description:
      "Custom Shopify theme from scratch for sports equipment — specialized product showcases and an optimized checkout.",
    image: pickleballImage,
    tech: ["Shopify", "Liquid", "Design"],
    link: "https://unlimitedpickleballzone.com/",
  },
];

export const services = [
  {
    id: 1,
    title: "Shopify Theme & Sections",
    description:
      "Custom themes and high-converting sections built from scratch, tuned for CRO and clean code.",
    features: ["Custom sections/blocks", "Speed & CRO focused", "App & payment integrations"],
    color: "#7AB55C",
  },
  {
    id: 2,
    title: "WordPress & WooCommerce Plugins",
    description:
      "From idea to shipped plugin: WooCommerce features, admin tools, and 3rd-party APIs.",
    features: ["Custom Woo features", "Admin settings UX", "Secure, update-safe code"],
    color: "#1DA1F2",
  },
  {
    id: 3,
    title: "E-commerce Ops & Integrations",
    description:
      "Automate fulfillment and logistics — like the PUDO API + ShipStation pipeline for Vape Society.",
    features: ["PUDO/ShipStation flows", "APIs & webhooks", "Checkout automation"],
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Site Speed & Performance",
    description:
      "Front-end audits and fixes to hit Lighthouse ~90+: image strategy, critical CSS, caching.",
    features: ["Lighthouse 90+ targets", "Core Web Vitals", "Asset optimization"],
    color: "#EF4444",
  },
  {
    id: 5,
    title: "Custom Web Apps (React/Next.js)",
    description:
      "Interactive apps and microsites with modern stacks — like the Pickleheads paddle quiz.",
    features: ["React/Next.js builds", "API & DB integration", "Interactive UI/UX"],
    color: "#61DAFB",
  },
  {
    id: 6,
    title: "UI/UX & Brand Websites",
    description:
      "Clean, modern websites that feel trustworthy — wireframe to polish, accessible and responsive.",
    features: ["Wireframe → polish", "Design systems", "Responsive layouts"],
    color: "#8B5CF6",
  },
];

export const experience = [
  {
    company: "Fiverr",
    role: "Freelance Web Developer",
    period: "2022 — Present",
    description:
      "Delivered 100+ WordPress and Shopify projects worldwide — custom themes, e-commerce solutions, performance optimization.",
  },
  {
    company: "Clique Lab",
    role: "WordPress Plugin Developer",
    period: "2024 — 2025",
    description:
      "Built custom WordPress plugins from scratch: WooCommerce integrations, API implementations, complex business logic.",
  },
  {
    company: "Aircon Rescue",
    role: "WordPress Developer",
    period: "2023 — 2024",
    description:
      "Responsive WordPress sites focused on performance, SEO, and editor-friendly content management.",
  },
  {
    company: "Heedee Studio",
    role: "Shopify Developer",
    period: "2022 — 2023",
    description:
      "Custom Shopify themes with conversion-focused design, payment integrations, and enhanced shopping experiences.",
  },
];

export const caseStudies = [
  { title: "Basement88 Fashion", metric: "+38% checkout CTR", detail: "Standard theme → custom conversion-focused design" },
  { title: "Vape Society", metric: "70% faster fulfillment", detail: "Manual shipping → PUDO API integration" },
  { title: "Pickleheads", metric: "3x user engagement", detail: "Static website → interactive platform" },
];

export const socials = [
  { id: "github", label: "GitHub", url: "https://github.com/abrarulhoque" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/abrarulhoque/" },
  { id: "whatsapp", label: "WhatsApp", url: "https://wa.me/+8801865801291" },
  { id: "fiverr", label: "Fiverr", url: "https://www.fiverr.com/abrar_h_" },
  { id: "x", label: "X", url: "https://x.com/iamabrarul" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/abraaar__07/" },
];

export const emailjsConfig = {
  publicKey: "1D8ANMO5otmU-UCd8",
  serviceId: "service_vkc229v",
  templateId: "template_iy3g2n1",
  toName: "Abrar Ul Hoque",
};

// GitHub linguist colors for the repo skyline
export const languageColors = {
  PHP: "#4F5D95",
  Kotlin: "#A97BFF",
  Liquid: "#67b8de",
  HTML: "#e34c26",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  CSS: "#663399",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  Java: "#b07219",
};

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
