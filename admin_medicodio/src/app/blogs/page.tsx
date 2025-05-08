'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Blog {
  _id: string;
  title: string;
  author_name?: string;
  status: 'draft' | 'published';
  category?: string;
  tags?: string[];
  default_date?: string;
}

const BlogsPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    date: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
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

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedBlogs.length) return;
    
    if (action === 'delete') {
      if (!confirm('Are you sure you want to delete the selected blogs?')) return;
      
      try {
        await Promise.all(
          selectedBlogs.map(id => 
            fetch(`/api/blogs/${id}`, { method: 'DELETE' })
          )
        );
        fetchBlogs();
        setSelectedBlogs([]);
      } catch (error) {
        console.error('Error deleting blogs:', error);
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBlogs(blogs.map(blog => blog._id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (id: string) => {
    setSelectedBlogs(prev => 
      prev.includes(id) 
        ? prev.filter(blogId => blogId !== id)
        : [...prev, id]
    );
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter.status === 'all' || blog.status === filter.status;
    const matchesCategory = filter.category === 'all' || blog.category === filter.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-5">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
            <Link 
              href="/blogs/new" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Add New
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black shadow-sm"
          >
            <option key="filter-status-all" value="all">All Status</option>
            <option key="filter-status-published" value="published">Published</option>
            <option key="filter-status-draft" value="draft">Draft</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black shadow-sm"
          >
            <option key="filter-category-all" value="all">All Categories</option>
            {categories.map((category) => (
              <option key={`filter-category-${category.id}`} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filter.date}
            onChange={(e) => setFilter(prev => ({ ...prev, date: e.target.value }))}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black shadow-sm"
          >
            <option key="filter-date-all" value="all">All Dates</option>
            <option key="filter-date-today" value="today">Today</option>
            <option key="filter-date-this-month" value="this-month">This Month</option>
            <option key="filter-date-this-year" value="this-year">This Year</option>
          </select>

          <button
            onClick={() => setFilter({ status: 'all', category: 'all', date: 'all' })}
            className="px-3 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Reset Filters
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-4 mb-6">
          <select
            onChange={(e) => handleBulkAction(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black shadow-sm"
            value=""
          >
            <option key="bulk-action-default" value="">Bulk Actions</option>
            <option key="bulk-action-delete" value="delete">Delete</option>
          </select>
          <button
            onClick={() => handleBulkAction('apply')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Apply
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr 
                  key={blog._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/blogs/edit/${blog._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectBlog(blog._id);
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            blog.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.author_name || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.category ? categories.find(cat => cat.id === blog.category)?.name || blog.category : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.tags?.join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.default_date 
                      ? new Date(blog.default_date).toLocaleDateString() 
                      : '—'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage; 