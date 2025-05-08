import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

const postsDirectory = path.join(process.cwd(), 'content/blog');

// Generate a unique slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate content length
function calculateContentLength(content: string): number {
  return content.replace(/\s/g, '').length;
}

// Process internal and external links
function processLinks(content: string) {
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  
  // Simple regex to find links (you might want to use a proper markdown parser)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('/') || url.startsWith('#')) {
      internalLinks.push(url);
    } else {
      externalLinks.push(url);
    }
  }
  
  return { internalLinks, externalLinks };
}

export function getAllPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const { internalLinks, externalLinks } = processLinks(content);
    const contentLength = calculateContentLength(content);

    return {
      slug,
      content,
      internal_links: internalLinks,
      external_links: externalLinks,
      content_length: contentLength,
      last_modified: fs.statSync(fullPath).mtime.toISOString(),
      ...data,
    } as BlogPost;
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const { internalLinks, externalLinks } = processLinks(content);
  const contentLength = calculateContentLength(content);

  return {
    slug,
    content,
    internal_links: internalLinks,
    external_links: externalLinks,
    content_length: contentLength,
    last_modified: fs.statSync(fullPath).mtime.toISOString(),
    ...data,
  } as BlogPost;
}

// Create a new blog post
export async function createBlogPost(postData: Omit<BlogPost, 'slug' | 'content_length' | 'last_modified'>) {
  const slug = generateSlug(postData.title);
  const contentLength = calculateContentLength(postData.content);
  const { internalLinks, externalLinks } = processLinks(postData.content);
  
  const post: BlogPost = {
    ...postData,
    slug,
    content_length: contentLength,
    internal_links: internalLinks,
    external_links: externalLinks,
    last_modified: new Date().toISOString(),
  };

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const frontMatter = matter.stringify(post.content, {
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    focus_keyword: post.focus_keyword,
    thumbnail: post.thumbnail,
    alternate_text: post.alternate_text,
    status: post.status,
  });

  fs.writeFileSync(filePath, frontMatter);
  return post;
} 