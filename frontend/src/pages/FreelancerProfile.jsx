import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function FreelancerProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    bio: "",
    skills: [],
    hourlyRate: 0,
    portfolio: []
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchProfile(userData.email);
  }, [navigate]);

  const fetchProfile = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${email}`);
      const data = await response.json();
      if (response.ok) {
        setProfile(data.profile || {
          bio: "",
          skills: [],
          hourlyRate: 0,
          portfolio: []
        });
      }
      setError("");
    } catch (err) {
      setError("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (response.ok) {
        setProfile(data.profile || profile);
        setEditing(false);
        setError("");
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center">Loading...</div>;

  const reviews = profile.reviews || [];
  const averageRating = profile.averageRating ? profile.averageRating.toFixed(1) : null;
  const reviewCount = profile.reviewCount || 0;

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
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            {/* Profile Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || "User"}&background=3B82F6&color=FFFFFF&rounded=true&size=120`}
                  alt="Freelancer Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{user?.fullName}</h1>
                  <p className="text-blue-100 text-lg mb-6 leading-relaxed">{profile.bio || "No bio added yet"}</p>
                  
                  <div className="flex flex-wrap gap-8 mb-6">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Hourly Rate</p>
                      <p className="text-3xl font-bold">${profile.hourlyRate || "N/A"}</p>
                    </div>
                    {averageRating && (
                      <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Rating</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">⭐ {averageRating}</span>
                          <span className="text-blue-100">({reviewCount} review{reviewCount === 1 ? '' : 's'})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditing(!editing)}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      editing
                        ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {editing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            {editing && (
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-4 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={profile.hourlyRate}
                      onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) })}
                      className="w-full p-4 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">Skills</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 p-4 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-blue-700 hover:text-red-600 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Overview / Bio - Enhanced */}
            {!editing && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {profile.bio || "No bio added yet. Edit your profile to add a compelling bio about yourself."}
                    </p>
                  </section>

                  {/* Skills Section - Enhanced */}
                  {profile.skills && profile.skills.length > 0 && (
                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mt-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Reviews Section - Sidebar */}
                <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 h-fit">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                  {reviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {reviews.map((review) => (
                        <div key={review.jobId + review.reviewerName} className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-gray-900 font-semibold">{review.reviewerName}</h4>
                            <span className="text-yellow-500 text-sm font-semibold">{'⭐'.repeat(review.rating)}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{review.comment || 'No comment provided.'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No reviews yet. Complete jobs and ask clients for feedback!
                      </p>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* Back to Dashboard */}
            <div className="mt-8 pb-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-sm border border-gray-200 hover:border-gray-300"
              >
                <span>←</span>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}