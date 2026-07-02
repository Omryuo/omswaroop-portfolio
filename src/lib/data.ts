export type Link = { label: string; href: string };
export type Metric = { value: string; label: string };
export type Stage = { label: string; sub?: string; highlight?: boolean };

export type CaseStudy = {
  tagline: string;
  context: string;
  problem: string;
  approach: string;
  highlights: string[];
  metrics?: Metric[];
  diagram?: { title: string; stages: Stage[] };
  stack: string[];
  outcome: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  links: Link[];
  accent: "crimson" | "violet";
  study?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "ai-soc-platform",
    title: "AI-Driven SOC Simulation Platform",
    category: "AI Security · SOC",
    year: "2025",
    summary:
      "End-to-end security-operations platform integrating Wazuh, TheHive and OpenSearch with a React/Node dashboard for real-time alert visualization and case management. A Groq LLaMA layer summarizes and contextualizes alerts to speed analyst triage; shipped with live demo access via ngrok.",
    tags: ["Wazuh", "TheHive", "OpenSearch", "Groq LLaMA", "React", "Node.js"],
    links: [{ label: "GitHub", href: "https://github.com/Omryuo/ai-soc-platform" }],
    accent: "crimson",
    study: {
      tagline:
        "An analyst-facing SOC, simulated end to end — detection, cases, and LLM-assisted triage in one pipeline.",
      context: "Personal project · 2025 · Python · React · Node.js · LLM",
      problem:
        "A real SOC stitches together several tools — detection, search/analytics, and case management — and analysts burn time context-switching between them while triaging a flood of alerts. There also aren't many safe, realistic environments to practice that end-to-end workflow. I wanted a self-hosted SOC where an alert flows cleanly from detection to a ready-to-work case, with a first pass of triage already done.",
      approach:
        "I integrated Wazuh for detection, OpenSearch for indexing and analytics, and TheHive for case management into a single pipeline, then built a React/Node.js dashboard on top for real-time visualization. The key idea was an LLM enrichment layer: a Groq-hosted LLaMA model summarizes and contextualizes each incoming alert so an analyst opens a plain-language brief instead of raw event fields. The whole thing is demoable over the public internet through ngrok.",
      highlights: [
        "Unified Wazuh, OpenSearch and TheHive into one alert-to-case pipeline.",
        "Built a React/Node.js dashboard for real-time alert visualization and case tracking.",
        "Added a Groq LLaMA enrichment layer that summarizes and contextualizes alerts for faster triage.",
        "Shipped with live demo access via ngrok for walkthroughs and trainer sessions.",
      ],
      metrics: [
        { value: "3", label: "SOC tools unified" },
        { value: "LLM", label: "Alert enrichment" },
        { value: "Live", label: "ngrok demo" },
      ],
      diagram: {
        title: "Architecture",
        stages: [
          { label: "Log & EDR Sources", sub: "endpoints / agents" },
          { label: "Wazuh", sub: "detection" },
          { label: "OpenSearch", sub: "index & search" },
          { label: "TheHive", sub: "case management" },
          { label: "Groq LLaMA", sub: "summarize & enrich", highlight: true },
          { label: "Dashboard", sub: "React / Node.js" },
        ],
      },
      stack: ["Wazuh", "TheHive", "OpenSearch", "Groq LLaMA", "React", "Node.js", "Python", "ngrok"],
      outcome:
        "The result is a working SOC sandbox where an alert becomes a contextual, analyst-ready case automatically. It's a concrete way to demonstrate detection workflows end to end and to show how an LLM enrichment layer can cut the first-pass triage an analyst has to do by hand.",
    },
  },
  {
    slug: "ptp-fakd",
    title: "PTP-FAKD — Efficient Vision Transformers",
    category: "ML Research · IEEE",
    year: "2026",
    summary:
      "Progressive token pruning with feature-aware knowledge distillation makes Vision Transformers more efficient — roughly 50% fewer tokens while preserving accuracy and beating the dense teacher. First-author paper (ID 1523), published at IEEE IECCT 2026.",
    tags: ["PyTorch", "Vision Transformers", "Knowledge Distillation", "CIFAR-100"],
    links: [
      { label: "DOI", href: "https://doi.org/10.1109/IECCT68664.2026.11541604" },
      { label: "Repo", href: "https://github.com/Omryuo/PTP-FAKD" },
    ],
    accent: "violet",
    study: {
      tagline: "Halving the tokens a Vision Transformer processes — without giving up accuracy.",
      context: "First-author paper (ID 1523) · IEEE IECCT 2026 · Published",
      problem:
        "Vision Transformers are accurate but expensive: attention scales with the number of patch tokens, and many of those tokens carry little signal. The usual fix — pruning tokens — tends to trade away accuracy. The question was whether you could prune aggressively and keep, or even improve, accuracy.",
      approach:
        "PTP-FAKD pairs two ideas. Progressive token pruning removes low-value tokens in stages as data moves deeper through the network, so compute drops where it matters most. Feature-aware knowledge distillation then trains the pruned student to match a dense teacher's intermediate features — not just its final predictions — so the lighter model recovers the representational quality it would otherwise lose to pruning.",
      highlights: [
        "Designed a stagewise progressive token-pruning schedule for ViTs.",
        "Added feature-aware knowledge distillation aligning student and dense-teacher features.",
        "Cut token count by roughly half while beating the dense teacher on accuracy.",
        "Managed the full publication workflow end to end: camera-ready, copyright, registration and conference presentation.",
      ],
      metrics: [
        { value: "~50%", label: "Fewer tokens" },
        { value: "+2.57pp", label: "Over dense teacher" },
        { value: "IECCT 2026", label: "Published · ID 1523" },
      ],
      diagram: {
        title: "Method",
        stages: [
          { label: "Patch Tokens", sub: "ViT input" },
          { label: "Progressive Pruning", sub: "stagewise", highlight: true },
          { label: "Student ViT", sub: "pruned" },
          { label: "Feature-Aware KD", sub: "from dense teacher" },
          { label: "Efficient Inference", sub: "fewer FLOPs" },
        ],
      },
      stack: ["PyTorch", "Vision Transformers", "Knowledge Distillation", "CIFAR-100", "Python"],
      outcome:
        "The method shows aggressive token reduction need not cost accuracy — the pruned model beat its dense teacher while running on roughly half the tokens. The work was accepted, presented and published at IEEE IECCT 2026 as a first-author paper.",
    },
  },
  {
    slug: "telemetry-robustness",
    title: "Telemetry Corruption Robustness Study",
    category: "ML Robustness · Formula 1",
    year: "2026",
    summary:
      "A full data and experimentation pipeline built from scratch on real Formula 1 telemetry (FastF1) with systematic corruption scenarios — showing that models with strong clean-data performance can fail under structured sensor corruption, across four model architectures.",
    tags: ["Python", "FastF1", "XGBoost", "LSTM", "Transformers"],
    links: [{ label: "GitHub", href: "https://github.com/Omryuo" }],
    accent: "crimson",
    study: {
      tagline: "When clean accuracy lies: stress-testing four models against corrupted Formula 1 telemetry.",
      context: "Research project · 2026 · Python · FastF1",
      problem:
        "Model selection usually rewards whatever scores best on clean data. But real sensor streams drift, drop samples, and corrupt — and a model that wins on pristine data isn't guaranteed to stay best when the inputs degrade. I wanted to test that assumption directly with real, messy telemetry.",
      approach:
        "I built the full pipeline from scratch on real Formula 1 telemetry pulled through the FastF1 API, then designed systematic, structured corruption scenarios to simulate sensor failure. Four model architectures were trained and compared not just on clean accuracy but on how their performance held up — and how they failed — as corruption increased.",
      highlights: [
        "Engineered the entire data and experimentation pipeline from scratch.",
        "Sourced real telemetry via the FastF1 API rather than synthetic data.",
        "Designed structured corruption scenarios to model realistic sensor failure.",
        "Compared failure behavior across four architectures — clean-data leaders did not stay ahead under corruption.",
      ],
      metrics: [
        { value: "4", label: "Architectures compared" },
        { value: "FastF1", label: "Real telemetry" },
        { value: "Clean ≠ Robust", label: "Key finding" },
      ],
      diagram: {
        title: "Pipeline",
        stages: [
          { label: "FastF1 Telemetry", sub: "real F1 data" },
          { label: "Clean Baseline", sub: "train / eval" },
          { label: "Structured Corruption", sub: "sensor failure", highlight: true },
          { label: "4 Models", sub: "XGBoost · RF · LSTM · Transformer" },
          { label: "Robustness Ranking", sub: "failure behavior" },
        ],
      },
      stack: ["Python", "FastF1", "XGBoost", "scikit-learn", "LSTM", "Transformers", "pandas"],
      outcome:
        "The study makes a concrete case that clean-data leaderboards can mislead: the strongest model on pristine inputs was not the most robust once telemetry was corrupted. It argues for evaluating models on robustness, not just headline accuracy.",
    },
  },
  {
    slug: "soil-nutrient",
    title: "Soil Nutrient Analysis",
    category: "Applied ML · IEEE",
    year: "2023",
    summary:
      "An applied-ML study comparing Naïve Bayes, JRip and J48 for soil-nutrient prediction — up to 100% accuracy in certain cases and JRip at 99.71% — proposing hybrid models and IoT integration. First peer-reviewed paper.",
    tags: ["Machine Learning", "Naïve Bayes", "J48", "Data Analysis"],
    links: [{ label: "DOI", href: "https://doi.org/10.1109/CISCT57197.2023.10351370" }],
    accent: "violet",
    study: {
      tagline: "Comparing classical ML for soil-nutrient prediction — and where it points next.",
      context: "Co-authored · IEEE CISCT 2023 · Published",
      problem:
        "Reliable soil-nutrient prediction can guide fertilization and crop decisions, but it isn't obvious which machine-learning approach works best on tabular soil data — or how far classical models can be pushed before they need help.",
      approach:
        "We reviewed and benchmarked three classical algorithms — Naïve Bayes, JRip and J48 — on soil-nutrient data, comparing their accuracy and characterizing where each performed well. From the results, we proposed combining models and adding IoT sensing for real-time, in-field insight.",
      highlights: [
        "Benchmarked Naïve Bayes, JRip and J48 on soil-nutrient prediction.",
        "Achieved up to 100% accuracy in certain cases, with JRip reaching 99.71%.",
        "Proposed hybrid models and IoT integration for real-time agricultural insight.",
        "First peer-reviewed publication — presented at IEEE CISCT 2023.",
      ],
      metrics: [
        { value: "100%", label: "Top accuracy (cases)" },
        { value: "99.71%", label: "JRip" },
        { value: "CISCT 2023", label: "Published" },
      ],
      diagram: {
        title: "Approach",
        stages: [
          { label: "Soil Dataset", sub: "tabular" },
          { label: "Feature Prep", sub: "cleaning" },
          { label: "Models", sub: "Naïve Bayes · JRip · J48", highlight: true },
          { label: "Evaluation", sub: "accuracy" },
          { label: "Hybrid + IoT", sub: "proposed" },
        ],
      },
      stack: ["Machine Learning", "Naïve Bayes", "J48", "JRip", "Data Analysis"],
      outcome:
        "The comparison gave a clear read on classical ML for this task and motivated a path forward — hybrid models plus IoT sensing. It was published at IEEE CISCT 2023, my first peer-reviewed paper.",
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const experience = [
  {
    org: "KPMG",
    role: "Analyst, Cyber — Managed Detection & Response",
    badge: "Apprenticeship",
    period: "Jan 2026 – Jun 2026",
    location: "Bengaluru, India",
    points: [
      "Completed KPMG's structured SOC training across security-operations fundamentals, threat-intelligence tools, email-header analysis and SIEM (Splunk).",
      "Worked within a squad on a Cloud Access Security Broker (CASB) implementation, building familiarity with cloud security controls and enterprise security architecture.",
      "Strengthened core networking and security-operations knowledge through hands-on exercises and mentorship within the MDR practice.",
    ],
  },
];

export type Publication = {
  slug: string;
  status: string;
  year: string;
  venue: string;
  title: string;
  authors: string;
  abstract: string;
  doi: string;
  bibtex: string;
  citation: string;
};

export const research: Publication[] = [
  {
    slug: "ptp-fakd",
    status: "Published",
    year: "2026",
    venue: "IEEE IECCT 2026",
    title:
      "Progressive Token Pruning with Feature-Aware Knowledge Distillation for Efficient Vision Transformers",
    authors: "Omswaroop T M (first author) · Paper ID 1523",
    abstract:
      "PTP-FAKD makes Vision Transformers more efficient by combining progressive token pruning with feature-aware knowledge distillation. Redundant patch tokens are pruned in stages through the network to cut inference cost, while a feature-aware distillation objective trains the pruned student to match a dense teacher's intermediate representations rather than only its final outputs. The method reduces token count by roughly half while preserving — and exceeding — the dense teacher's accuracy, showing that aggressive token reduction need not sacrifice performance.",
    doi: "10.1109/IECCT68664.2026.11541604",
    bibtex: `@inproceedings{tm2026ptpfakd,
  author    = {Omswaroop T M},
  title     = {Progressive Token Pruning with Feature-Aware Knowledge Distillation for Efficient Vision Transformers},
  booktitle = {2026 IEEE IECCT},
  year      = {2026},
  doi       = {10.1109/IECCT68664.2026.11541604},
  publisher = {IEEE}
}`,
    citation:
      'Omswaroop T M, "Progressive Token Pruning with Feature-Aware Knowledge Distillation for Efficient Vision Transformers," in 2026 IEEE IECCT, 2026, doi: 10.1109/IECCT68664.2026.11541604.',
  },
  {
    slug: "soil-nutrient-analysis",
    status: "Published",
    year: "2023",
    venue: "IEEE CISCT 2023",
    title: "Soil Nutrient Analysis in Agricultural Crops",
    authors: "Omswaroop T M et al. (co-authored)",
    abstract:
      "This study reviews and compares machine-learning algorithms — Naïve Bayes, JRip and J48 — for predicting soil nutrient levels in agricultural crops. On the evaluated data, J48 and Naïve Bayes reached up to 100% accuracy in certain cases and JRip achieved 99.71%. The paper proposes hybrid models and IoT integration to enable real-time, in-field nutrient insight. Presented at the 3rd International Conference on Innovative Sustainable Computational Technologies (CISCT-2023).",
    doi: "10.1109/CISCT57197.2023.10351370",
    bibtex: `@inproceedings{tm2023soil,
  author    = {Omswaroop T M and others},
  title     = {Soil Nutrient Analysis in Agricultural Crops},
  booktitle = {2023 3rd International Conference on Innovative Sustainable Computational Technologies (CISCT)},
  year      = {2023},
  doi       = {10.1109/CISCT57197.2023.10351370},
  publisher = {IEEE}
}`,
    citation:
      'Omswaroop T M et al., "Soil Nutrient Analysis in Agricultural Crops," in 2023 3rd Int. Conf. on Innovative Sustainable Computational Technologies (CISCT), 2023, doi: 10.1109/CISCT57197.2023.10351370.',
  },
];

export const getPublication = (slug: string) => research.find((r) => r.slug === slug);

export const skillGroups = [
  {
    key: "security",
    label: "Security & SecOps",
    items: ["Splunk (SIEM)", "Wazuh", "OpenSearch", "TheHive", "CASB", "Threat Intel", "Email-Header Analysis", "Alert Triage & IR"],
  },
  { key: "cloud", label: "Cloud", items: ["Microsoft Azure", "AWS"] },
  { key: "languages", label: "Languages", items: ["Python", "Java", "JavaScript", "SQL"] },
  {
    key: "ai",
    label: "AI / ML",
    items: ["PyTorch", "Knowledge Distillation", "Vision Transformers", "scikit-learn", "Anomaly Detection", "Feature Engineering"],
  },
  {
    key: "development",
    label: "Development",
    items: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "Docker", "Linux", "Git"],
  },
];
