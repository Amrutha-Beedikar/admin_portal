'use client';

import React, { useState, useEffect } from 'react';
import JobForm from './JobForm';
import JobCard from './JobCard';

interface Job {
  id: string;
  title: string;
  description: string;
  experience: string;
}

const CareerPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/careers');
        const data = await response.json();
        if (data.success) {
          // Map API response to Job interface
          const mappedJobs = data.data.map((career: any) => ({
            id: career._id,
            title: career.job_title,
            description: career.description || '',
            experience: career.experience || '',
          }));
          setJobs(mappedJobs);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleAddJob = async (job: Omit<Job, 'id'>) => {
    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: job.title,
          description: job.description,
          experience: job.experience,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setJobs((prev) => [
          ...prev,
          {
            id: data.data._id,
            title: data.data.job_title,
            description: data.data.description || '',
            experience: data.data.experience || '',
          },
        ]);
        setIsAddingJob(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add job');
    }
  };

  const handleEditJob = async (job: Job) => {
    try {
      const response = await fetch(`/api/careers/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: job.title,
          description: job.description,
          experience: job.experience,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  id: data.data._id,
                  title: data.data.job_title,
                  description: data.data.description || '',
                  experience: data.data.experience || '',
                }
              : j
          )
        );
        setEditingJob(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/careers/${jobId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Career Opportunities</h1>
          <button
            onClick={() => setIsAddingJob(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Job
          </button>
        </div>

        {/* Job Form Modal */}
        {(isAddingJob || editingJob) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-black mb-4">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <JobForm
                onSubmit={
                  editingJob
                    ? (data: Omit<Job, 'id'>) => handleEditJob({ ...data, id: editingJob.id })
                    : handleAddJob
                }
                onCancel={() => {
                  setIsAddingJob(false);
                  setEditingJob(null);
                }}
                initialData={editingJob}
              />
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-8">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => setEditingJob(job)}
              onDelete={() => handleDeleteJob(job.id)}
            />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No job openings yet. Click "Add New Job" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPage; 