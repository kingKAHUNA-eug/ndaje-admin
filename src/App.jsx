import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import axios from 'axios'
import {
  ChartBarIcon, UsersIcon, TruckIcon, Cog6ToothIcon, PlusIcon,
  MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon,
  LockClosedIcon, LockOpenIcon, ClipboardDocumentListIcon,
  ShoppingCartIcon, CurrencyDollarIcon, UserGroupIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowTrendingUpIcon,
  ClockIcon, CheckCircleIcon, ArrowRightOnRectangleIcon,
  CubeIcon, BuildingStorefrontIcon, DocumentTextIcon,
  BellIcon, XMarkIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/outline'

<div className="mb-8">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-800 rounded-full flex items-center justify-center shadow-2xl">
      <span className="text-white text-2xl font-black">N</span>
    </div>
    <div>
      <h1 className="text-4xl font-bold text-green-400 tracking-widest">NDAJE</h1>
      <p className="text-sm text-gray-400 tracking-wider">SUPPLY CHAIN SYSTEM</p>
    </div>
  </div>
</div>

// FIXED API BASE
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
      .replace(/\/+$/, '')
      .replace(/\/api\/api/, '/api')
      .replace(/\/\/auth/, '/auth')
  : 'http://localhost:10000/api';

  // ==============================
// ENHANCED DARK MODE THEME
// ==============================
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--primary-color', '#1e40af');
      document.documentElement.style.setProperty('--secondary-color', '#3b82f6');
      document.documentElement.style.setProperty('--bg-primary', '#0f172a');
      document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--secondary-color');
      document.documentElement.style.removeProperty('--bg-primary');
      document.documentElement.style.removeProperty('--bg-secondary');
      document.documentElement.style.removeProperty('--text-primary');
      document.documentElement.style.removeProperty('--text-secondary');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

// Enhanced Toast Notification Component
const EnhancedToast = ({ toast, onClose }) => {
  if (!toast) return null;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [toast, onClose]);
  
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'error': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'info': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      default: return 'bg-gray-800';
    }
  };
  
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${getBgColor()} text-white rounded-2xl shadow-2xl overflow-hidden min-w-[300px] transform transition-all duration-300`}>
        <div className="flex items-start p-5">
          <div className="flex-shrink-0 mr-4">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{toast.title || 'Notification'}</h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 hover:bg-white/20 p-1 rounded-full transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-1 bg-white/30">
          <div className="h-full bg-white/50 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};


// Password Reset Modal Component
const PasswordResetModal = ({ isOpen, onClose, userId, userName, userEmail, onReset }) => {
  const [passwordType, setPasswordType] = useState('auto');
  const [manualPassword, setManualPassword] = useState('');
  const [autoGenerated, setAutoGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAutoGenerated(password);
    return password;
  };
  
  useEffect(() => {
    if (isOpen && passwordType === 'auto') {
      generatePassword();
    }
  }, [isOpen, passwordType]);
  
  const handleReset = async () => {
    setLoading(true);
    try {
      const password = passwordType === 'auto' ? autoGenerated : manualPassword;
      const success = await onReset(userId, password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-gray-600 mt-1">For {userName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset!</h3>
              <p className="text-gray-600">New password has been set successfully.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Password Generation Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPasswordType('auto')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${passwordType === 'auto' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Auto Generate</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPasswordType('manual')}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${passwordType === 'manual' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="font-medium">Manual</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {passwordType === 'auto' ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={autoGenerated}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-lg pr-12"
                    />
                    <button
                      onClick={generatePassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                      title="Generate new password"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This password will be automatically sent to the user's email
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter New Password
                  </label>
                  <input
                    type="text"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Enter custom password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                   Minimum 6 characters required
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading || (passwordType === 'manual' && manualPassword.length < 6)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Confirm Modal Component
const ConfirmModal = ({ confirmModal, setConfirmModal }) => {
  if (!confirmModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
            {confirmModal.title}
          </h3>
          <p className="text-gray-600 text-center mb-8">
            {confirmModal.message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmModal(null)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal(null);
              }}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Quotes Panel Component
function AdminQuotesPanel() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuotes();
  }, [filters]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await axios.get(`${API_BASE}/admin/quotes?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuotes(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE}/admin/quotes/${quoteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setQuotes(prev => prev.filter(q => q.id !== quoteId));
        
        alert('Quote deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        alert(err.response?.data?.message || 'Failed to delete quote');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Quote Management</h2>
        <button onClick={fetchQuotes} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Refresh
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="PENDING_ITEMS">Pending Items</option>
            <option value="PENDING_PRICING">Pending Pricing</option>
            <option value="IN_PRICING">In Pricing</option>
            <option value="AWAITING_CLIENT_APPROVAL">Awaiting Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CONVERTED_TO_ORDER">Converted to Order</option>
          </select>
          
          <input
            type="text"
            placeholder="Search by client or ID..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          />
          
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="Start Date"
          />
          
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No quotes found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-900">#{quote.id?.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{quote.client?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{quote.client?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'PENDING_PRICING' ? 'bg-yellow-100 text-yellow-800' :
                        quote.status === 'IN_PRICING' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'AWAITING_CLIENT_APPROVAL' ? 'bg-purple-100 text-purple-800' :
                        quote.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {quote.totalAmount ? (
                        <span className="font-bold">RWF {quote.totalAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-500">Not priced</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`${window.location.origin}/quotes/${quote.id}`, '_blank')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          title="View Quote"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          title="Delete Quote"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Admin Manager Panel Component
function AdminManagerPanel({ deleteUser, resetUserPassword }) {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddManager, setShowAddManager] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', email: '', phone: '', password: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch managers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createManager = async () => {
    try {
      await axios.post(`${API_BASE}/admin/managers`, newManager, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddManager(false);
      setNewManager({ name: '', email: '', phone: '', password: '' });
      fetchManagers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create manager');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Operations Managers</h2>
        <button onClick={() => setShowAddManager(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
          <PlusIcon className="w-5 h-5" /> Add Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(manager => (
          <div key={manager.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{manager.name}</h3>
                <p className="text-sm text-gray-500">{manager.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{manager.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                <span>Active Quotes: {manager.activeQuotes || 0}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => resetUserPassword(manager.id, manager.name, manager.email)}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Reset Password
              </button>
              <button
                onClick={() => deleteUser(manager.id, manager.name, 'manager')}
                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Manager</h3>
            <div className="space-y-4">
              <input placeholder="Name" value={newManager.name} onChange={e => setNewManager(prev => ({...prev, name: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input placeholder="Email" value={newManager.email} onChange={e => setNewManager(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input placeholder="Phone" value={newManager.phone} onChange={e => setNewManager(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input type="password" placeholder="Password" value={newManager.password} onChange={e => setNewManager(prev => ({...prev, password: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddManager(false)} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>
              <button onClick={createManager} className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Driver Panel Component
function AdminDriverPanel({ deleteUser, resetUserPassword }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', password: '', vehicle: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/drivers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async () => {
    try {
      await axios.post(`${API_BASE}/admin/drivers`, newDriver, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddDriver(false);
      setNewDriver({ name: '', email: '', phone: '', password: '', vehicle: '' });
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create driver');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Delivery Drivers</h2>
        <button onClick={() => setShowAddDriver(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
          <PlusIcon className="w-5 h-5" /> Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                <p className="text-sm text-gray-500">{driver.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TruckIcon className="w-4 h-4 mr-2" />
                <span>{driver.vehicle || 'No vehicle assigned'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                <span>Deliveries: {driver.completedDeliveries || 0}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => resetUserPassword(driver.id, driver.name, driver.email)}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Reset Password
              </button>
              <button
                onClick={() => deleteUser(driver.id, driver.name, 'driver')}
                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Driver</h3>
            <div className="space-y-4">
              <input placeholder="Name" value={newDriver.name} onChange={e => setNewDriver(prev => ({...prev, name: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input placeholder="Email" value={newDriver.email} onChange={e => setNewDriver(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input placeholder="Phone" value={newDriver.phone} onChange={e => setNewDriver(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input type="password" placeholder="Password" value={newDriver.password} onChange={e => setNewDriver(prev => ({...prev, password: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              <input placeholder="Vehicle" value={newDriver.vehicle} onChange={e => setNewDriver(prev => ({...prev, vehicle: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddDriver(false)} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>
              <button onClick={createDriver} className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Orders Panel Component
function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'ALL' 
        ? `${API_BASE}/admin/orders`
        : `${API_BASE}/admin/orders?status=${statusFilter}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(search.toLowerCase()) ||
    order.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Order Management</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-blue-900">#{order.id?.slice(-8)}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.client?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{order.client?.phone || ''}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold">RWF {order.totalAmount?.toLocaleString() || 0}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{order.deliveryAddress || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Manager Orders Panel Component
function ManagerOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/manager/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch manager orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">My Priced Orders</h2>
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Order #{order.id?.slice(-8)}</h3>
                <p className="text-gray-600">Client: {order.client?.name || 'Unknown'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-blue-900">RWF {order.totalAmount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="text-lg font-medium">{order.items?.length || 0} items</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Created: {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Driver History Panel Component
function DriverHistoryPanel() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/deliveries/driver/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Delivery History</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From → To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveries.map(delivery => (
              <tr key={delivery.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium">{delivery.deliveryNumber || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{delivery.client?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{delivery.client?.phone || ''}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium">{delivery.pickupAddress}</p>
                    <p className="text-gray-500">→ {delivery.deliveryAddress}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold">${delivery.deliveryFee?.toFixed(2) || '0.00'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    delivery.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(delivery.deliveredAt || delivery.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalManagers: 0,
    totalDrivers: 0,
    totalQuotes: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data || stats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-2xl font-bold text-blue-900">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your supply chain management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Managers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalManagers || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDrivers || 0}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <TruckIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Quotes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalQuotes || 0}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">RWF {(stats.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to NDAJE Supply Chain System</h2>
        <p className="text-blue-100">Manage your entire supply chain operation from this dashboard</p>
      </div>
    </div>
  );
}

// Settings Panel Component
function SettingsPanel({ darkMode, setDarkMode }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    autoRefresh: true,
    language: 'en'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">System Settings</h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl mb-4">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
          </div>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              localStorage.setItem('darkMode', !darkMode);
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full transform transition ${darkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'notifications', label: 'Push Notifications', description: 'Receive real-time updates' },
            { key: 'emailUpdates', label: 'Email Updates', description: 'Get daily summary emails' },
            { key: 'autoRefresh', label: 'Auto Refresh', description: 'Automatically refresh data every 30 seconds' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform transition ${settings[item.key] ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Language & Region</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
          Save Settings
        </button>
      </div>
    </div>
  );
}

// Update ProtectedDashboard to use the new AdminDashboard
function ProtectedDashboard({ deleteUser, resetUserPassword, darkMode, setDarkMode }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Routes>
        {/* Admin Routes */}
        {user.role === 'ADMIN' && (
          <>
            <Route path="/overview" element={<AdminDashboard deleteUser={deleteUser} resetUserPassword={resetUserPassword} darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/products" element={<ProductsPanel />} />
            <Route path="/managers" element={<AdminManagerPanel deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
            <Route path="/drivers" element={<AdminDriverPanel deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
            <Route path="/quotes" element={<AdminQuotesPanel />} />
            <Route path="/orders" element={<AdminOrdersPanel />} />
            <Route path="/settings" element={<SettingsPanel darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/" element={<Navigate to="/dashboard/overview" />} />
          </>
        )}

        {/* Manager Routes */}
        {user.role === 'MANAGER' && (
          <>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/my-orders" element={<ManagerOrdersPanel />} />
            <Route path="/" element={<Navigate to="/dashboard/manager" />} />
          </>
        )}

        {/* Driver Routes */}
        {user.role === 'DELIVERY_AGENT' && (
          <>
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/delivery-history" element={<DriverHistoryPanel />} />
            <Route path="/" element={<Navigate to="/dashboard/driver" />} />
          </>
        )}

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </DashboardLayout>
  );
}

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPassword, setShowPassword] = useState(false)


  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { 
        email: username,
        password 
      });
      const userData = res.data.data?.user || res.data.user;
      const token = res.data.data?.token || res.data.token;

      if (res.data.success && ['ADMIN', 'MANAGER', 'DELIVERY_AGENT'].includes(userData.role)) {
        localStorage.setItem('token', token);
        
        // CRITICAL: For managers, ensure we have the correct MongoDB _id
        if (userData.role === 'MANAGER') {
          if (!userData._id || userData._id.length !== 24) {
            try {
              const managerRes = await axios.get(`${API_BASE}/managers/me`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (managerRes.data.data?._id) {
                userData._id = managerRes.data.data._id;
              }
            } catch (fetchErr) {
              console.warn('Could not fetch manager details:', fetchErr);
            }
          }
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
      } else {
        setError('Access denied. Staff access only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Format time as HH:MM:SS AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).toUpperCase();
  };

  // Format date as Day, Month Date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // User profile data (mock for display)
  const userProfile = {
    name: "kahuna",
    role: "System Administrator",
    avatar: " K"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-6xl h-[600px] bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex">
        
        {/* Left Side: Clock, Logo, and User Profile */}
        <div className="w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col relative overflow-hidden">
          {/* CRT scan lines effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-20 pointer-events-none scanline"></div>
          
          {/* Logo at top - SIMPLIFIED */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-800 rounded-full flex items-center justify-center shadow-2xl">
  <span className="text-white text-2xl font-black">N</span>
</div>
              <div>
                <h1 className="text-4xl font-bold text-green-400 tracking-widest">NDAJE</h1>
                <p className="text-sm text-gray-400 tracking-wider">SUPPLY CHAIN SYSTEM</p>
              </div>
            </div>
          </div>

          {/* Clock Display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 font-digital mb-2 tracking-wider">
                {formatTime(currentTime)}
              </div>
              <div className="text-2xl text-gray-300 tracking-wider">
                {formatDate(currentTime)}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-12 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">SYSTEM ONLINE</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <div className="text-xs text-gray-500">
                v2.5.1 • 2024
              </div>
            </div>
          </div>

          {/* User Profile at Bottom Left */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{userProfile.avatar}</span>
              </div>
              <div>
                <p className="text-white font-medium">{userProfile.name}</p>
                <p className="text-sm text-gray-400">{userProfile.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 bg-gray-800 p-8 flex flex-col justify-center border-l border-gray-700">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-gray-300 mb-3 tracking-wider">
                ENTER CREDENTIALS TO VIEW SUMMARY
              </h2>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-green-500 rounded-full"></div>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <div className="flex items-center mb-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Username *
                  </label>
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-500 transition font-mono tracking-wider text-lg"
                    placeholder="STAFF_USERNAME"
                    autoComplete="username"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-500 transition font-mono tracking-wider text-lg pr-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border-2 border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono tracking-wider">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-60 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest font-mono border-2 border-green-800 relative overflow-hidden group"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>VIEW SUMMARY</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-700">
              <p className="text-center text-xs text-gray-500 font-mono tracking-wider">
                NDAJE SUPPLY CHAIN MANAGEMENT SYSTEM
                <br />
                © 2024 NDAJE SYSTEMS • ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function DashboardLayout({ children, darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  const menuItems = user?.role === 'ADMIN' ? [
    { name: 'Overview', path: '/dashboard/overview', icon: ChartBarIcon },
    { name: 'Products', path: '/dashboard/products', icon: CubeIcon },
    { name: 'Managers', path: '/dashboard/managers', icon: UsersIcon },
    { name: 'Drivers', path: '/dashboard/drivers', icon: TruckIcon },
    { name: 'Quotes', path: '/dashboard/quotes', icon: DocumentTextIcon },
    { name: 'Orders', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon }
  ] : user?.role === 'MANAGER' ? [
    { name: 'Pricing Dashboard', path: '/dashboard/manager', icon: CurrencyDollarIcon },
    { name: 'My Orders', path: '/dashboard/my-orders', icon: CheckCircleIcon }
  ] : user?.role === 'DELIVERY_AGENT' ? [
    { name: 'My Deliveries', path: '/dashboard/driver', icon: TruckIcon },
    { name: 'Delivery History', path: '/dashboard/delivery-history', icon: ClipboardDocumentListIcon }
  ] : [];

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex ${darkMode ? 'dark' : ''}`}>
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-black">N</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-blue-900">NDAJE</h1>
                <p className="text-xs text-gray-600">{user?.role} Portal</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const active = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">Menu</button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <BellIcon className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'Staff'} • <span className="text-blue-900 font-bold">{user?.role}</span>
            </span>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}


// ==============================
// FIXED: Products Panel Component
// ==============================
function ProductsPanel() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const token = localStorage.getItem('token')
  const [form, setForm] = useState({
    name: '', sku: '', price: '', icon: 'cube', image: '', reference: '', description: '', category: '', active: true
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    console.log('📦 Fetching products...')
    try {
      const res = await axios.get(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('✅ Products fetched:', res.data.data?.length || 0)
      setProducts(res.data.data || [])
    } catch (err) {
      console.error('❌ Failed to fetch products:', err)
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    console.log('🚀 Submitting product form...')
    console.log('📝 Form data:', form)
    
    // Validation
    if (!form.name || !form.sku || !form.price) {
      setToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Name, SKU and Price are required!'
      })
      return
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Price must be a valid number greater than 0!'
      })
      return
    }
    
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        icon: form.icon.trim() || "cube",
        image: form.image.trim() || null,
        reference: form.reference.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        active: true
      }

      console.log('📤 Payload to send:', payload)

      let response;
      if (editing) {
        console.log('✏️ Updating product:', editing.id)
        response = await axios.put(`${API_BASE}/products/${editing.id}`, payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('✅ Product updated:', response.data)
      } else {
        console.log('🆕 Creating new product')
        response = await axios.post(`${API_BASE}/products`, payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('✅ Product created:', response.data)
      }

      setShowAdd(false)
      setEditing(null)
      setForm({ name: '', sku: '', price: '', icon: 'cube', image: '', reference: '', description: '', category: '', active: true })
      fetchProducts()
      
      setToast({
        type: 'success',
        title: 'Success!',
        message: editing ? 'Product updated successfully!' : 'Product created successfully!'
      })
    } catch (err) {
      console.error('❌ Product submission failed:', err)
      console.error('🔍 Error details:', err.response?.data)
      
      let errorMessage = "Failed to save product"
      if (err.response?.status === 409) {
        errorMessage = "Product with this SKU already exists!"
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid product data. Please check all fields."
      } else if (err.response?.status === 401) {
        errorMessage = "Session expired. Please login again."
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      setToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    console.log('🗑️ Deleting product:', id)
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('✅ Product deleted')
      fetchProducts()
      setToast({
        type: 'success',
        title: 'Success',
        message: 'Product deleted successfully!'
      })
    } catch (err) {
      console.error('❌ Delete failed:', err)
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product'
      })
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    try {
      setForm(f => ({ ...f, image: 'uploading' }));
      
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(
        `${API_BASE}/admin/upload/product-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success && res.data.data?.url) {
        setForm(f => ({ ...f, image: res.data.data.url }));
        setToast({
          type: 'success',
          title: 'Success',
          message: 'Image uploaded successfully!'
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err);
      setForm(f => ({ ...f, image: '' }));
      setToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.response?.data?.message || 'Failed to upload image. Try again.'
      });
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">Loading Products...</div>
    </div>
  )

  return (
    <div className="space-y-8">
      <EnhancedToast toast={toast} onClose={() => setToast(null)} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white">Product Catalog</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-bold transition transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
              {p.image ? (
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-4xl">${p.icon || '📦'}</div>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">{p.icon || '📦'}</div>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  p.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {p.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{p.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">SKU: {p.sku || '—'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ref: {p.reference || '—'}</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-3">RWF {Number(p.price).toLocaleString()}</p>
              {p.category && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
                  {p.category}
                </span>
              )}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => { setEditing(p); setForm(p); setShowAdd(true) }} 
                  className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <PencilSquareIcon className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="flex-1 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
            <CubeIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first product</p>
          <button 
            onClick={() => setShowAdd(true)} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium"
          >
            Add First Product
          </button>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? 'Edit' : 'Add'} Product</h2>
              <button
                onClick={() => { setShowAdd(false); setEditing(null); setForm({name:'',sku:'',price:'',icon:'cube',image:'',reference:'',description:'',category:'',active:true}) }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={e => setForm(f => ({...f, sku: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter unique SKU"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (RWF) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm(f => ({...f, price: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select category</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Food">Food</option>
                  <option value="Cleaning Supplies">Cleaning Supplies</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reference Code
                </label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={e => setForm(f => ({...f, reference: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Internal reference code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <select
                  value={form.icon}
                  onChange={e => setForm(f => ({...f, icon: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="cube">📦 Cube</option>
                  <option value="beer">🍺 Beer</option>
                  <option value="wine">🍷 Wine</option>
                  <option value="coffee">☕ Coffee</option>
                  <option value="food">🍕 Food</option>
                  <option value="cleaning">🧼 Cleaning</option>
                  <option value="towel">🧺 Towel</option>
                  <option value="electronic">🔌 Electronic</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({...f, description: e.target.value}))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter product description"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image
              </label>
              
              {form.image === 'uploading' ? (
                <div className="w-full h-64 border-2 border-dashed border-blue-500 rounded-2xl flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full animate-pulse mb-4">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-blue-900 dark:text-blue-300">Uploading...</p>
                </div>
              ) : form.image ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="w-full h-64 object-cover bg-gray-100 dark:bg-gray-800"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" font-family="Arial" font-size="20" text-anchor="middle" fill="%236b7280">Image failed to load</text></svg>';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, image: '' }))}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Image uploaded successfully</span>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return;
                      handleImageUpload(file);
                    }}
                  />
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-300 mb-2">Upload product image</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              )}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => { 
                  setShowAdd(false); 
                  setEditing(null); 
                  setForm({name:'',sku:'',price:'',icon:'cube',image:'',reference:'',description:'',category:'',active:true}) 
                }} 
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-bold transition"
              >
                {editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// Fixed Manager Dashboard Component - Replace your existing ManagerDashboard

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [quotes, setQuotes] = useState([]);
  const [availableQuotes, setAvailableQuotes] = useState([]);
  const [lockedQuotes, setLockedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pricing, setPricing] = useState({});
  const [sourcingNotes, setSourcingNotes] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    completed: 0,
    totalRevenue: 0
  });

  const [toast, setToast] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [quoteToLock, setQuoteToLock] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Helper function to compare IDs (handles different formats)
  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    
    // Convert to string and trim
    const str1 = String(id1).trim().toLowerCase();
    const str2 = String(id2).trim().toLowerCase();
    
    // Direct comparison
    if (str1 === str2) return true;
    
    // Check if one is contained within the other (for compound IDs)
    if (str1.includes(str2) || str2.includes(str1)) return true;
    
    // Check if they're the same MongoDB ObjectId in different formats
    const cleanStr1 = str1.replace('objectid("', '').replace('")', '');
    const cleanStr2 = str2.replace('objectid("', '').replace('")', '');
    
    return cleanStr1 === cleanStr2;
  };
    
  const debugUserIds = () => {
    console.log('🔍 DEBUG USER IDs:');
    console.log('User object:', user);
    console.log('User.id:', user.id);
    console.log('User._id:', user._id);
    
    if (user.id && user.id.startsWith('mgr_')) {
      const parts = user.id.split('_');
      console.log('Split parts:', parts);
      console.log('Extracted MongoDB _id:', parts.length >= 3 ? parts[2] : 'N/A');
    }
    
    if (user._id && user._id.startsWith('mgr_')) {
      const parts = user._id.split('_');
      console.log('Split parts from _id:', parts);
      console.log('Extracted MongoDB _id from _id:', parts.length >= 3 ? parts[2] : 'N/A');
    }
  };

  useEffect(() => {
    console.log('🔐 SECURITY: Manager session initialized');
    console.log('User:', {
      id: user.id,
      _id: user._id,
      _id_type: typeof user._id,
      _id_length: user._id?.length,
      name: user.name,
      role: user.role
    });
    
    // Log all quotes with lock info
    quotes.forEach((q, i) => {
      console.log(`Quote ${i}:`, {
        id: q.id,
        status: q.status,
        lockedById: q.lockedById,
        lockedById_length: q.lockedById?.length,
        lockExpiresAt: q.lockExpiresAt,
        canPrice: canPriceQuote(q)
      });
    });
  }, [quotes, user]);

  // Call this in useEffect or add a debug button
  useEffect(() => {
    debugUserIds();
  }, [user]);

  const fetchManagerId = async () => {
    try {
      console.log('🔍 Fetching manager MongoDB _id...');
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const stringId = currentUser.id || currentUser._id;
      
      if (stringId && stringId.startsWith('mgr_')) {
        const parts = stringId.split('_');
        if (parts.length >= 3) {
          const mongoId = parts[parts.length - 1];
          console.log('✅ Extracted MongoDB _id from string id:', mongoId);
          
          const updatedUser = {
            ...currentUser,
            _id: mongoId,
            mongoId: mongoId,
            managerMongoId: mongoId
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('✅ Updated user in localStorage');
          
          return mongoId;
        }
      }
      
      console.log('⚠️ Could not extract MongoDB _id from string id format');
      return null;
      
    } catch (err) {
      console.error('❌ Failed to fetch manager ID:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchManagerData();
    
    // Also try to fetch manager MongoDB _id
    if (user.role === 'MANAGER' && (!user._id || user._id.length !== 24)) {
      fetchManagerId();
    }
  }, []);

  // Debug helper
  useEffect(() => {
    console.log('👤 Current user object:', user);
    console.log('🔑 User MongoDB _id:', user._id);
    console.log('🔑 User string id:', user.id);
  }, [user]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      const [quotesRes, availableRes, lockedRes, approvalRes] = await Promise.all([
        axios.get(`${API_BASE}/quotes/manager/quotes`, { headers }),
        axios.get(`${API_BASE}/quotes/manager/available`, { headers }),
        axios.get(`${API_BASE}/quotes/manager/locked`, { headers }),
        axios.get(`${API_BASE}/quotes/manager/awaiting-approval`, { headers })
      ]);
      
      const allQuotes = quotesRes.data.data || [];
      const available = availableRes.data.data || [];
      const locked = lockedRes.data.data || [];
      const awaitingApproval = approvalRes.data.data || [];
      
      console.log('🔍 Manager ID:', user.id);
      console.log('📦 All quotes:', allQuotes.length);
      console.log('🔓 Available:', available.length);
      console.log('🔒 Locked:', locked.length);
      console.log('⏳ Awaiting approval:', awaitingApproval.length);
      
      // Debug locked quotes
      locked.forEach(q => {
        console.log(`Quote ${q.id}: status=${q.status}, lockedById=${q.lockedById}, managerId=${user.id}, match=${q.lockedById === user.id}`);
      });
      
      setQuotes(allQuotes);
      setAvailableQuotes(available);
      setLockedQuotes(locked);
      
      setStats({
        pending: available.length,
        active: locked.length,
        completed: awaitingApproval.length,
        totalRevenue: allQuotes.reduce((sum, q) => sum + (q.totalAmount || 0), 0)
      });
      
    } catch (err) {
      console.error('Failed to fetch manager data:', err);
      setToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to load quotes. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLockQuote = async (quote) => {
    setQuoteToLock(quote);
    setShowLockModal(true);
  };

  const confirmLockQuote = async () => {
    if (!quoteToLock) return;
    
    try {
      const response = await axios.post(`${API_BASE}/quotes/manager/lock`, {
        quoteId: quoteToLock.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToast({
        type: 'success',
        title: 'Quote Locked!',
        message: `You have locked quote #${quoteToLock.id?.slice(-6)}. You now have 30 minutes to price it.`
      });
      
      setShowLockModal(false);
      setQuoteToLock(null);
      
      setTimeout(() => {
        fetchManagerData();
      }, 1000);
      
    } catch (error) {
      console.error('Lock error:', error);
      
      const errorMessage = error.response?.data?.message || 
        error.response?.status === 409 ? 'This quote is already locked by another manager.' :
        'Failed to lock quote. Please try again.';
      
      setToast({
        type: 'error',
        title: 'Lock Failed',
        message: errorMessage
      });
      
      setShowLockModal(false);
      setQuoteToLock(null);
    }
  };

  const handlePriceQuote = async (quote) => {
    console.log('🎯 Opening pricing modal for quote:', quote.id);
    
    // First check if we can price this quote
    if (!canPriceQuote(quote)) {
      console.log('❌ Cannot price this quote - permission denied');
      setToast({
        type: 'error',
        title: 'Cannot Price Quote',
        message: 'This quote is currently locked by another manager or your lock has expired.'
      });
      return;
    }
    
    setSelectedQuote(quote);
    setShowPricingModal(true);
    
    // Initialize pricing data...  
    const initialPricing = {};
    if (quote.items && Array.isArray(quote.items)) {
      quote.items.forEach(item => {
        const productId = item.product?.id || item.productId;
        if (productId) {
          initialPricing[productId] = item.unitPrice || item.product?.price || '';
        }
      });
    }
    setPricing(initialPricing);
    setSourcingNotes(quote.sourcingNotes || '');
  };

  const submitPricing = async () => {
    if (!selectedQuote) return;

    try {
      if (!selectedQuote.items || !Array.isArray(selectedQuote.items)) {
        setToast({
          type: 'error',
          title: 'Error',
          message: 'No items found in quote'
        });
        return;
      }

      const items = selectedQuote.items.map(item => {
        const productId = item.product?.id || item.productId;
        return {
          productId: productId,
          quantity: item.quantity,
          unitPrice: Number(pricing[productId]) || 0
        };
      });

      const missingPrices = items.filter(i => i.unitPrice <= 0);
      if (missingPrices.length > 0) {
        setToast({
          type: 'error',
          title: 'Invalid Pricing',
          message: 'Please set a valid price for all items!'
        });
        return;
      }

      const response = await axios.put(
        `${API_BASE}/quotes/manager/${selectedQuote.id}/update-pricing`,
        {
          items,
          sourcingNotes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setToast({
        type: 'success',
        title: 'Pricing Submitted!',
        message: `Quote #${selectedQuote.id?.slice(-6)} has been sent to client for approval.`
      });

      setShowPricingModal(false);
      setSelectedQuote(null);
      setPricing({});
      setSourcingNotes('');
      
      setTimeout(() => {
        fetchManagerData();
      }, 1000);
      
    } catch (err) {
      console.error('Pricing error:', err);
      
      const errorMessage = err.response?.data?.message || 
        err.response?.status === 403 ? 'Your lock on this quote has expired.' :
        'Failed to submit pricing. Please try again.';
      
      setToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    }
  };

  const handleDeleteQuote = async (quote) => {
    if (!quote || !quote.id) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Invalid quote data'
      });
      return;
    }
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete quote #${quote.id?.slice(-8)}?\n\n` +
      `Client: ${quote.client?.name || 'Unknown'}\n` +
      `Items: ${quote.items?.length || 0}\n` +
      `Status: ${quote.status}\n` +
      `This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      const response = await axios.delete(
        `${API_BASE}/quotes/manager/${quote.id}/delete`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setQuotes(prev => prev.filter(q => q.id !== quote.id));
        setAvailableQuotes(prev => prev.filter(q => q.id !== quote.id));
        setLockedQuotes(prev => prev.filter(q => q.id !== quote.id));
        
        setToast({
          type: 'success',
          title: 'Success!',
          message: `Quote #${quote.id?.slice(-8)} has been deleted.`
        });
      }
      
    } catch (err) {
      console.error('Delete error:', err);
      
      let errorMessage = 'Failed to delete quote. Please try again.';
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check the quote ID.';
            break;
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to delete this quote.';
            break;
          case 404:
            errorMessage = 'Quote not found. It may have been already deleted.';
            fetchManagerData();
            break;
          case 409:
            errorMessage = 'This quote cannot be deleted right now. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
      }
      
      setToast({
        type: 'error',
        title: 'Delete Failed',
        message: errorMessage
      });
    }
  };

  const canDeleteQuote = (quote) => {
    if (!quote || !user.id) return false;
    
    const isLockExpired = quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date();
    
    const canDelete = 
      (quote.lockedById === user.id && quote.status === 'IN_PRICING') ||
      (quote.status === 'PENDING_PRICING' && (!quote.lockedById || isLockExpired)) ||
      (quote.managerId === user.id);
    
    return canDelete;
  };

  const getQuoteStatus = (quote) => {
    // Use the same comparison logic
    const userHasLock = compareIds(user._id, quote.lockedById) || 
                       compareIds(user.id, quote.lockedById);
    
    if (quote.status === 'IN_PRICING') {
      if (userHasLock) {
        return { 
          text: 'You are pricing this',
          color: 'bg-yellow-100 text-yellow-800'
        };
      } else {
        return { 
          text: 'Being priced by another manager',
          color: 'bg-red-100 text-red-800'
        };
      }
    }
    
    if (quote.status === 'PENDING_PRICING') {
      if (quote.lockedById) {
        if (quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date()) {
          return { 
            text: 'Lock expired - Available',
            color: 'bg-green-100 text-green-800'
          };
        }
        return { 
          text: 'Locked by another manager',
          color: 'bg-gray-100 text-gray-800'
        };
      }
      return { 
        text: 'Available for pricing',
        color: 'bg-blue-100 text-blue-800'
      };
    }
    
    if (quote.status === 'AWAITING_CLIENT_APPROVAL') {
      return { 
        text: 'Waiting client approval',
        color: 'bg-purple-100 text-purple-800'
      };
    }
    
    if (quote.status === 'APPROVED') {
      return { 
        text: 'Approved',
        color: 'bg-green-100 text-green-800'
      };
    }
    
    return { 
      text: quote.status?.replace(/_/g, ' ') || 'Unknown',
      color: 'bg-gray-100 text-gray-800'
    };
  };

  const canLockQuote = (quote) => {
    return (
      quote.status === 'PENDING_PRICING' && 
      (!quote.lockedById || 
       (quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date()))
    );
  };


 const canPriceQuote = (quote) => {
  console.log('🔍 Price check:', {
    quoteId: quote.id,
    quoteStatus: quote.status,
    quoteLockedById: quote.lockedById,
    user_id: user._id,
    user_id_length: user._id?.length,
    user_id_type: typeof user._id,
    match: user._id === quote.lockedById
  });
  
  // Basic checks
  if (!quote || !user) return false;
  if (quote.status !== 'IN_PRICING') return false;
  
  // Check lock expiration
  if (quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date()) {
    return false;
  }
  
  // ✅ Extract the last part of user._id if it's a composite ID
  let userMongoId = user._id;
  
  // If user._id is the composite string, extract the last part
  if (user._id && user._id.includes('_')) {
    const parts = user._id.split('_');
    userMongoId = parts[parts.length - 1];
    console.log('✅ Extracted user ID from composite:', userMongoId);
  }
  
  // Compare with quote.lockedById
  const canPrice = String(userMongoId) === String(quote.lockedById);
  
  console.log(canPrice ? '✅ User can price' : '❌ User cannot price');
  return canPrice;
};

function ManagerIdDebug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkIds = async () => {
    setChecking(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      const API_BASE = 'https://ndaje-hotel-supply-backend.onrender.com/api';

      // Get current user info from backend
      const userInfoRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userInfo = await userInfoRes.json();

      // Get quotes to see what lockedById values exist
      const quotesRes = await fetch(`${API_BASE}/quotes/manager/locked`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const quotes = await quotesRes.json();

      setDebugInfo({
        localStorage: {
          userId: user.id,
          user_id: user._id,
          fullUser: user
        },
        backendUser: userInfo.data || userInfo,
        lockedQuotes: quotes.data || [],
        comparison: {
          frontendId: user._id || user.id,
          backendIds: (quotes.data || []).map(q => q.lockedById)
        }
      });
    } catch (err) {
      console.error('Debug error:', err);
      setDebugInfo({ error: err.message });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkIds();
  }, []);

  if (checking) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="animate-pulse">Checking IDs...</div>
      </div>
    );
  }

  if (!debugInfo) return null;

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg max-w-4xl mx-auto my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">🐛</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager ID Debug Report</h2>
          <p className="text-gray-600">Finding the ID mismatch problem</p>
        </div>
      </div>

      {debugInfo.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          <strong>Error:</strong> {debugInfo.error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Frontend IDs */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🖥️ Frontend (localStorage)</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">user.id:</span>
                <span className="font-bold text-blue-900">{debugInfo.localStorage.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">user._id:</span>
                <span className="font-bold text-blue-900">{debugInfo.localStorage.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extracted MongoDB ID:</span>
                <span className="font-bold text-green-700">
                  {debugInfo.localStorage.userId?.includes('_') 
                    ? debugInfo.localStorage.userId.split('_').pop()
                    : debugInfo.localStorage.user_id}
                </span>
              </div>
            </div>
          </div>

          {/* Backend User */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🖧 Backend (/auth/me)</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">id:</span>
                <span className="font-bold text-purple-900">{debugInfo.backendUser?.user?.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">_id:</span>
                <span className="font-bold text-purple-900">{debugInfo.backendUser?.user?._id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">name:</span>
                <span className="font-bold text-gray-900">{debugInfo.backendUser?.user?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">role:</span>
                <span className="font-bold text-gray-900">{debugInfo.backendUser?.user?.role || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Locked Quotes */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔒 Locked Quotes</h3>
            {debugInfo.lockedQuotes.length === 0 ? (
              <p className="text-gray-500 italic">No locked quotes found</p>
            ) : (
              <div className="space-y-3">
                {debugInfo.lockedQuotes.map((quote, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Quote #{quote.id?.slice(-8)}</span>
                      <span className="text-sm text-gray-500">{quote.status}</span>
                    </div>
                    <div className="space-y-1 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">lockedById:</span>
                        <span className="font-bold text-red-700">{quote.lockedById}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Match?</span>
                        <span className={`font-bold ${
                          String(quote.lockedById) === String(debugInfo.localStorage.user_id)
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          {String(quote.lockedById) === String(debugInfo.localStorage.user_id) ? '✅ YES' : '❌ NO'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issue Summary */}
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-3">🚨 THE PROBLEM</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800">
                <strong>Your Frontend ID:</strong>{' '}
                <code className="bg-green-100 px-2 py-1 rounded">{debugInfo.localStorage.user_id}</code>
              </p>
              <p className="text-gray-800">
                <strong>Backend lockedById:</strong>{' '}
                <code className="bg-red-100 px-2 py-1 rounded">
                  {debugInfo.lockedQuotes[0]?.lockedById || 'No locked quotes'}
                </code>
              </p>
              <p className="text-red-700 font-bold mt-3">
                ❌ These IDs DO NOT MATCH!
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Root Cause:</strong> When you lock a quote, the backend is using a DIFFERENT manager ID 
                than what's stored in your localStorage. This means the lock endpoint is either:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                <li>Using the wrong user ID from the JWT token</li>
                <li>Not extracting the MongoDB _id correctly on the backend</li>
                <li>Using a different manager record than expected</li>
              </ul>
            </div>
          </div>

          {/* Backend Fix Needed */}
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">🔧 BACKEND FIX REQUIRED</h3>
            <p className="text-gray-800 mb-3">
              Check your backend quote locking endpoint (<code>/quotes/manager/lock</code>):
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
{`// ❌ WRONG: Using string ID
quote.lockedById = req.user.id;  // mgr_xxx_mongoId

// ✅ CORRECT: Extract MongoDB ObjectId
const managerId = req.user._id || 
                  req.user.id.split('_').pop();
quote.lockedById = managerId;  // Just the MongoDB ID`}
            </pre>
          </div>

          <button
            onClick={checkIds}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🔄 Refresh Debug Info
          </button>
        </div>
      )}
    </div>
  );
}

ManagerIdDebug()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {showLockModal && quoteToLock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lock Quote</h2>
                  <p className="text-gray-600 mt-1">
                    #{quoteToLock.id?.slice(-8) || 'N/A'} • {quoteToLock.client?.name || 'Client'}
                  </p>
                </div>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-4">
                  <LockClosedIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Lock Duration: 30 minutes</h4>
                    <p className="text-sm text-blue-700">You'll have exclusive access to price this quote</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Items to price:</span>
                    <span className="font-semibold">{quoteToLock.items?.length || 0} items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{quoteToLock.client?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">{new Date(quoteToLock.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLockQuote}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Lock & Start Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                  onClick={fetchManagerData}
                  title="Refresh quotes"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {stats.pending > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pending}
                    </span>
                  )}
                </button>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Quotes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Currently Pricing</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  RWF {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Quotes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.completed || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'available' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available ({availableQuotes.length})
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'locked' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Locked ({lockedQuotes.length})
          </button>
        </div>

        {/* Quote Card Rendering */}
        <div className="space-y-6">
          {(() => {
            let filteredQuotes = [];
            let emptyMessage = "";
            
            if (activeTab === 'all') {
              filteredQuotes = quotes;
              emptyMessage = 'No quotes available';
            } else if (activeTab === 'available') {
              filteredQuotes = availableQuotes;
              emptyMessage = 'All quotes are currently being priced by managers.';
            } else if (activeTab === 'locked') {
              filteredQuotes = lockedQuotes;
              emptyMessage = 'You don\'t have any locked quotes at the moment.';
            }

            if (filteredQuotes.length === 0) {
              return (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {/* Icon */}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'all' ? 'No quotes available' : 
                     activeTab === 'available' ? 'No available quotes' : 
                     'No locked quotes'}
                  </h3>
                  <p className="text-gray-600 mb-6">{emptyMessage}</p>
                  <button
                    onClick={fetchManagerData}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                  >
                    Refresh
                  </button>
                </div>
              );
            }

            return filteredQuotes.map(quote => {
              const status = getQuoteStatus(quote);
              const quoteItems = quote.items || [];
              const totalEstimate = quoteItems.reduce((sum, item) => 
                sum + (item.unitPrice || item.product?.price || 0) * item.quantity, 0
              );
              
              // FIXED: Better button visibility logic
              const showLockButton = canLockQuote(quote);
              const showPriceButton = canPriceQuote(quote);
              const showDeleteButton = canDeleteQuote(quote);
              const showAwaitingMessage = quote.status === 'AWAITING_CLIENT_APPROVAL' && quote.managerId === user.id;
              
              console.log(`🎨 Rendering quote ${quote.id}:`, {
                showLockButton,
                showPriceButton,
                showDeleteButton,
                status: quote.status,
                lockedById: quote.lockedById,
                managerId: user.id
              });

              return (
                <div key={quote.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">Quote #{quote.id?.slice(-8)}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          {status.text}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">
                        Client: <span className="font-semibold">{quote.client?.name || 'Unknown'}</span>
                      </p>
                      
                      {/* Show lock expiration for locked quotes */}
                      {quote.lockedById === user.id && quote.lockExpiresAt && (
                        <p className="text-sm text-orange-600 mt-1">
                          ⏰ Lock expires: {new Date(quote.lockExpiresAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Delete Button */}
                      {showDeleteButton && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuote(quote);
                          }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-1"
                          title="Delete this quote"
                        >
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                      
                      {/* Lock Button */}
                      {showLockButton && (
                        <button
                          onClick={() => handleLockQuote(quote)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1"
                        >
                          <span className="hidden sm:inline">Lock</span>
                        </button>
                      )}
                      
                      {/* Price Button - FIXED: Now shows for locked quotes */}
                      {showPriceButton && (
                        <button
                          onClick={() => handlePriceQuote(quote)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Price Quote</span>
                        </button>
                      )}
                      
                      {/* Awaiting Message */}
                      {showAwaitingMessage && (
                        <span className="px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded-lg">
                          Awaiting Client
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Items Display */}
                  {quoteItems.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {quoteItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {item.product?.name || 'Product'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  SKU: {item.product?.sku || 'N/A'}
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.quantity}x
                                </p>
                                <p className="text-xs text-gray-600">
                                  RWF {(item.unitPrice || item.product?.price || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {quoteItems.length > 3 && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 flex items-center justify-center">
                            <span className="text-sm text-blue-700 font-medium">
                              +{quoteItems.length - 3} more items
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Client Notes:</span>{' '}
                          {quote.notes || quote.sourcingNotes || 'No additional notes'}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Estimated Total</div>
                          <div className="text-xl font-bold text-blue-900">
                            RWF {totalEstimate.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {showPricingModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl my-8 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Price Quote</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedQuote.client?.name || 'Client'} • #{selectedQuote.id?.slice(-8) || 'N/A'}
                  </p>
                  {selectedQuote.lockedById === user.id && selectedQuote.lockExpiresAt && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⏰ Lock expires in: {Math.ceil((new Date(selectedQuote.lockExpiresAt) - new Date()) / 60000)} minutes
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sourcing Notes (Optional)
                </label>
                <textarea
                  value={sourcingNotes}
                  onChange={(e) => setSourcingNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about product availability, alternatives, or special conditions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Items to Price</h3>
                {selectedQuote.items && Array.isArray(selectedQuote.items) ? (
                  selectedQuote.items.map((item, index) => {
                    const productId = item.product?.id || item.productId;
                    const name = item.product?.name || 'Unknown Product';
                    const sku = item.product?.sku || 'N/A';
                    const currentPrice = item.unitPrice || item.product?.price || 0;
                    
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 transition">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-5">
                            <h4 className="font-medium text-gray-900 text-lg">{name}</h4>
                            <p className="text-sm text-gray-500">SKU: {sku}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                Quantity: <span className="font-bold">{item.quantity}</span>
                              </span>
                              {currentPrice > 0 && (
                                <span className="text-sm text-gray-600">
                                  Current Price: <span className="font-bold">RWF {currentPrice.toLocaleString()}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Price (RWF)
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">RWF</span>
                              </div>
                              <input
                                type="number"
                                value={pricing[productId] || ''}
                                onChange={(e) => setPricing(p => ({ ...p, [productId]: e.target.value }))}
                                placeholder="Enter price"
                                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div className="md:col-span-3">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Line Total</div>
                              <div className="text-xl font-bold text-blue-900">
                                RWF {((pricing[productId] || currentPrice) * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items found in this quote
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {selectedQuote.lockExpiresAt && (
                    <>You have {Math.ceil((new Date(selectedQuote.lockExpiresAt) - new Date()) / 60000)} minutes remaining</>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPricingModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitPricing}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                  >
                    Submit to Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <EnhancedToast 
          toast={toast} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [inTransitDeliveries, setInTransitDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    totalEarnings: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionDeliveryId, setActionDeliveryId] = useState(null);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDriverData();
    // Set up real-time updates (WebSocket or polling)
    const interval = setInterval(fetchDriverData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [deliveriesRes, notificationsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/deliveries/driver`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/notifications/driver`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE}/drivers/stats/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allDeliveries = deliveriesRes.data.data || [];
      setDeliveries(allDeliveries);
      
      // Categorize deliveries
      setAssignedDeliveries(allDeliveries.filter(d => d.status === 'ASSIGNED'));
      setInTransitDeliveries(allDeliveries.filter(d => d.status === 'IN_TRANSIT' || d.status === 'PICKED_UP'));
      setCompletedDeliveries(allDeliveries.filter(d => d.status === 'DELIVERED' || d.status === 'CLIENT_VERIFIED'));
      
      setNotifications(notificationsRes.data.data || []);
      setStats(statsRes.data.data || stats);
    } catch (err) {
      console.error('Failed to fetch driver data:', err);
      setToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'Failed to load dashboard data' 
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (deliveryId, status) => {
    try {
      await axios.put(
        `${API_BASE}/deliveries/${deliveryId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setToast({ 
        type: 'success', 
        title: 'Success', 
        message: 'Delivery status updated successfully' 
      });
      fetchDriverData();
      
      // Send notification to client
      if (status === 'PICKED_UP' || status === 'IN_TRANSIT' || status === 'DELIVERED') {
        await axios.post(`${API_BASE}/notifications/delivery-update`, {
          deliveryId,
          status,
          driverId: user.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setToast({ 
        type: 'error', 
        title: 'Error', 
        message: err.response?.data?.message || 'Failed to update status' 
      });
    }
  };

  const verifyDeliveryCode = async (deliveryId, code) => {
    try {
      const response = await axios.post(
        `${API_BASE}/deliveries/${deliveryId}/verify`,
        { verificationCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setToast({ 
          type: 'success', 
          title: 'Success', 
          message: 'Delivery verified successfully!' 
        });
        setShowDeliveryModal(false);
        setVerificationCode('');
        fetchDriverData();
        
        // Notify admin and client
        await axios.post(`${API_BASE}/notifications/delivery-complete`, {
          deliveryId,
          driverId: user.id,
          verificationCode: code
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setToast({ 
        type: 'error', 
        title: 'Error', 
        message: err.response?.data?.message || 'Invalid verification code' 
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-yellow-100 text-yellow-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CLIENT_VERIFIED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ASSIGNED: ClipboardDocumentListIcon,
      PICKED_UP: TruckIcon,
      IN_TRANSIT: MapPinIcon,
      DELIVERED: CheckCircleIcon,
      CLIENT_VERIFIED: CheckCircleIcon,
      CANCELLED: XCircleIcon
    };
    return icons[status] || ClipboardDocumentListIcon;
  };

  const handleAction = (action, deliveryId) => {
    setActionType(action);
    setActionDeliveryId(deliveryId);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'start') {
        await updateStatus(actionDeliveryId, 'PICKED_UP');
      } else if (actionType === 'transit') {
        await updateStatus(actionDeliveryId, 'IN_TRANSIT');
      } else if (actionType === 'complete') {
        const delivery = deliveries.find(d => d.id === actionDeliveryId);
        setSelectedDelivery(delivery);
        setShowDeliveryModal(true);
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const DeliveryCard = ({ delivery }) => {
    const StatusIcon = getStatusIcon(delivery.status);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              Delivery #{delivery.deliveryNumber}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Client: {delivery.client?.name || 'Unknown'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
            {delivery.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>From: {delivery.pickupAddress}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>To: {delivery.deliveryAddress}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 mr-2" />
            <span>Contact: {delivery.client?.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>Estimated: {new Date(delivery.estimatedDelivery).toLocaleString()}</span>
          </div>
          {delivery.notes && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Notes: </span>
              {delivery.notes}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <span className="font-bold text-lg text-gray-900">
              ${delivery.deliveryFee?.toFixed(2) || '0.00'}
            </span>
            <p className="text-xs text-gray-500">Delivery Fee</p>
          </div>
          
          <div className="flex space-x-2">
            {delivery.status === 'ASSIGNED' && (
              <button
                onClick={() => handleAction('start', delivery.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Start Delivery
              </button>
            )}
            {delivery.status === 'PICKED_UP' && (
              <button
                onClick={() => handleAction('transit', delivery.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Mark In Transit
              </button>
            )}
            {delivery.status === 'IN_TRANSIT' && (
              <button
                onClick={() => handleAction('complete', delivery.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Complete Delivery
              </button>
            )}
            {delivery.status === 'DELIVERED' && (
              <button
                onClick={() => {
                  setSelectedDelivery(delivery);
                  setShowDeliveryModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                Enter Verification Code
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NotificationBell = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return (
      <div className="relative">
        <button
          onClick={() => {/* Open notifications panel */}}
          className="p-2 hover:bg-gray-100 rounded-lg relative"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading driver dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="font-bold">{toast.title}</div>
          <div>{toast.message}</div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Portal</h1>
                <p className="text-gray-600">
                  Welcome, <span className="font-semibold text-blue-600">{user.name}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <button
                onClick={fetchDriverData}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Refresh"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalDeliveries}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.completedToday}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pendingDeliveries}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${stats.totalEarnings?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Sections */}
        <div className="space-y-8">
          {/* Assigned Deliveries */}
          {assignedDeliveries.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Assigned Deliveries</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {assignedDeliveries.length} pending
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignedDeliveries.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            </section>
          )}

          {/* In Transit Deliveries */}
          {inTransitDeliveries.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">In Transit</h2>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {inTransitDeliveries.length} active
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inTransitDeliveries.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Deliveries */}
          {completedDeliveries.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Completed Deliveries</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {completedDeliveries.length} total
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedDeliveries.map(delivery => (
                  <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          Delivery #{delivery.deliveryNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Client: {delivery.client?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>Delivered on: {new Date(delivery.deliveredAt).toLocaleString()}</p>
                      <p>Delivery Fee: <span className="font-bold">${delivery.deliveryFee?.toFixed(2) || '0.00'}</span></p>
                      {delivery.verificationCode && (
                        <p>Verification Code: <span className="font-mono">{delivery.verificationCode}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {deliveries.length === 0 && (
            <div className="text-center py-12">
              <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries assigned</h3>
              <p className="text-gray-600">You don't have any deliveries assigned at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Verification Modal */}
      {showDeliveryModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verify Delivery #{selectedDelivery.deliveryNumber}
            </h3>
            <p className="text-gray-600 mb-6">
              Please enter the verification code provided by the client to complete delivery.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
              <p className="text-sm text-gray-500 mt-2">
                Ask the client for the delivery verification code sent to their phone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setVerificationCode('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => verifyDeliveryCode(selectedDelivery.id, verificationCode)}
                disabled={!verificationCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionType === 'start' && 'Start Delivery'}
              {actionType === 'transit' && 'Mark as In Transit'}
              {actionType === 'complete' && 'Complete Delivery'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to proceed with this action? This will notify the client.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// MAIN APP COMPONENT
// ==============================
function App() {
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [passwordResetModal, setPasswordResetModal] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [darkMode, setDarkMode] = useDarkMode();

  // Add CSS for animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
  .font-digital {
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 2px;
    text-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
  }
  
  /* Timeclock specific styles */
  .timeclock-bg {
    background: radial-gradient(circle at center, #111827 0%, #000 100%);
  }
  
  .timeclock-glow {
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
  }
  
  .timeclock-border {
    border: 2px solid #374151;
    border-radius: 20px;
  }
  
  /* Input focus effects */
  .timeclock-input:focus {
    box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
  }
  
  /* Button press effect */
  .timeclock-btn:active {
    transform: translateY(2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  /* Scan line effect for digital display */
  @keyframes scanline {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
  
  .scanline {
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(74, 222, 128, 0.1) 50%
    );
    background-size: 100% 4px;
    animation: scanline 10s linear infinite;
  }
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      
      .animate-progress {
        animation: progress 5s linear forwards;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      /* Dark mode custom properties */
      .dark {
        color-scheme: dark;
      }
      
      .dark input,
      .dark select,
      .dark textarea {
        background-color: #374151;
        color: #f9fafb;
        border-color: #4b5563;
      }
      
      .dark input:focus,
      .dark select:focus,
      .dark textarea:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
      }
      
      /* Scrollbar styling for dark mode */
      .dark ::-webkit-scrollbar {
        width: 10px;
      }
      
      .dark ::-webkit-scrollbar-track {
        background: #1f2937;
      }
      
      .dark ::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 5px;
      }
      
      .dark ::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
        
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);


  // DELETE USER
  const deleteUser = async (userId, userName, type) => {
    setConfirmModal({
      title: `Delete ${type === 'manager' ? 'Manager' : 'Driver'}`,
      message: `Are you sure you want to remove ${userName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/admin/${type}s/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setToast({
            type: 'success',
            title: 'Success',
            message: `${type === 'manager' ? 'Manager' : 'Driver'} deleted successfully`
          });
        } catch (err) {
          setToast({
            type: 'error',
            title: 'Error',
            message: err.response?.data?.message || 'Failed to delete user'
          });
        }
      }
    });
  };

  // RESET PASSWORD
  const resetUserPassword = async (userId, userName, userEmail) => {
    setPasswordResetModal({
      userId,
      userName,
      userEmail,
      onReset: async (id, newPassword) => {
        try {
          await axios.post(`${API_BASE}/admin/reset-password/${id}`, 
            { newPassword }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setToast({
            type: 'success',
            title: 'Password Reset',
            message: `Password has been reset for ${userName}. New password sent to ${userEmail}`
          });
          
          return true;
        } catch (err) {
          setToast({
            type: 'error',
            title: 'Reset Failed',
            message: err.response?.data?.message || 'Failed to reset password'
          });
          return false;
        }
      }
    });
  };

 
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedDashboard 
              deleteUser={deleteUser} 
              resetUserPassword={resetUserPassword} 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>

    <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
    
    {passwordResetModal && (
      <PasswordResetModal
        isOpen={!!passwordResetModal}
        onClose={() => setPasswordResetModal(null)}
        userId={passwordResetModal.userId}
        userName={passwordResetModal.userName}
        userEmail={passwordResetModal.userEmail}
        onReset={passwordResetModal.onReset}
      />
    )}

    <EnhancedToast toast={toast} onClose={() => setToast(null)} />
  </>
);
}



export default App;