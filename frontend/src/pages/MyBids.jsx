import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchBids(JSON.parse(storedUser).email);
  }, [navigate]);

  const fetchBids = async (userEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bids/user/${userEmail}`);
      const data = await response.json();
      if (response.ok) {
        setBids(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch bids");
      }
    } catch (err) {
      setError("Error loading bids");
    } finally {
      setLoading(false);
    }
  };

  const filteredBids = filterStatus
    ? bids.filter((bid) => bid.status === filterStatus)
    : bids;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-8 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">HireLink</h1>
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-md flex flex-col space-y-2 text-sm">
          <Link to="/dashboard" className="text-blue-600 font-semibold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link to="/browse-jobs" className="text-blue-600 font-semibold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            Browse Jobs
          </Link>
          <Link to="/my-bids" className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            My Bids
          </Link>
          <Link to="/wallet" className="text-blue-600 font-semibold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            Wallet
          </Link>
          <Link to="/free-profile" className="text-blue-600 font-semibold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            Profile
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">My Bids</h2>

          {/* Filter */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <label className="text-blue-600 font-semibold mr-4">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Bids</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Bids List */}
          {loading && <p className="text-blue-500">Loading bids...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && filteredBids.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <p className="text-blue-500 mb-4">No bids found</p>
              <Link
                to="/browse-jobs"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Jobs
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg border border-blue-200 transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Link
                      to={`/jobs/${bid.jobId._id || bid.jobId}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {bid.jobId?.title || bid.jobTitle}
                    </Link>
                    <p className="text-blue-500 text-sm">Job ID: {bid.jobId._id || bid.jobId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    bid.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : bid.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {bid.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-2xl font-bold text-blue-600">${bid.bidAmount}</p>
                  <p className="text-blue-500 text-sm mt-2">{bid.proposalText}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-blue-400 text-sm">
                    Bid submitted on {new Date(bid.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/jobs/${bid.jobId}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View Job →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
