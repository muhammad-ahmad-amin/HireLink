import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans">
      <TopNav user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-10 mb-12 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-3 text-gray-500 text-lg max-w-2xl">
              {user?.userType === 'client' 
                ? "Here is what's happening with your job listings and hiring pipeline today."
                : "Here is your professional overview and the latest opportunities waiting for you."}
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            {user?.userType === 'client' && (
              <Link
                to="/post-job"
                className="bg-emerald-600 text-white px-6 py-3 text-base font-semibold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Post a New Job
              </Link>
            )}
            <Link
              to="/browse-jobs"
              className="bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 text-base font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {user?.userType === 'client' ? (
            <>
              {/* Stat Card 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.filter(j => j.status === 'open').length}</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Posted</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.length}</h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.filter(j => j.status === 'completed').length}</h3>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Stat Card 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Proposals</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.length}</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Work</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.filter(j => j.status === 'in-progress').length}</h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{jobs.filter(j => j.status === 'completed').length}</h3>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Jobs Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.userType === 'client' ? 'Your Recent Listings' : 'Latest Opportunities'}
            </h2>
            {user?.userType === 'client' && (
              <Link to="/my-jobs" className="text-emerald-600 font-semibold hover:text-emerald-700">
                View All Directory &rarr;
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">There are currently no job listings available in the system. Check back later or create a new one.</p>
              {user?.userType === 'client' && (
                <Link to="/post-job" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                  Create First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.slice(0, 4).map((job) => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="group block">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 
                          job.status === 'in-progress' ? 'bg-blue-50 text-blue-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status === 'open' ? 'OPEN' : job.status === 'in-progress' ? 'IN PROGRESS' : 'COMPLETED'}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">{formatDate(job.createdAt)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-3 line-clamp-1">
                        {job.title}
                      </h3>
                      
                      <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-6">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Budget</p>
                          <p className="text-lg font-bold text-gray-900">${job.budget}</p>
                        </div>
                      </div>
                      <span className="text-emerald-600 font-semibold group-hover:underline flex items-center gap-1">
                        Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}