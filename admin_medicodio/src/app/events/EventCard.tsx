'use client';

import React, { useState } from 'react';

interface Event {
  _id: string;
  title: string;
  link: string;
  event_time: string;
  video_url?: string;
  description?: string;
}

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(event.link);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '/placeholder-thumbnail.jpg';

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video cursor-pointer" onClick={handlePlay}>
        <img
          src={thumbnailUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Conducted on: {new Date(event.event_time).toLocaleString()}
        </p>
        {event.description && (
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && videoId && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl shadow-2xl border border-gray-200 bg-transparent">
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              Close
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={event.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard; 