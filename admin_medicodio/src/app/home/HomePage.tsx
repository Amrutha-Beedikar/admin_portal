'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const cards = [
    {
      title: 'Blog',
      description: 'Read our latest articles and updates',
      icon: '📝',
      path: '/blog'
    },
    {
      title: 'Events',
      description: 'Discover upcoming events and webinars',
      icon: '🎉',
      path: '/events'
    },
    {
      title: 'Career',
      description: 'Explore career opportunities with us',
      icon: '💼',
      path: '/career'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to MediCodio
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              router.push('/login');
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => router.push(card.path)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600">
                  {card.description}
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Learn more →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 