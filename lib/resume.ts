import resumeContent from "@/data/resume-content.json";

export const resumeProfile = resumeContent.profile;
export const resumeProjects = resumeContent.projects;

export const experience = {
  title: "Risk Development Staff",
  organization: "Indonesian multi-finance company",
  period: "September 2025 – Present",
  points: resumeContent.experience,
};

export const skillGroups = resumeContent.skills;

export const certifications = [
  {
    title: "Advanced Deep Learning for LLM (Batch 5)",
    issuer: "rubythalib.ai Academy",
    date: "September 2026",
  },
  {
    title: "Mini Bootcamp AI Agent & Automation for Non-Tech Professional (Cohort 1)",
    issuer: "Belajarlagi",
    date: "May 2026",
  },
  {
    title: "Machine Learning Professional Certification",
    issuer: "RapidMiner",
    date: "October 2023",
  },
  {
    title: "Data Engineering Professional Certification",
    issuer: "RapidMiner",
    date: "January 2022",
  },
] as const;
