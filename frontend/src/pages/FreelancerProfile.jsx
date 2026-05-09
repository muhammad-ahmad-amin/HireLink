import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  if (loading) return (
    <div className="min-h-screen bg-[#f9fafb] flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-emerald-600"></div>
    </div>
  );

  const reviews = profile.reviews || [];
  const averageRating = profile.averageRating ? profile.averageRating.toFixed(1) : null;
  const reviewCount = profile.reviewCount || 0;

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans">
      <TopNav user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-medium">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 relative z-10">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.fullName || "User"}&background=10b981&color=ffffff&rounded=true&size=150`}
              alt="Freelancer Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-gray-200 shadow-sm object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{user?.fullName}</h1>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all border ${
                    editing
                      ? 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {editing ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>
              
              <p className="text-gray-500 text-lg md:text-xl mb-8 leading-relaxed max-w-3xl">
                {profile.bio || "No professional overview added yet. Edit your profile to introduce yourself."}
              </p>
              
              <div className="flex flex-wrap gap-8 md:gap-12">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Hourly Rate</p>
                  <p className="text-3xl font-bold text-gray-900">${profile.hourlyRate || "0"}<span className="text-lg text-gray-400 font-medium">/hr</span></p>
                </div>
                {averageRating && (
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Client Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      <span className="text-gray-500 font-medium ml-1">({reviewCount} Reviews)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Profile Settings</h2>
            
            <div className="space-y-8 max-w-4xl">
              <div>
                <label className="block text-gray-900 font-semibold mb-3">Professional Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-5 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base leading-relaxed"
                  rows="5"
                  placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                />
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-3">Hourly Rate (USD)</label>
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-9 pr-5 py-4 border border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-3">Skills & Expertise</label>
                <div className="flex gap-3 mb-6 max-w-xl">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="e.g. React, Node.js, UI Design"
                    className="flex-1 p-4 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Add Skill
                  </button>
                </div>
                
                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-3 font-medium shadow-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-colors font-semibold shadow-sm"
              >
                Save Profile Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Overview / Content Area */}
        {!editing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  About Me
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-loose text-lg whitespace-pre-wrap">
                    {profile.bio || "This freelancer hasn't written a bio yet."}
                  </p>
                </div>
              </section>

              {/* Skills Section */}
              {profile.skills && profile.skills.length > 0 && (
                <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    Core Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-50 border border-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors hover:bg-white hover:shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Reviews Section */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  Client Feedback
                </h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-5">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.jobId + review.reviewerName} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-gray-900 font-bold">{review.reviewerName}</h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment || 'No comment provided.'}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <p className="text-gray-500 font-medium">No feedback yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Complete projects to build your reputation.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}