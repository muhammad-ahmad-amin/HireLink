import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    
    // Only clients can post jobs
    if (parsedUser.userType !== "client") {
      navigate("/dashboard");
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !budget || !category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          budget: parseFloat(budget),
          category,
          clientEmail: user.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setBudget("");
        setCategory("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(data.error || "Failed to post job");
      }
    } catch (err) {
      setError("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">HireLink</h1>
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Post a New Job</h1>
          <p className="text-blue-500 mb-6">Fill out the details to create a job posting</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Job posted successfully! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-blue-600 font-semibold mb-2">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a React Dashboard"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-blue-600 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the job in detail..."
                rows="6"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-blue-600 font-semibold mb-2">Budget ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-600 font-semibold mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="web-development">Web Development</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300"
            >
              {loading ? "Posting Job..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
