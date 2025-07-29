import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#3C493F] text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-2">
            <Link to="/blog" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <img 
                  src={logo} 
                  alt="Healthy Food Logo" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xl font-bold">HEALTHY FOOD</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/blog" className={`hover:text-yellow-300 ${isActive('/blog') ? 'text-yellow-300 font-medium' : 'text-white'}`}>Blog</Link>
            <Link to="/body-index" className={`hover:text-yellow-300 ${isActive('/body-index') ? 'text-yellow-300 font-medium' : 'text-white'}`}>Chỉ số cơ thể</Link>
            <Link to="/calories" className={`hover:text-yellow-300 ${isActive('/calories') ? 'text-yellow-300 font-medium' : 'text-white'}`}>Chỉ số calo</Link>
            <Link to="/calculator" className={`hover:text-yellow-300 ${isActive('/calculator') ? 'text-yellow-300 font-medium' : 'text-white'}`}>Tính toán calo</Link>
            <Link to="/dashboard" className={`hover:text-yellow-300 ${isActive('/dashboard') ? 'text-yellow-300 font-medium' : 'text-white'}`}>Dashboard</Link>
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Avatar Dropdown */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 hover:text-yellow-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{user?.fullName || 'User'}</span>
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
                <div className="py-1">
                  <Link to="/account" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Tài khoản của tôi
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden bg-[#3C493F] text-white px-4 overflow-hidden transition-all duration-300 ease-in-out 
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
      >
        <div className="py-2 space-y-2">
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block">Blog</Link>
          <Link to="/body-index" onClick={() => setIsMobileMenuOpen(false)} className="block">Chỉ số cơ thể</Link>
          <Link to="/calories" onClick={() => setIsMobileMenuOpen(false)} className="block">Chỉ số calo</Link>
          <Link to="/calculator" onClick={() => setIsMobileMenuOpen(false)} className="block">Tính toán calo</Link>
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block">Dashboard</Link>
          <div className="border-t border-gray-500 my-2"></div>
          <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="block">Tài khoản của tôi</Link>
          <button onClick={handleLogout} className="block text-left text-red-400 w-full">Đăng xuất</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
