'use client';

import React from 'react';

interface Blog {
  _id: string;
  slug: string;
  title: string;
  content: string;
  author_name?: string;
  category?: string;
  tags?: string[];
  thumbnail_url?: string;
  thumbnail_alt_text?: string;
  default_date?: string;
}

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {blog.thumbnail_url && (
        <div className="relative h-48 w-full">
          <img
            src={blog.thumbnail_url}
            alt={blog.thumbnail_alt_text || blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {blog.category && (
            <span className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
              {blog.category}
            </span>
          )}
          <span className="text-sm text-gray-500">
            {blog.default_date ? new Date(blog.default_date).toLocaleDateString() : 'No date'}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content}
        </p>

        {blog.author_name && (
          <p className="text-sm text-gray-500 mb-4">
            By {blog.author_name}
          </p>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(blog)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 