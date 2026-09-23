import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { progress } = useProgress();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/technical-hub?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left: Mobile Drawer Button & Search Bar */}
        <div className="navbar-left">
          <button
            type="button"
            className="hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            title="Open Sidebar Navigation"
          >
            <span className="hamburger-icon">☰</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="navbar-search-form">
            <span className="navbar-search-icon">🔍</span>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search curricula, algorithms, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right: Streak & Profile / Authentication */}
        <div className="navbar-right">
          <div className="streak-pill" title="Daily Learning Streak">
            <span>🔥</span>
            <span className="streak-count">{progress?.streak || 7} Days</span>
          </div>

          {isAuthenticated ? (
            <div
              className="user-profile-menu"
              ref={dropdownRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="User Profile Menu"
            >
              <div className="user-avatar-circle">{initialLetter}</div>
              <span className="user-name-snippet">{user?.name || 'Student'}</span>
              <span className="dropdown-arrow">▼</span>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-header-name">{user?.name}</div>
                    <div className="dropdown-header-email">{user?.email}</div>
                    {user?.branch && (
                      <div className="dropdown-header-tag">
                        {user.branch} • Year {user.year || 3}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <Link
                    to="/progress"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>📈</span> Analytics & Badges
                  </Link>
                  <Link
                    to="/projects"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>🚀</span> Manage Projects
                  </Link>
                  <Link
                    to="/community"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>💬</span> Community
                  </Link>

                  <hr className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="btn-secondary nav-btn-compact">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary nav-btn-compact">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
