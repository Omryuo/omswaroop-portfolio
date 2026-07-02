"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BookOpen, Shield, Briefcase, Award, GraduationCap, Compass, ExternalLink } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

type Metric = {
  label: string;
  value: string;
};

type Milestone = {
  year: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  accent: "crimson" | "violet";
  description: string;
  detailPoints: string[];
  tags: string[];
  link?: string;
  linkLabel?: string;
  metrics?: Metric[];
};

const milestones: Milestone[] = [
  {
    year: "2023",
    title: "First IEEE Publication",
    subtitle: "Soil Nutrient Analysis in Agricultural Crops",
    icon: BookOpen,
    accent: "violet",
    description: "Published a peer-reviewed machine learning paper at IEEE CISCT 2023. Evaluated Naïve Bayes, JRip, and J48 for soil-nutrient prediction, proposing hybrid models and agricultural IoT integrations.",
    detailPoints: [
      "Achieved up to 100% classification accuracy in specific soil nutrient profiles.",
      "Presented methodology and findings at the IEEE conference session.",
      "Outlined real-time IoT architecture for smart agricultural fertilization."
    ],
    tags: ["Machine Learning", "Data Analysis", "IoT Integration", "IEEE CISCT"],
    link: "https://doi.org/10.1109/CISCT57197.2023.10351370",
    linkLabel: "View Publication",
    metrics: [{ label: "Accuracy", value: "99.71%" }]
  },
  {
    year: "2025",
    title: "AI SOC Simulation Platform",
    subtitle: "End-to-End Threat Pipeline & Groq Triage",
    icon: Shield,
    accent: "crimson",
    description: "Created an end-to-end security-operations sandbox integrating Wazuh EDR, OpenSearch search engine, and TheHive case management. Added a Groq LLaMA pipeline to summarize alerts automatically.",
    detailPoints: [
      "Unified telemetry alerts from endpoints into a single case-management interface.",
      "Configured Groq-hosted LLaMA to provide natural language alert briefings for analysts.",
      "Enabled public access for training and demonstrations using secure ngrok tunnels."
    ],
    tags: ["Wazuh EDR", "TheHive", "OpenSearch", "Groq LLaMA", "Node.js & React"],
    link: "https://github.com/Omryuo/ai-soc-platform",
    linkLabel: "View Repository",
    metrics: [{ label: "Alert Triage", value: "LLM Assisted" }]
  },
  {
    year: "2026",
    title: "KPMG Cyber MDR",
    subtitle: "Cybersecurity Analyst Apprenticeship",
    icon: Briefcase,
    accent: "violet",
    description: "Completed KPMG's managed detection and response program in Bengaluru. Gained experience in SIEM operations, CASB implementation, alert analysis, and threat intelligence.",
    detailPoints: [
      "Completed hands-on Splunk SIEM training for log querying and alarm engineering.",
      "Contributed to enterprise Cloud Access Security Broker (CASB) control implementation.",
      "Conducted analysis on suspicious network headers, DNS requests, and email logs."
    ],
    tags: ["Splunk SIEM", "CASB Controls", "MDR", "Threat Intelligence", "Incident Response"],
    metrics: [{ label: "Duration", value: "6 Months" }]
  },
  {
    year: "2026",
    title: "First-Author IEEE Research",
    subtitle: "PTP-FAKD Vision Transformer Compression",
    icon: Award,
    accent: "crimson",
    description: "Authored and presented a neural network optimization paper at IEEE IECCT 2026. Designed progressive token pruning paired with feature-aware knowledge distillation.",
    detailPoints: [
      "Reduced inference token counts by roughly 50% without loss of representation quality.",
      "Outperformed dense baseline Vision Transformer by +2.57pp on CIFAR-100.",
      "Successfully presented findings and navigated the complete IEEE registration workflow."
    ],
    tags: ["PyTorch", "Vision Transformers", "Knowledge Distillation", "Model Compression"],
    link: "https://doi.org/10.1109/IECCT68664.2026.11541604",
    linkLabel: "View Publication",
    metrics: [{ label: "FLOPs Cut", value: "~50%" }, { label: "Accuracy", value: "+2.57pp" }]
  },
  {
    year: "2026",
    title: "B.Tech Graduation",
    subtitle: "Computer Science & Engineering",
    icon: GraduationCap,
    accent: "violet",
    description: "Graduated with a Bachelor of Technology degree in Computer Science, solidifying core concepts in cryptography, database design, operating systems, and computer networks.",
    detailPoints: [
      "Rigorous theoretical coursework covering distributed architectures and cryptographic protocols.",
      "Maintained strong academic standing while executing peer-reviewed research.",
      "Led student security circles in threat modeling and secure programming practices."
    ],
    tags: ["Computer Science", "Algorithms", "Network Security", "Cryptography"],
    metrics: [{ label: "Specialization", value: "Cyber & AI" }]
  },
  {
    year: "Now → Beyond",
    title: "Engineering the Future",
    subtitle: "Next-Gen Intelligent Systems",
    icon: Compass,
    accent: "crimson",
    description: "Continuing to engineer secure, resilient, and intelligent systems. Focused on model robustness, cloud automation, and detection engineering at scale.",
    detailPoints: [
      "Stress-testing architectures against telemetry corruption and adversarial input feeds.",
      "Developing automated security response playbooks and cloud detection utilities.",
      "Exploring zero-trust identity integrations for distributed serverless architectures."
    ],
    tags: ["AI Robustness", "Cloud Security", "SecOps Automation", "Future Systems"],
    metrics: [{ label: "Vision", value: "Secure AI" }]
  }
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Monitor scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"]
  });

  // Smooth scroll translation
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
      <SectionHeading num="01" label="My Journey" title="Timeline & Experience" />

      {/* Intro Subtitle */}
      <Reveal>
        <div className="mb-16 max-w-2xl">
          <h3 className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
            Engineering the Future
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Continuing to build secure, intelligent systems at the intersection of cybersecurity, cloud, and AI. Explore the key milestones representing research publications, platform engineering, and enterprise operations.
          </p>
        </div>
      </Reveal>

      {/* Timeline Wrapper */}
      <div ref={containerRef} className="relative mt-8" style={{ position: "relative" }}>
        {/* Timeline background track line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-line" />

        {/* Animated timeline progress line */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 origin-top bg-gradient-to-b from-violet via-crimson to-violet-bright"
        />

        {/* Timeline Items */}
        <div className="space-y-12">
          {milestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            const Icon = milestone.icon;
            const isHovered = hoveredIndex === idx;

            // Define styling colors based on accent
            const accentText = milestone.accent === "crimson" ? "text-crimson-bright" : "text-violet-bright";
            const borderAccent = milestone.accent === "crimson" ? "border-crimson/20" : "border-violet/20";
            const glowColor = milestone.accent === "crimson" ? "rgba(255, 35, 66, 0.12)" : "rgba(185, 133, 255, 0.12)";
            
            // Hover/Active status styles
            const hoverBorder = milestone.accent === "crimson" ? "group-hover:border-crimson/50" : "group-hover:border-violet/50";
            const dotActiveColor = milestone.accent === "crimson" ? "bg-crimson border-crimson shadow-[0_0_15px_#ff2342]" : "bg-violet border-violet shadow-[0_0_15px_#9b4dff]";

            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row ${
                  isEven ? "md:flex-row-reverse" : ""
                } items-start`}
              >
                {/* 1. Card Container (taking half screen on desktop, full width on mobile) */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1], delay: idx * 0.05 }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group relative rounded-2xl border border-line bg-surface/50 p-6 transition-all duration-300 ${hoverBorder} hover:bg-surface2/30`}
                    style={{
                      boxShadow: isHovered ? `0 10px 30px -10px ${glowColor}` : "none",
                    }}
                  >
                    {/* Header: Year, metrics */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`rounded-full border ${borderAccent} bg-bg px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${accentText}`}>
                        {milestone.year}
                      </span>
                      {milestone.metrics?.map((metric, mIdx) => (
                        <span key={mIdx} className="rounded border border-line2/60 bg-surface2/40 px-2 py-0.5 font-mono text-[9px] text-muted">
                          {metric.label}: <strong className="text-ink">{metric.value}</strong>
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h4 className={`font-display text-lg font-bold tracking-tight text-ink transition-colors duration-300 ${
                      milestone.accent === "crimson" ? "group-hover:text-crimson-bright" : "group-hover:text-violet-bright"
                    }`}>
                      {milestone.title}
                    </h4>
                    
                    {/* Subtitle */}
                    <p className="mt-0.5 font-mono text-xs text-dim">{milestone.subtitle}</p>

                    {/* Brief Description */}
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">
                      {milestone.description}
                    </p>

                    {/* Interactive Reveal Area */}
                    <motion.div
                      initial={false}
                      animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-line/60 pt-4 space-y-3">
                        <ul className="space-y-2">
                          {milestone.detailPoints.map((pt, pIdx) => (
                            <li key={pIdx} className="relative pl-4 text-xs text-muted leading-relaxed">
                              <span className={`absolute left-0 top-0.5 ${accentText}`}>▹</span>
                              {pt}
                            </li>
                          ))}
                        </ul>

                        {milestone.link && (
                          <a
                            href={milestone.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${accentText} hover:text-white transition-colors pt-1`}
                          >
                            {milestone.linkLabel || "View Source"} <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {milestone.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-surface2/60 border border-line/40 px-2.5 py-0.5 font-mono text-[9px] text-muted transition-all duration-300 group-hover:border-line2 group-hover:text-ink"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* 2. Central Icon/Dot on Timeline */}
                <div
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`absolute left-4 md:left-1/2 top-6 z-10 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 bg-bg transition-all duration-300 ${
                    isHovered
                      ? dotActiveColor
                      : "border-line text-muted hover:border-line2 hover:text-ink"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors duration-300 ${isHovered ? "text-white" : "text-muted"}`} />
                </div>

                {/* 3. Empty spacer block on the alternate side (desktop only) */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
