import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

export default function MyApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.userType !== 'freelancer') {
      navigate('/dashboard');
      return;
    }

    fetchFreelancerJobs();
  }, []);

  const fetchFreelancerJobs = async () => {
    try {
      const response = await fetch(`https://hirelink-rem9.onrender.com/api/jobs/freelancer/${user.email}`);
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const getApplicationStatus = (job) => {
    const application = job.applications.find(app => app.freelancerEmail === user.email);
    
    if (!application) return 'unknown';
    
    if (job.status === 'completed') {
      return 'completed';
    } else if (job.hiredFreelancer === user.email && job.status === 'in-progress') {
      return 'hired';
    }
    
    return 'applied';
  };

  const handleCompleteJob = async (jobId) => {
    try {
      const response = await fetch(`https://hirelink-rem9.onrender.com/api/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freelancerEmail: user.email })
      });

      if (response.ok) {
        fetchFreelancerJobs();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to complete job');
      }
    } catch (error) {
      console.error('Error completing job:', error);
      alert('Error completing job');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
        return 'bg-green-50 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'applied':
        return 'Pending';
      case 'hired':
        return 'Hired';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNav user={user} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sidebar and Main Content */}
        <div className="flex gap-8">{/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
                  <Link to="/browse-jobs" className="text-[#14a800] hover:text-[#118f00] font-medium">
                    Browse Jobs →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const status = getApplicationStatus(job);
                    return (
                      <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${getStatusColor(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-600">Budget</span>
                            <p className="font-semibold text-gray-900">${job.budget}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Category</span>
                            <p className="font-semibold text-gray-900">{job.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Posted by</span>
                            <p className="font-semibold text-gray-900">{job.clientEmail}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="px-4 py-2 text-sm font-medium text-[#14a800] hover:text-[#118f00] hover:bg-green-50 rounded-lg transition-colors"
                          >
                            View Details
                          </Link>

                          {status === 'hired' && (
                            <button
                              onClick={() => handleCompleteJob(job._id)}
                              className="px-4 py-2 text-sm font-medium text-[#14a800] hover:text-[#118f00] hover:bg-green-50 rounded-lg transition-colors"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
