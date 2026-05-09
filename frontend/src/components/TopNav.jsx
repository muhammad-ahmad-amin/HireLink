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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-10">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-upwork-green flex items-center justify-center font-black text-white text-xl shadow-sm group-hover:rotate-6 transition-transform">
                H
              </div>
              <h1 className="text-xl font-black tracking-tighter text-upwork-dark">
                Hire<span className="text-upwork-green">Link</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/browse-jobs" 
                className={`text-sm font-bold tracking-tight transition-colors ${isActive('/browse-jobs') ? 'text-upwork-green' : 'text-gray-500 hover:text-upwork-dark'}`}
              >
                {user?.userType === 'client' ? 'Find Talent' : 'Find Work'}
              </Link>
              <Link 
                to="/my-jobs" 
                className={`text-sm font-bold tracking-tight transition-colors ${isActive('/my-jobs') ? 'text-upwork-green' : 'text-gray-500 hover:text-upwork-dark'}`}
              >
                My Jobs
              </Link>
              {user?.userType === 'client' && (
                <Link 
                  to="/post-job" 
                  className={`text-sm font-bold tracking-tight transition-colors ${isActive('/post-job') ? 'text-upwork-green' : 'text-gray-500 hover:text-upwork-dark'}`}
                >
                  Post Job
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-upwork-green focus-within:bg-white transition-all w-64 group">
              <svg className="w-4 h-4 text-gray-400 group-focus-within:text-upwork-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-2 w-full text-upwork-dark placeholder-gray-400 font-medium"
              />
            </div>

            {/* Profile & Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/free-profile"
                className="w-9 h-9 rounded-full bg-upwork-light border border-upwork-green/20 flex items-center justify-center font-bold text-upwork-green text-sm hover:bg-upwork-green hover:text-white transition-all"
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
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
