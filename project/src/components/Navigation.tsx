import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, Calendar, Heart, Settings, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!profile) return '/login';
    
    switch (profile.role) {
      case 'student':
        return '/dashboard/student';
      case 'faculty':
        return '/dashboard/faculty';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/login';
    }
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-white/70 rounded-b-2xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#f14621]">VidyalankarEvents</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#f14621] transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-[#f14621] transition-colors">Features</Link>
            <Link to="/about" className="text-gray-600 hover:text-[#f14621] transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-[#f14621] transition-colors">Contact</Link>
            <Link to="/events" className="text-gray-600 hover:text-[#f14621] transition-colors">Events</Link>
            
            {/* Profile Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f14621] flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700">{profile?.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="bg-[#f14621] text-white px-4 py-2 rounded-xl hover:bg-[#d13d1b] transition-colors"
                >
                  Sign In
                </Link>
              )}
              
              {/* Dropdown Menu */}
              {isProfileMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                  
                  <Link 
                    to={getDashboardLink()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/events/registered"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    My Events
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu (hidden by default) */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">Home</Link>
          <Link to="/features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">Features</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">About</Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">Contact</Link>
          <Link to="/events" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">Events</Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#f14621] flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{profile?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{profile?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">Dashboard</Link>
                <Link to="/events/registered" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#f14621] hover:bg-gray-50">My Events</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">Sign Out</button>
              </div>
            </>
          ) : (
            <div className="px-5">
              <Link to="/login" className="block w-full text-center px-4 py-2 bg-[#f14621] text-white rounded-md">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}