import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

export default function AdminUsers() {
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
          <h2 className="text-3xl font-black text-upwork-dark mb-2">User Management</h2>
          <p className="text-gray-600">Manage all users on the HireLink platform</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-upwork-dark mb-2">User Management Module</h3>
            <p className="text-gray-600 mb-6">This module is coming soon. You'll be able to manage all platform users here.</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Features will include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>View all registered users</li>
                <li>Filter by user type (Client/Freelancer)</li>
                <li>Suspend or activate accounts</li>
                <li>View user activity and stats</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
