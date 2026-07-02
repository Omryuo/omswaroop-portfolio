export const site = {
  name: "Omswaroop T M",
  short: "Om",
  role: "Cybersecurity & AI/ML Security",
  // TODO: change to your real hosted URL (e.g. https://omswaroop.dev)
  url: "https://omswaroop.vercel.app",
  description:
    "SOC & Detection Engineering meets AI/ML security research. B.Tech CSE graduate, KPMG Cyber MDR apprentice, IEEE-published author.",
  email: "juug22btech52467@gmail.com",
  phone: "+91 9141017664",
  location: "Bengaluru, India",
  github: "https://github.com/Omryuo",
  linkedin: "https://www.linkedin.com/in/omee-414-/",
  resume: "/Omswaroop_TM_Resume.pdf",
} as const;

export const keywords = [
  "Omswaroop T M",
  "cybersecurity",
  "SOC",
  "MDR",
  "detection engineering",
  "SIEM",
  "Splunk",
  "Wazuh",
  "AI security",
  "machine learning",
  "vision transformers",
  "knowledge distillation",
  "IEEE",
  "Bengaluru",
  "portfolio",
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.short,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  telephone: site.phone.replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Jain University, Bengaluru",
  },
  knowsAbout: [
    "Security Operations",
    "Detection Engineering",
    "SIEM",
    "Machine Learning",
    "Vision Transformers",
    "Knowledge Distillation",
  ],
  sameAs: [site.github, site.linkedin],
};
