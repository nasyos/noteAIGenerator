export type Topic = {
  id: string;
  topic_name: string;
  category: string;
  priority: number;
  keywords: string | null;
  target_audience: string | null;
  angle: string | null;
  status: 'available' | 'selected' | 'used';
  created_at: string;
  updated_at: string;
};

export type ArticlePlan = {
  id: string;
  topic_id: string | null;
  title_options: string[];
  selected_title: string | null;
  lead: string | null;
  structure: PlanSection[];
  target_length: number;
  notes: string | null;
  status: 'draft' | 'approved' | 'archived';
  created_at: string;
  updated_at: string;
};

export type PlanSection = {
  heading: string;
  content: string;
  estimatedLength?: number;
};

export type Article = {
  id: string;
  plan_id: string | null;
  title: string;
  content_markdown: string;
  content_html: string | null;
  word_count: number | null;
  status: 'draft' | 'reviewed' | 'published';
  note_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GenerationLog = {
  id: string;
  stage: 'topic' | 'plan' | 'article';
  reference_id: string | null;
  prompt_used: string | null;
  tokens_used: number | null;
  generation_time_ms: number | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
};

// API Request/Response 型
export type TopicGenerationRequest = {
  count: number;
};

export type TopicGenerationResponse = {
  name: string;
  category: string;
  priority: number;
  keywords: string;
  targetAudience: string;
  angle: string;
};

export type PlanGenerationResponse = {
  titleOptions: string[];
  lead: string;
  structure: PlanSection[];
  targetLength: number;
};

export type ArticleGenerationResponse = {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
  summary: string;
  cta: string;
};
