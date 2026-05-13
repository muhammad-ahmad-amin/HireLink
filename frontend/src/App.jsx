import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import BrowseJobs from "./pages/BrowseJobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import MyApplications from "./pages/MyApplications";
import Stats from "./pages/Stats";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStats from "./pages/AdminStats";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import Footer from "./components/Footer";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/free-profile" element={<FreelancerProfile />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;