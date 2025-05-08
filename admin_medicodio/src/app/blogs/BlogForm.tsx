'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import dynamic from 'next/dynamic';
import { Editor as TinyMCEEditor } from 'tinymce';
import { Blog, BlogFormData, IRevision } from './types';
import { BLOG_CATEGORIES } from './config/categories';

declare global {
  interface Window {
    tinymce: {
      activeEditor: TinyMCEEditor;
    };
  }
}

// Dynamic import for the preview component
const BlogPreview = dynamic(() => import('./BlogPreview'), { ssr: false });

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  initialData?: Blog | null;
}

interface Category {
  id: string;
  name: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    slug: '',
    title: '',
    content: '',
    author_name: '',
    author_email: '',
    category: '',
    tags: [],
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    alternate_text: '',
    internal_links: [],
    external_links: [],
    status: 'draft',
    default_date: new Date().toISOString().split('T')[0],
    featured: false,
    is_commentable: true,
    revisions: [],
    seo_score: 0
  });

  const [error, setError] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<IRevision | null>(null);
  const [seoAnalysis, setSeoAnalysis] = useState({
    titleLength: 0,
    descriptionLength: 0,
    keywordDensity: 0,
    score: 0
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.default_date 
        ? new Date(initialData.default_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        ...initialData,
        default_date: formattedDate,
        tags: initialData.tags || [],
        internal_links: initialData.internal_links || [],
        external_links: initialData.external_links || [],
        revisions: initialData.revisions || []
      });
      setTagsInput(initialData.tags?.join(', ') || '');
    }
  }, [initialData]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    setCategoryError('');

    if (!newCategory.name.trim()) {
      setCategoryError('Category name is required');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (data.success) {
        setNewCategory({ name: '' });
        setShowNewCategoryForm(false);
        fetchCategories();
      } else {
        setCategoryError(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryError('Failed to add category');
    }
  };

  useEffect(() => {
    // Calculate SEO score whenever relevant fields change
    const calculateSeoScore = () => {
      let score = 0;
      const title = formData.meta_title || formData.title;
      const description = formData.meta_description;
      const keyword = formData.focus_keyword;
      
      // Title length check (50-60 characters ideal)
      if (title.length >= 50 && title.length <= 60) score += 20;
      else if (title.length > 30) score += 10;
      
      // Description length check (150-160 characters ideal)
      if (description && description.length >= 150 && description.length <= 160) score += 20;
      else if (description && description.length > 100) score += 10;
      
      // Keyword presence in title
      if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) score += 20;
      
      // Keyword presence in description
      if (keyword && description?.toLowerCase().includes(keyword.toLowerCase())) score += 20;
      
      // Keyword density in content (1-2.5% ideal)
      if (keyword && formData.content) {
        const keywordCount = (formData.content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        const wordCount = formData.content.split(/\s+/).length;
        const density = (keywordCount / wordCount) * 100;
        
        if (density >= 1 && density <= 2.5) score += 20;
        else if (density > 0) score += 10;
      }
      
      setSeoAnalysis({
        titleLength: title.length,
        descriptionLength: description?.length || 0,
        keywordDensity: Number(((formData.content.split(formData.focus_keyword || '').length - 1) / formData.content.split(' ').length * 100).toFixed(1)),
        score
      });
      
      setFormData(prev => ({ ...prev, seo_score: score }));
    };
    
    calculateSeoScore();
  }, [formData.title, formData.meta_title, formData.meta_description, formData.focus_keyword, formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    // Generate slug if not present
    if (!formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      formData.slug = slug;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'tags') {
      setTagsInput(value);
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(Boolean)
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'default_date') {
      // Ensure the date is in yyyy-MM-dd format
      const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
      setFormData(prev => ({
        ...prev,
        [name]: dateValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleRevisionSelect = (revision: IRevision) => {
    setSelectedRevision(revision);
    setFormData(prev => ({
      ...prev,
      content: revision.content,
      title: revision.title
    }));
  };

  const restoreRevision = () => {
    if (selectedRevision) {
      setFormData(prev => ({
        ...prev,
        content: selectedRevision.content,
        title: selectedRevision.title
      }));
      setSelectedRevision(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-gray-50 p-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          {formData.revisions && formData.revisions.length > 0 && (
            <select
              onChange={(e) => {
                const revision = formData.revisions?.find(r => 
                  r.modified_at.toString() === e.target.value
                );
                if (revision) handleRevisionSelect(revision);
              }}
              className="text-sm border-gray-300 rounded-md text-gray-700 bg-white"
            >
              <option key="blog-revision-default" value="">Select Revision</option>
              {formData.revisions.map((revision, index) => (
                <option key={`blog-revision-${revision.modified_at}`} value={revision.modified_at.toString()}>
                  {new Date(revision.modified_at).toLocaleString()} by {revision.modified_by}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">SEO Score: {seoAnalysis.score}%</span>
          <div className="w-2 h-2 rounded-full" style={{
            backgroundColor: seoAnalysis.score >= 80 ? '#22c55e' : 
                           seoAnalysis.score >= 50 ? '#f59e0b' : '#ef4444'
          }}></div>
        </div>
      </div>

      {isPreviewMode ? (
        <BlogPreview
          title={formData.title}
          content={formData.content}
          author={formData.author_name}
          date={formData.default_date}
          category={formData.category}
          tags={formData.tags}
        />
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-6 p-4 bg-white">
          {/* Main Content Area */}
          <div className="flex-grow">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-200 mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-2xl border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="Add title"
                required
              />
            </div>

            <div className="mb-4 bg-white rounded-lg border border-gray-200">
              <Editor
                id="blog-content-editor"
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #111827; background-color: #ffffff; }',
                  promotion: false,
                  skin: 'oxide'
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Status Panel */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status and Visibility</h3>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  <option key="blog-status-draft" value="draft">Draft</option>
                  <option key="blog-status-published" value="published">Published</option>
                  <option key="blog-status-archived" value="archived">Archived</option>
                  <option key="blog-status-trash" value="trash">Trash</option>
                </select>
                
                <div className="mt-3">
                  <label className="block text-sm text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    id="default_date"
                    name="default_date"
                    value={formData.default_date}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured post</span>
                  </label>
                </div>

                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_commentable"
                      checked={formData.is_commentable}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Allow comments</span>
                  </label>
                </div>
              </div>

              {/* Author Info */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Author Information</h3>
                <input
                  type="text"
                  id="author_name"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black mb-2"
                  placeholder="Author name"
                />
                <input
                  type="email"
                  id="author_email"
                  name="author_email"
                  value={formData.author_email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Author email"
                />
              </div>

              {/* Categories & Tags Panel */}
              <div className="p-4 border-b border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="space-y-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    >
                      <option key="blog-category-default" value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={`blog-category-${category.id}`} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {showNewCategoryForm ? '- Cancel adding category' : '+ Add new category'}
                    </button>

                    {showNewCategoryForm && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-md">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Category Name
                            </label>
                            <input
                              type="text"
                              value={newCategory.name}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                              placeholder="Enter category name"
                              required
                            />
                          </div>
                          {categoryError && (
                            <p className="text-sm text-red-600">{categoryError}</p>
                          )}
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add Category
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tagsInput}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="Add tags, separated by commas"
                  />
                </div>
              </div>

              {/* SEO Panel */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Meta Title
                      <span className="text-xs text-gray-500 ml-1">
                        ({seoAnalysis.titleLength}/60)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="meta_title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      placeholder="SEO title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Meta Description
                      <span className="text-xs text-gray-500 ml-1">
                        ({seoAnalysis.descriptionLength}/160)
                      </span>
                    </label>
                    <textarea
                      id="meta_description"
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      placeholder="SEO description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Focus Keyword
                      <span className="text-xs text-gray-500 ml-1">
                        (Density: {seoAnalysis.keywordDensity}%)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="focus_keyword"
                      name="focus_keyword"
                      value={formData.focus_keyword}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                      placeholder="Focus keyword"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {initialData ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogForm; 