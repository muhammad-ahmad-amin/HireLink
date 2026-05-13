import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

export default function AdminJobs() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.userType !== 'admin') {
      navigate("/dashboard");
      return;
    }
    setLoading(false);
  }, [navigate, user]);

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <main className="p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-black text-upwork-dark mb-2">Job Management</h2>
          <p className="text-gray-600">Monitor and manage all job postings on the platform</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-upwork-dark mb-2">Job Management Module</h3>
            <p className="text-gray-600 mb-6">This module is coming soon. You'll be able to manage all platform jobs here.</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Features will include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>View all job postings</li>
                <li>Filter by status (Open/In Progress/Completed)</li>
                <li>Monitor job applications and bids</li>
                <li>Manage job disputes and removals</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
