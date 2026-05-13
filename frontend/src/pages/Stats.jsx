import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";

export default function Stats() {
  const [stats, setStats] = useState(null);
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
    const userData = JSON.parse(storedUser);
    if (userData.userType !== 'admin') {
      navigate("/dashboard");
      return;
    }
    setUser(userData);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch("https://hirelink-rem9.onrender.com/api/stats");
      const data = await response.json();
      setStats(data);
      setError("");
    } catch (err) {
      setError("Error loading statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <TopNav user={user} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <TopNav user={user} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const jobStats = stats?.jobs || {};
  const userStats = stats?.users || {};

  // Extract financial summary
  const financialData = jobStats.financialSummary?.[0] || {};
  const categoryData = jobStats.categoryDistribution || [];
  const statusData = jobStats.statusDistribution || [];
  const userTypeData = userStats.userTypeCount || [];
  const topFreelancers = userStats.topFreelancers || [];
  const recentJobCount = jobStats.recentJobVolume?.[0]?.count || 0;

  const totalJobs = categoryData.reduce((sum, cat) => sum + (cat.count || 0), 0);
  const totalUsers = userTypeData.reduce((sum, type) => sum + (type.count || 0), 0);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TopNav user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <section>
          <h1 className="text-4xl font-black text-upwork-dark mb-2">Platform Statistics</h1>
          <p className="text-gray-500">Real-time insights into HireLink's activity and performance</p>
        </section>

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Jobs */}
          <div className="card-premium p-6 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3z"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">Total Jobs</span>
            </div>
            <h3 className="text-3xl font-black text-upwork-dark">{totalJobs}</h3>
            <p className="text-xs text-gray-400 mt-2">{recentJobCount} in last 30 days</p>
          </div>

          {/* Total Users */}
          <div className="card-premium p-6 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
            </div>
            <h3 className="text-3xl font-black text-upwork-dark">{totalUsers}</h3>
            <p className="text-xs text-gray-400 mt-2">Active on platform</p>
          </div>

          {/* Average Budget */}
          <div className="card-premium p-6 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.16 2.75a.75.75 0 00-1.08.6v5.69h-.75A1.75 1.75 0 004.67 11v.5c0 .966.784 1.75 1.75 1.75h.75v4.69a.75.75 0 001.08.6l8.5-5.5a.75.75 0 000-1.2l-8.5-5.5zm1.84 6.69v-4.36l6.62 4.3-6.62 4.3v-4.24h-.75a.25.25 0 00-.25.25V11a.25.25 0 00.25.25h.75z"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">Avg Budget</span>
            </div>
            <h3 className="text-3xl font-black text-upwork-dark">${Math.round(financialData.averageBudget || 0)}</h3>
            <p className="text-xs text-gray-400 mt-2">Per job</p>
          </div>

          {/* Total Budget */}
          <div className="card-premium p-6 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">Total Budget</span>
            </div>
            <h3 className="text-3xl font-black text-upwork-dark">${Math.round(financialData.totalBudget || 0)}</h3>
            <p className="text-xs text-gray-400 mt-2">Platform value</p>
          </div>
        </section>

        {/* Financial Summary */}
        <section className="card-premium p-8">
          <h2 className="text-2xl font-black text-upwork-dark mb-6">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Max Budget</p>
              <p className="text-3xl font-black text-upwork-green">${Math.round(financialData.maxBudget || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Min Budget</p>
              <p className="text-3xl font-black text-upwork-dark">${Math.round(financialData.minBudget || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Total Budget</p>
              <p className="text-3xl font-black text-upwork-dark">${Math.round(financialData.totalBudget || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Average Budget</p>
              <p className="text-3xl font-black text-upwork-green">${Math.round(financialData.averageBudget || 0)}</p>
            </div>
          </div>
        </section>

        {/* Two Column Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Distribution by Category */}
          <div className="card-premium p-8">
            <h2 className="text-2xl font-black text-upwork-dark mb-6">Jobs by Category</h2>
            <div className="space-y-4">
              {categoryData.length > 0 ? (
                categoryData.map((cat, idx) => {
                  const percentage = totalJobs > 0 ? (cat.count / totalJobs) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{cat._id}</span>
                        <span className="text-sm font-black text-upwork-green">{cat.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-upwork-green h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </div>

          {/* Job Distribution by Status */}
          <div className="card-premium p-8">
            <h2 className="text-2xl font-black text-upwork-dark mb-6">Jobs by Status</h2>
            <div className="space-y-4">
              {statusData.length > 0 ? (
                statusData.map((status, idx) => {
                  const statusColors = {
                    open: "bg-upwork-green",
                    in_progress: "bg-blue-500",
                    completed: "bg-purple-500",
                    closed: "bg-gray-500"
                  };
                  const percentage = totalJobs > 0 ? (status.count / totalJobs) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700 capitalize">{status._id}</span>
                        <span className="text-sm font-black text-upwork-green">{status.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${statusColors[status._id] || 'bg-upwork-green'} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </div>
        </section>

        {/* User Statistics */}
        <section className="card-premium p-8">
          <h2 className="text-2xl font-black text-upwork-dark mb-6">User Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-700 mb-4">User Types</h3>
              <div className="space-y-3">
                {userTypeData.length > 0 ? (
                  userTypeData.map((type, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{type._id}</span>
                      <span className="text-lg font-black text-upwork-green">{type.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No data available</p>
                )}
              </div>
            </div>

            {/* Top Freelancers */}
            <div>
              <h3 className="font-bold text-gray-700 mb-4">Top Freelancers</h3>
              <div className="space-y-3">
                {topFreelancers.length > 0 ? (
                  topFreelancers.map((freelancer, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{freelancer.fullName}</p>
                          <p className="text-xs text-gray-500">{freelancer.email}</p>
                        </div>
                        <span className="text-xs font-black bg-upwork-light text-upwork-green px-2 py-1 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.round(freelancer.rating) ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {freelancer.rating?.toFixed(1) || "N/A"} ({freelancer.reviewCount} reviews)
                        </span>
                      </div>
                      {freelancer.skills && freelancer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {freelancer.skills.slice(0, 3).map((skill, skillIdx) => (
                            <span key={skillIdx} className="text-xs bg-upwork-light text-upwork-green px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {freelancer.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{freelancer.skills.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No freelancer data available</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Timestamp */}
        <section className="text-center text-sm text-gray-500">
          <p>Last updated: {new Date(stats?.timestamp).toLocaleString()}</p>
        </section>
      </main>
    </div>
  );
}
