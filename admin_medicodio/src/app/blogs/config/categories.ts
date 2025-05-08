export interface Category {
  id: string;
  name: string;
}

export const BLOG_CATEGORIES: Category[] = [
  {
    id: 'medical-coding',
    name: 'Medical Coding'
  },
  {
    id: 'healthcare-technology',
    name: 'Healthcare Technology'
  },
  {
    id: 'industry-news',
    name: 'Industry News'
  },
  {
    id: 'best-practices',
    name: 'Best Practices'
  },
  {
    id: 'tutorials',
    name: 'Tutorials'
  },
  {
    id: 'compliance',
    name: 'Compliance'
  }
];

export function getCategoryById(id: string): Category | undefined {
  return BLOG_CATEGORIES.find(category => category.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id;
} 