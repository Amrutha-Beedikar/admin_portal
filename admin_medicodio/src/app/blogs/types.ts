export interface IRevision {
  content: string;
  title: string;
  modified_at: Date;
  modified_by?: string;
}

export interface Blog {
  _id: string;
  slug: string;
  title: string;
  content: string;
  author_name?: string;
  author_email?: string;
  category?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  alternate_text?: string;
  internal_links?: string[];
  external_links?: string[];
  status: 'draft' | 'published' | 'archived' | 'trash';
  default_date?: string;
  featured?: boolean;
  revisions?: IRevision[];
  is_commentable?: boolean;
  seo_score?: number;
  view_count?: number;
  comments_count?: number;
  likes_count?: number;
  shares_count?: number;
  published_at?: Date;
  scheduled_for?: Date;
  last_modified?: Date;
  content_length?: number;
  reading_time?: number;
}

export type BlogFormData = Omit<Blog, '_id'>; 