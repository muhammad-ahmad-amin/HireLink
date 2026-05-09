import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchJob();
  }, [jobId, navigate]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
      const data = await response.json();
      if (response.ok) {
        setJob(data);
      } else {
        setError(data.error || "Job not found");
      }
    } catch (err) {
      setError("Error loading job");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerEmail: user.email,
          freelancerName: user.fullName
        })
      });

      const data = await response.json();

      if (response.ok) {
        setHasApplied(true);
        alert("Application submitted successfully!");
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch (err) {
      alert("Error submitting application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading...</div>;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link to="/browse-jobs" className="text-[#14a800] hover:underline">Back to Browse Jobs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#14a800]">HireLink</h1>
        <Link
          to="/browse-jobs"
          className="bg-[#14a800] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#118f00] transition-colors"
        >
          Back to Jobs
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Job Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#14a800] mb-2">{job.title}</h1>
              <p className="text-[#14a800]">Posted by: {job.clientEmail}</p>
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

          <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-blue-200">
            <div>
              <p className="text-[#14a800] text-sm">Budget</p>
              <p className="text-2xl font-bold text-[#14a800]">${job.budget}</p>
            </div>
            <div>
              <p className="text-[#14a800] text-sm">Category</p>
              <p className="text-lg font-bold text-[#14a800]">{job.category || "General"}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#14a800] mb-3">Description</h2>
          <p className="text-[#14a800] text-base leading-relaxed mb-6">{job.description}</p>

          {/* Apply Button */}
          {user?.userType === "freelancer" && job.status === "open" && (
            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                hasApplied
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : applying
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-[#14a800] text-white hover:bg-[#118f00]"
              }`}
            >
              {hasApplied ? "✓ Applied" : applying ? "Submitting..." : "Apply for this Job"}
            </button>
          )}

          {user?.userType === "client" && (
            <div className="p-4 bg-green-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">You are viewing this as a client. Only freelancers can apply for jobs.</p>
            </div>
          )}

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-[#14a800] text-white hover:bg-[#118f00] transition-colors"
            >
              Login to Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
