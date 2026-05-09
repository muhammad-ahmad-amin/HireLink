import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function TopNav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-10">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center flex-shrink-0 cursor-pointer">
              <h1 className="text-2xl font-extrabold text-emerald-600 tracking-tight hover:text-emerald-700 transition-colors">
                HireLink
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link 
                to={user?.userType === 'client' ? '/browse-jobs' : '/browse-jobs'} 
                className={`text-sm font-semibold transition-colors ${isActive('/browse-jobs') ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {user?.userType === 'client' ? 'Find Talent' : 'Find Work'}
              </Link>
              <Link 
                to="/my-jobs" 
                className={`text-sm font-semibold transition-colors ${isActive('/my-jobs') ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                My Jobs
              </Link>
              {user?.userType === 'client' && (
                <Link 
                  to="/post-job" 
                  className={`text-sm font-semibold transition-colors ${isActive('/post-job') ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Post a Job
                </Link>
              )}
              {user?.userType === 'freelancer' && (
                <Link 
                  to="/my-applications" 
                  className={`text-sm font-semibold transition-colors ${isActive('/my-applications') ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  My Proposals
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-5 py-2.5 border border-gray-100 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-3 w-56 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Profile Dropdown / Actions */}
            <div className="flex items-center space-x-3 border-l border-gray-100 pl-6 ml-2">
              <Link
                to="/free-profile"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer font-bold text-sm border border-emerald-100"
                title="Profile"
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2.5 rounded-full hover:bg-red-50"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
