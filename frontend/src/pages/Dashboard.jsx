import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import heroImg from "../assets/hero.png";

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
      const response = await fetch("https://hirelink-rem9.onrender.com/api/jobs");
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
    <div className="min-h-screen bg-[#f9fafb]">
      <TopNav user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Welcome Section */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-premium overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="p-8 md:p-12 lg:w-3/5 space-y-6 relative z-10">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-upwork-light border border-upwork-green/20 text-upwork-green text-xs font-black tracking-widest uppercase">
                Premium Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-upwork-dark leading-tight">
                Good morning, <br/>
                <span className="text-gradient">{user?.fullName?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-gray-500 text-lg max-w-xl font-medium leading-relaxed">
                {user?.userType === 'client' 
                  ? "Your projects are gaining momentum. Review your applicants and find the perfect match."
                  : "Explore hand-picked opportunities tailored to your specialized skillset."}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {user?.userType === 'client' ? (
                  <Link to="/post-job" className="btn-premium">
                    Post a New Job
                  </Link>
                ) : (
                  <Link to="/browse-jobs" className="btn-premium">
                    Find New Work
                  </Link>
                )}
                <Link to="/browse-jobs" className="btn-premium-outline">
                  Browse Directory
                </Link>
              </div>
            </div>
            <div className="lg:w-2/5 w-full h-64 lg:h-[400px] relative">
              <img 
                src={heroImg} 
                alt="Hero" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:block hidden"></div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user?.userType === 'client' ? (
            <>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-upwork-light flex items-center justify-center text-upwork-green group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Jobs</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-dark">{jobs.filter(j => j.status === 'open').length}</h3>
              </div>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Posted</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-dark">{jobs.length}</h3>
              </div>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-dark">{jobs.filter(j => j.status === 'completed').length}</h3>
              </div>
            </>
          ) : (
            <>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Proposals</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-dark">{jobs.length}</h3>
              </div>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-upwork-light flex items-center justify-center text-upwork-green">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Work</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-dark">{jobs.filter(j => j.status === 'in-progress').length}</h3>
              </div>
              <div className="card-premium p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Earnings</span>
                </div>
                <h3 className="text-4xl font-black text-upwork-green">$0.00</h3>
              </div>
            </>
          )}
        </section>

        {/* Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-upwork-dark tracking-tight">
                {user?.userType === 'client' ? 'Recent Job Listings' : 'Latest Opportunities'}
              </h2>
              <Link to="/my-jobs" className="text-upwork-green font-bold text-sm hover:underline">
                View All &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-upwork-light border-t-upwork-green"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="card-premium p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-upwork-dark mb-2">No jobs found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">Start by creating your first job post or searching for work.</p>
                <Link to={user?.userType === 'client' ? '/post-job' : '/browse-jobs'} className="btn-premium inline-block">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="block group">
                    <div className="card-premium p-6 group-hover:translate-x-2 transition-all border-l-4 border-l-transparent group-hover:border-l-upwork-green">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-upwork-dark group-hover:text-upwork-green transition-colors uppercase tracking-tight">
                          {job.title}
                        </h3>
                        <span className="text-sm font-bold text-gray-400">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 font-medium line-clamp-2 mb-4">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                            <p className="text-lg font-black text-upwork-dark">${job.budget}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            job.status === 'open' ? 'bg-green-100 text-green-700' : 
                            job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <span className="text-upwork-green font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-upwork-dark tracking-tight uppercase">User Profile</h2>
            
            <div className="card-premium p-8 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-upwork-green mx-auto flex items-center justify-center text-4xl font-black text-white shadow-lg">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-black text-upwork-dark uppercase tracking-tight">{user?.fullName}</h3>
                <p className="text-upwork-green font-black text-xs uppercase tracking-widest mt-1">{user?.userType}</p>
              </div>
              <Link to="/free-profile" className="btn-premium-outline w-full py-2.5 text-sm">
                View Profile
              </Link>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connects</p>
                  <p className="text-xl font-black text-upwork-dark">50</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</p>
                  <p className="text-xl font-black text-upwork-green">#12</p>
                </div>
              </div>
            </div>

            <div className="bg-upwork-dark rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">Upgrade to Pro</h4>
                <p className="text-sm text-gray-400 font-medium mb-6 leading-relaxed">Unlock advanced insights, unlimited connects, and priority support.</p>
                <button className="bg-white text-upwork-dark font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-upwork-green hover:text-white transition-all shadow-lg">
                  Learn More
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-upwork-green opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}