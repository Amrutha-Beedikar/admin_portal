'use client';

import React from 'react';

interface Job {
  id: string;
  title: string;
  description: string;
  experience: string;
}

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
      <p className="text-gray-700 mb-2">{job.description}</p>
      <p className="text-sm text-gray-500 mb-4">Experience: {job.experience}</p>
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
  );
};

export default JobCard; 