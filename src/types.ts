export interface SimResult {
  score: number;
  levelName: string;
  simpleSummary: string;
  thinkingProcess: string;
  steps: {
    title: string;
    desc: string;
  }[];
  goldenTip: string;
  rewardBadge: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  summary: string;
  content: string;
}
