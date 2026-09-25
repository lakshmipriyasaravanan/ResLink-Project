import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, LogOut, BookOpen, Layers, Bell, Check, X, Clock, Send, Users } from 'lucide-react';
import Modal from './Modal';
import { collaborationRequestAPI } from '../services/api';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('RECEIVED'); // 'RECEIVED' | 'SENT'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const res = await collaborationRequestAPI.getRequests();
      setRequests(res.data || []);
    } catch (e) {
      console.error('Failed to fetch collaboration requests', e);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const incomingRequests = requests.filter(
    (r) => (r.receiver_id === user?.id || (r.receiver_name && user?.name && r.receiver_name.toLowerCase() === user.name.toLowerCase())) && r.status === 'Pending'
  );

  const sentRequests = requests.filter(
    (r) => r.sender_id === user?.id || (r.sender_name && user?.name && r.sender_name.toLowerCase() === user.name.toLowerCase())
  );

  const handleRespond = async (requestId, action) => {
    setActionLoading(true);
    try {
      await collaborationRequestAPI.respondToRequest(requestId, action);
      await fetchRequests();
      if (action === 'accept') {
        // Reload page or trigger re-render
        window.dispatchEvent(new Event('reslink_team_updated'));
      }
    } catch (err) {
      console.error('Failed to respond to request', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    setActionLoading(true);
    try {
      await collaborationRequestAPI.cancelRequest(requestId);
      await fetchRequests();
      window.dispatchEvent(new Event('reslink_team_updated'));
    } catch (err) {
      console.error('Failed to cancel request', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to={user ? "/projects" : "/login"} className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  Res<span className="text-brand-600">Link</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 -mt-1">
                  AI Research Platform
                </span>
              </div>
            </Link>
          </div>

          {/* User Section & Quick Role Badge */}
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
                <Layers className="h-4 w-4 text-brand-600" />
                <span className="text-xs font-semibold text-brand-800">{user.role}</span>
                <span className="text-xs text-brand-400">•</span>
                <span className="text-xs text-slate-600 font-medium">{user.affiliation}</span>
              </div>

              {/* Collaboration Requests Notification Bell */}
              <button
                onClick={() => setIsRequestsModalOpen(true)}
                className="relative p-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all"
                title="Collaboration Invitations & Requests"
              >
                <Bell className="h-5 w-5" />
                {incomingRequests.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {incomingRequests.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  title="View Profile"
                >
                  <div className="h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-brand-100">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-brand-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Requests Modal */}
      <Modal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        title="Collaboration Invitations & Requests"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('RECEIVED')}
              className={`pb-3 px-4 text-xs font-bold transition-colors relative ${
                activeTab === 'RECEIVED'
                  ? 'text-brand-700 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Received Invitations</span>
              {incomingRequests.length > 0 && (
                <span className="ml-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('SENT')}
              className={`pb-3 px-4 text-xs font-bold transition-colors relative ${
                activeTab === 'SENT'
                  ? 'text-brand-700 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Sent Invitations ({sentRequests.length})</span>
            </button>
          </div>

          {/* Tab 1: Received Invitations */}
          {activeTab === 'RECEIVED' && (
            <div className="space-y-3">
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Bell className="h-8 w-8 mx-auto text-slate-300" />
                  <p className="text-xs">No pending collaboration invitations at this time.</p>
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{req.project_title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Invited by <span className="font-semibold text-slate-700">{req.sender_name}</span> as{' '}
                          <span className="font-semibold text-brand-700">{req.role}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleRespond(req.id, 'decline')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'accept')}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Accept Invitation</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Sent Requests */}
          {activeTab === 'SENT' && (
            <div className="space-y-3">
              {sentRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Send className="h-8 w-8 mx-auto text-slate-300" />
                  <p className="text-xs">No invitations sent yet.</p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{req.receiver_name}</div>
                      <div className="text-[11px] text-slate-500">
                        Project: {req.project_title} • Role: {req.role}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'Declined'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          disabled={actionLoading}
                          className="text-[10px] text-rose-600 hover:underline font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
};

export default Navbar;
