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
import Wallet from "./pages/Wallet";

function App() {
  return (
    <Router>
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
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  );
}

export default App;