import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      setJobs(data);
      setError("");
    } catch (err) {
      setError("Error loading jobs");
    } finally {
      setLoading(false);
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h2>
                  <p className="text-blue-100 mb-6 text-lg">
                    {user?.userType === 'client' 
                      ? "Find talented freelancers and grow your business"
                      : "Discover exciting opportunities and grow your career"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {user?.userType === 'client' && (
                      <Link
                        to="/post-job"
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                      </Link>
                    )}
                    <Link
                      to="/browse-jobs"
                      className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all font-semibold border-2 border-white flex items-center backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Jobs
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <svg className="w-48 h-48 text-white opacity-15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {user?.userType === 'client' ? (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {jobs.filter(j => j.status === 'open').length}
                        </h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total Posted</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.length}</h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Completed</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {jobs.filter(j => j.status === 'completed').length}
                        </h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Applications</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.length}</h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Hired Jobs</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {jobs.filter(j => j.status === 'in-progress').length}
                        </h3>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1m2-1v2.5M2 7l2-1 2 1M4 7v2.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Completed</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {jobs.filter(j => j.status === 'completed').length}
                        </h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Recently Posted Jobs / Available Jobs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user?.userType === 'client' ? '📋 Your Posted Jobs' : 'Latest Opportunities'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {user?.userType === 'client' 
                      ? 'Manage and track your job postings'
                      : 'Discover new projects perfectly matched for you'}
                  </p>
                </div>
                {user?.userType === 'client' && (
                  <Link
                    to="/my-jobs"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    View All →
                  </Link>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600"></div>
                </div>
              )}
              
              {!loading && jobs.length === 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-12 text-center border border-blue-100">
                  <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                  </svg>
                  <p className="text-gray-600 text-lg font-medium">No jobs available yet</p>
                  {user?.userType === 'client' && (
                    <Link to="/post-job" className="text-blue-600 hover:text-blue-700 font-semibold mt-2">
                      Post your first job →
                    </Link>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.slice(0, 6).map((job) => (
                  <Link key={job._id} to={`/jobs/${job._id}`}>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(job.createdAt)}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                          job.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : job.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status === 'open' ? '🟢 Open' : job.status === 'in-progress' ? '🔵 In Progress' : '✅ Completed'}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-blue-600">${job.budget}</span>
                          <span className="text-xs text-gray-500 ml-2">• {job.category}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {!loading && jobs.length > 6 && (
                <div className="text-center mt-6">
                  <Link
                    to={user?.userType === 'client' ? '/my-jobs' : '/browse-jobs'}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View All Jobs →
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}