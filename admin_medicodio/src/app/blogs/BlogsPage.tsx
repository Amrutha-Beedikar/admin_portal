'use client';

import React, { useState, useEffect } from 'react';
import BlogForm from './BlogForm';
import BlogCard from './BlogCard';
import { Blog, BlogFormData } from './types';

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = async (blogData: BlogFormData) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      const data = await response.json();
      if (data.success) {
        setBlogs([...blogs, data.data]);
        setIsAddingBlog(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create blog');
    }
  };

  const handleEditBlog = async (blog: Blog) => {
    try {
      const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.map((b) => (b._id === blog._id ? data.data : b)));
        setEditingBlog(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update blog');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Blogs</h1>
          <button
            onClick={() => setIsAddingBlog(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Blog
          </button>
        </div>

        {/* Blog Form Modal */}
        {(isAddingBlog || editingBlog) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingBlog ? 'Edit Blog' : 'Add New Blog'}
              </h2>
              <BlogForm
                onSubmit={editingBlog
                  ? (data) => handleEditBlog({ ...data, _id: editingBlog._id })
                  : handleAddBlog
                }
                onCancel={() => {
                  setIsAddingBlog(false);
                  setEditingBlog(null);
                }}
                initialData={editingBlog}
              />
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={() => setEditingBlog(blog)}
              onDelete={() => handleDeleteBlog(blog._id)}
            />
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No blogs added yet. Click "Add New Blog" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage; 