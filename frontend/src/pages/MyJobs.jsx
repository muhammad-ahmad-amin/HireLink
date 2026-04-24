import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [reviewForm, setReviewForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    
    // Only clients can access this page
    if (parsedUser.userType !== "client") {
      navigate("/dashboard");
      return;
    }
    
    setUser(parsedUser);
    fetchMyJobs(parsedUser.email);
  }, [navigate]);

  const fetchMyJobs = async (clientEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/client/${clientEmail}`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
        setError("");
      } else {
        setError(data.error || "Failed to load jobs");
      }
    } catch (err) {
      setError("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleHireFreelancer = async (jobId, freelancerEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freelancerEmail })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Freelancer hired successfully!");
        // Refresh the jobs
        fetchMyJobs(user.email);
        setSelectedApplicant(null);
      } else {
        alert(data.error || "Failed to hire freelancer");
      }
    } catch (err) {
      alert("Error hiring freelancer");
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffMs = now - jobDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleReviewChange = (jobId, field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [field]: value
      }
    }));
  };

  const submitReview = async (job) => {
    const form = reviewForm[job._id] || {};
    if (!form.rating || !form.comment?.trim()) {
      alert('Please provide a rating and a comment before submitting.');
      return;
    }

    setReviewForm(prev => ({
      ...prev,
      [job._id]: {
        ...prev[job._id],
        submitting: true
      }
    }));

    try {
      const response = await fetch(`http://localhost:5000/api/users/${job.hiredFreelancer}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: user.fullName,
          rating: Number(form.rating),
          comment: form.comment,
          jobId: job._id
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review submitted successfully.');
        setReviewForm(prev => ({
          ...prev,
          [job._id]: {
            ...prev[job._id],
            submitted: true,
            submitting: false
          }
        }));
      } else {
        alert(data.error || 'Failed to submit review.');
        setReviewForm(prev => ({
          ...prev,
          [job._id]: {
            ...prev[job._id],
            submitting: false
          }
        }));
      }
    } catch (err) {
      console.error('Review submit error:', err);
      alert('Error submitting review.');
      setReviewForm(prev => ({
        ...prev,
        [job._id]: {
          ...prev[job._id],
          submitting: false
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNav user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar user={user} />

          {/* Main Content */}
          <div className="flex-1 ml-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Posted Jobs</h2>

            {loading && <p className="text-gray-600">Loading jobs...</p>}
            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {!loading && jobs.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
                <Link
                  to="/post-job"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Post a Job
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600">{job.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        job.status === "open"
                          ? "bg-green-100 text-green-700"
                          : job.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
                      <div>
                        <p className="text-gray-600 text-sm">Budget</p>
                        <p className="text-xl font-bold text-gray-900">${job.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Category</p>
                        <p className="text-lg font-bold text-gray-900">{job.category || "General"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Posted</p>
                        <p className="text-lg font-bold text-gray-900">{formatDate(job.createdAt)}</p>
                      </div>
                    </div>

                    {/* Applications Section */}
                    <div className="mt-6">
                      <button
                        onClick={() => setExpandedJobId(expandedJobId === job._id ? null : job._id)}
                        className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex justify-between items-center"
                      >
                        <span className="font-semibold text-blue-900">
                          Applications ({job.applications?.length || 0})
                        </span>
                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${expandedJobId === job._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {expandedJobId === job._id && (
                        <div className="mt-4 space-y-3">
                          {job.applications && job.applications.length > 0 ? (
                            job.applications.map((applicant, idx) => (
                              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold text-gray-900">{applicant.freelancerName}</p>
                                    <p className="text-sm text-gray-600">{applicant.freelancerEmail}</p>
                                    <p className="text-xs text-gray-500 mt-1">Applied {formatDate(applicant.appliedAt)}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setSelectedApplicant(applicant)}
                                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                      View Profile
                                    </button>
                                    <button
                                      onClick={() => handleHireFreelancer(job._id, applicant.freelancerEmail)}
                                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                    >
                                      Hire
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 p-4">No applications yet</p>
                          )}
                        </div>
                      )}

                      {job.status === 'completed' && job.hiredFreelancer && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="text-lg font-semibold text-green-800 mb-3">Leave a review for the hired freelancer</h4>
                          {reviewForm[job._id]?.submitted ? (
                            <p className="text-green-700">Thank you! Your review was submitted.</p>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                  <select
                                    value={reviewForm[job._id]?.rating || ''}
                                    onChange={(e) => handleReviewChange(job._id, 'rating', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                                  >
                                    <option value="">Select rating</option>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                                  <textarea
                                    value={reviewForm[job._id]?.comment || ''}
                                    onChange={(e) => handleReviewChange(job._id, 'comment', e.target.value)}
                                    rows="3"
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                                    placeholder="Share your experience working with this freelancer"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => submitReview(job)}
                                disabled={reviewForm[job._id]?.submitting}
                                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-70"
                              >
                                {reviewForm[job._id]?.submitting ? 'Submitting...' : 'Submit Review'}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
