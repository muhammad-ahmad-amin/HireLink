import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-upwork-dark text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-black mb-4 tracking-tighter">HireLink.</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting top freelance talent with amazing projects worldwide. Build your dream team today.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-gray-300">For Clients</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/post-job" className="hover:text-upwork-green transition-colors">Post a Job</Link></li>
            <li><Link to="/dashboard" className="hover:text-upwork-green transition-colors">Client Dashboard</Link></li>
            <li><Link to="#" className="hover:text-upwork-green transition-colors">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-gray-300">For Freelancers</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/browse-jobs" className="hover:text-upwork-green transition-colors">Find Work</Link></li>
            <li><Link to="/free-profile" className="hover:text-upwork-green transition-colors">My Profile</Link></li>
            <li><Link to="#" className="hover:text-upwork-green transition-colors">Success Stories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-gray-300">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-upwork-green transition-colors">Help Center</Link></li>
            <li><Link to="#" className="hover:text-upwork-green transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-upwork-green transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} HireLink. All rights reserved.
      </div>
    </footer>
  );
}
