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

  const dummy_reviews = [
    { id: 1, name: "Alice", rating: 5, comment: "Great work, highly recommended!" },
    { id: 2, name: "Bob", rating: 4, comment: "Delivered on time and professional." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-5xl">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center md:items-start">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.fullName || "User"}&background=3B82F6&color=FFFFFF&rounded=true&size=128`}
            alt="Freelancer Avatar"
            className="w-28 h-28 rounded-full border-4 border-blue-300 mb-4 md:mb-0"
          />
          <div className="md:ml-6 flex-1">
            <h1 className="text-2xl font-bold text-blue-600">{user?.fullName}</h1>
            <p className="text-blue-500 text-sm mb-2">{profile.bio || "No bio added yet"}</p>
            <div className="flex items-center mb-2 space-x-2">
              <span className="text-purple-600 font-semibold">⭐ {profile.hourlyRate ? profile.hourlyRate : "N/A"}</span>
              <span className="text-blue-400 text-sm">Hourly Rate</span>
            </div>
            <p className="text-blue-500 text-sm">User Type: {user?.userType}</p>
            <button
              onClick={() => setEditing(!editing)}
              className="mt-3 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleUpdateProfile} className="bg-white mt-6 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Edit Profile</h2>
            
            <div className="mb-4">
              <label className="block text-blue-600 font-semibold mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-600 font-semibold mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) })}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-600 font-semibold mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Overview / Bio */}
        {!editing && (
          <section className="bg-white mt-6 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Overview</h2>
            <p className="text-blue-500 text-sm">
              {profile.bio || "No bio added yet. Edit your profile to add a bio."}
            </p>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-blue-600 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Reviews Section */}
        <section className="bg-white mt-6 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Reviews</h2>
          {dummy_reviews.map((review) => (
            <div key={review.id} className="border-b border-blue-200 pb-3 mb-3 last:border-b-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-blue-600 font-semibold">{review.name}</h4>
                <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-blue-500 text-sm">{review.comment}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}