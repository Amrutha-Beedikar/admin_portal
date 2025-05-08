export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  // Image fields
  thumbnail?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  // Additional fields
  alternate_text?: string;
  internal_links?: string[];
  external_links?: string[];
  content_length?: number;
  status?: 'draft' | 'published';
  last_modified?: string;
} 