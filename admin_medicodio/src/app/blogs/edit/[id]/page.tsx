'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import BlogForm from '../../BlogForm';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = React.use(params);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${resolvedParams.id}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedBlog: any) => {
    try {
      const response = await fetch(`/api/blogs/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      if (response.ok) {
        router.push('/blogs');
      } else {
        console.error('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>
      <BlogForm 
        initialData={blog}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/blogs')}
      />
    </div>
  );
} 