'use client';

import React, { useState, useEffect } from 'react';

interface Blog {
  _id?: string;
  slug: string;
  title: string;
  content: string;
  author_name?: string;
  category?: string;
  tags?: string[];
  thumbnail_url?: string;
  thumbnail_alt_text?: string;
}

interface BlogFormProps {
  onSubmit: (blog: Omit<Blog, '_id'>) => void;
  onCancel: () => void;
  initialData?: Blog | null;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    author_name: '',
    category: '',
    tags: '',
    thumbnail_url: '',
    thumbnail_alt_text: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        slug: initialData.slug,
        title: initialData.title,
        content: initialData.content,
        author_name: initialData.author_name || '',
        category: initialData.category || '',
        tags: initialData.tags?.join(', ') || '',
        thumbnail_url: initialData.thumbnail_url || '',
        thumbnail_alt_text: initialData.thumbnail_alt_text || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    // Convert tags string to array
    const tags = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : undefined;

    onSubmit({
      ...formData,
      tags,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter URL slug"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter blog title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter blog content"
          rows={6}
        />
      </div>

      <div>
        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
          Author Name (optional)
        </label>
        <input
          type="text"
          id="author_name"
          name="author_name"
          value={formData.author_name}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter author name"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category (optional)
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter category"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (optional, comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter tags (e.g., tech, news, tutorial)"
        />
      </div>

      <div>
        <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail URL (optional)
        </label>
        <input
          type="url"
          id="thumbnail_url"
          name="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter thumbnail image URL"
        />
      </div>

      <div>
        <label htmlFor="thumbnail_alt_text" className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail Alt Text (optional)
        </label>
        <input
          type="text"
          id="thumbnail_alt_text"
          name="thumbnail_alt_text"
          value={formData.thumbnail_alt_text}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter thumbnail alt text"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          {initialData ? 'Update Blog' : 'Add Blog'}
        </button>
      </div>
    </form>
  );
};

export default BlogForm; 