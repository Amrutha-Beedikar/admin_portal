'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '../BlogForm';

const NewBlogPage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (blog: any) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
      });

      if (response.ok) {
        router.push('/blogs');
      } else {
        console.error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Post</h1>
        </div>
        <div className="bg-white rounded-lg">
          <BlogForm 
            onSubmit={handleSubmit}
            onCancel={() => router.push('/blogs')}
          />
        </div>
      </div>
    </div>
  );
};

export default NewBlogPage; 