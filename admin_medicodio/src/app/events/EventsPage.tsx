'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm from './EventForm';
import EventCard from './EventCard';

interface Event {
  _id: string;
  title: string;
  link: string;
  event_time: string;
  video_url?: string;
  description?: string;
  created_at: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (eventData: Omit<Event, '_id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      if (data.success) {
        setEvents([...events, data.data]);
        setIsAddingEvent(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleEditEvent = async (event: Event) => {
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      if (data.success) {
        setEvents(events.map((e) => (e._id === event._id ? data.data : e)));
        setEditingEvent(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setEvents(events.filter((event) => event._id !== eventId));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Event
          </button>
        </div>

        {/* Event Form Modal */}
        {(isAddingEvent || editingEvent) && (
          <>
            {/* Blurred Overlay */}
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10"></div>
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <EventForm
                  onSubmit={editingEvent
                    ? (data) => handleEditEvent({ ...data, _id: editingEvent._id, created_at: editingEvent.created_at })
                    : handleAddEvent
                  }
                  onCancel={() => {
                    setIsAddingEvent(false);
                    setEditingEvent(null);
                  }}
                  initialData={editingEvent}
                />
              </div>
            </div>
          </>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={() => setEditingEvent(event)}
              onDelete={() => handleDeleteEvent(event._id)}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No events added yet. Click "Add New Event" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 