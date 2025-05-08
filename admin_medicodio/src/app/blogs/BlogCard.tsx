'use client';

import React from 'react';
import { Blog } from './types';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      onDelete(blog._id);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            blog.status === 'published' ? 'bg-green-100 text-green-800' :
            blog.status === 'archived' ? 'bg-gray-100 text-gray-800' :
            blog.status === 'trash' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {blog.status}
          </span>
          {blog.category && (
            <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
              {blog.category}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(blog)}
            className="p-1 text-gray-600 hover:text-indigo-600"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-600 hover:text-red-600"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {blog.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {truncateText(blog.content, 150)}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">👤</span>
            {blog.author_name || 'Anonymous'}
            <span className="mx-2">•</span>
            <span>{blog.default_date ? new Date(blog.default_date).toLocaleDateString() : 'No date'}</span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-2">SEO Title:</span>
              {truncateText(blog.meta_title || blog.title, 60)}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-2">Keywords:</span>
              {blog.focus_keyword || 'None'}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium mr-2">Links:</span>
              {`${blog.internal_links?.length || 0} internal, ${blog.external_links?.length || 0} external`}
            </div>
            {blog.content_length && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="font-medium mr-2">Length:</span>
                {blog.content_length} characters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 