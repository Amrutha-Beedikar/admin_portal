'use client';

import React, { useState, useEffect } from 'react';

interface Event {
  _id?: string;
  title: string;
  link: string;
  event_time: string;
  video_url?: string;
  description?: string;
}

interface EventFormProps {
  onSubmit: (event: Omit<Event, '_id'>) => void;
  onCancel: () => void;
  initialData?: Event | null;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    event_time: '',
    video_url: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        link: initialData.link,
        event_time: initialData.event_time,
        video_url: initialData.video_url || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.link.trim()) {
      setError('Event link is required');
      return;
    }

    // Validate YouTube link format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(formData.link)) {
      setError('Please enter a valid YouTube link');
      return;
    }

    if (!formData.event_time) {
      setError('Event date and time is required');
      return;
    }

    onSubmit(formData);
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

      {/* Heading (if present) */}
      {typeof window !== 'undefined' && document.querySelector('h2') && (
        <h2 className="text-2xl font-bold text-black mb-4">
          Add New Event
        </h2>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube Link
        </label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter YouTube link"
        />
      </div>

      <div>
        <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-1">
          Event Date and Time
        </label>
        <input
          type="datetime-local"
          id="event_time"
          name="event_time"
          value={formData.event_time}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        />
      </div>

      <div>
        <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
          Video URL (optional)
        </label>
        <input
          type="url"
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter video URL"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          placeholder="Enter event description"
          rows={3}
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
          {initialData ? 'Update Event' : 'Add Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm; 