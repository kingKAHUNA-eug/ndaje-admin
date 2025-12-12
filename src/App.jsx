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
  CubeIcon, BuildingStorefrontIcon, DocumentTextIcon
} from '@heroicons/react/24/outline'

// FIXED API BASE — CLEAN & FINAL
const API_BASE = import.meta.env.VITE_API_URL
  .replace(/\/+$/, '')
  .replace(/\/api\/api/, '/api')
  .replace(/\/\/auth/, '/auth')

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


// Test function to check locked quotes
const testLockedQuotes = async () => {
  try {
    // Test 1: Get all manager quotes
    const allResponse = await fetch('/api/quotes/manager/quotes');
    const allData = await allResponse.json();
    console.log('All manager quotes:', allData.data?.length || 0);
    
    // Test 2: Get locked quotes only
    const lockedResponse = await fetch('/api/quotes/manager/locked');
    const lockedData = await lockedResponse.json();
    console.log('Locked quotes only:', lockedData.data?.length || 0);
    
    // Test 3: Get available quotes for locking
    const availableResponse = await fetch('/api/quotes/manager/available');
    const availableData = await availableResponse.json();
    console.log('Available quotes for locking:', availableData.data?.length || 0);
    
    // Log details of locked quotes
    if (lockedData.success && lockedData.data.length > 0) {
      console.log('Locked quotes details:');
      lockedData.data.forEach(quote => {
        console.log(`- Quote ${quote.id}: ${quote.client?.name}, Status: ${quote.status}, Locked until: ${new Date(quote.lockExpiresAt).toLocaleString()}`);
      });
    } else {
      console.log('No locked quotes found');
    }
    
    return {
      all: allData.data?.length || 0,
      locked: lockedData.data?.length || 0,
      available: availableData.data?.length || 0
    };
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Call this function to test
testLockedQuotes();

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

// Add this to your AdminDashboard or create a new component
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
        
        // Remove from state
        setQuotes(prev => prev.filter(q => q.id !== quoteId));
        
        // Show success message
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

      {/* Filters */}
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

      {/* Quotes Table */}
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
// MAIN GOD COMPONENT
function App() {
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [passwordResetModal, setPasswordResetModal] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Add CSS for animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
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
      
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      
      .animate-progress {
        animation: progress 5s linear forwards;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // DELETE USER — SILENT AND MERCILESS
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

  // RESET PASSWORD — Enhanced with new modal
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
                token={token} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>

      {/* Modals and Toasts */}
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

      {/* Enhanced Toast */}
      <EnhancedToast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />
    </>
  );
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const user = res.data.data?.user || res.data.user
      const token = res.data.data?.token || res.data.token

      if (res.data.success && ['ADMIN', 'MANAGER'].includes(user.role)) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/dashboard')
      } else {
        setError('Access denied. Staff access only.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 rounded-2xl mb-6 shadow-2xl">
            <span className="text-white text-4xl font-black">N</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900">NDAJE</h1>
          <p className="text-xl text-gray-600 mt-2">Hotel Supply Command Center</p>
          <p className="text-sm text-gray-500 mt-4">Staff Access Only</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Staff Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="staff@ndaje.rw"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl transition disabled:opacity-60 shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Enter Command Center'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2025 NDAJE Supply Chain • Rwanda</p>
            <p className="mt-1 font-medium text-gray-700">All hotels will be supplied. All will comply.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = user?.role === 'ADMIN' ? [
  { name: 'Overview', path: '/dashboard/overview', icon: ChartBarIcon },
  { name: 'Products', path: '/dashboard/products', icon: CubeIcon },
  { name: 'Managers', path: '/dashboard/managers', icon: UsersIcon },
  { name: 'Drivers', path: '/dashboard/drivers', icon: TruckIcon },
  { name: 'Quotes', path: '/dashboard/quotes', icon: DocumentTextIcon },
  { name: 'Orders', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
  { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon }
] : [
  { name: 'Pricing Dashboard', path: '/dashboard/manager', icon: CurrencyDollarIcon },
  { name: 'My Orders', path: '/dashboard/my-orders', icon: CheckCircleIcon }
];

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
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

function ProductsPanel() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const token = localStorage.getItem('token')
  const [form, setForm] = useState({
    name: '', sku: '', price: '', icon: '', image: '', reference: '', description: '', category: '', active: true
  })

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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    console.log('🚀 Submitting product form...')
    console.log('📝 Form data:', form)
    
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price) || 0,
        icon: form.icon.trim() || "box",
        image: form.image.trim() || null,
        reference: form.reference.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        active: true
      }

      console.log('📤 Payload to send:', payload)

      if (!payload.name || !payload.sku || !payload.price) {
        alert("Name, SKU and Price are required!")
        return
      }

      let response;
      if (editing) {
        console.log('✏️ Updating product:', editing.id)
        response = await axios.put(`${API_BASE}/products/${editing.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('✅ Product updated:', response.data)
      } else {
        console.log('🆕 Creating new product')
        response = await axios.post(`${API_BASE}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('✅ Product created:', response.data)
      }

      setShowAdd(false)
      setEditing(null)
      setForm({ name: '', sku: '', price: '', icon: '', image: '', reference: '', description: '', category: '', active: true })
      fetchProducts()
      
      alert(editing ? "Product updated!" : "Product created successfully!")
    } catch (err) {
      console.error('❌ Product submission failed:', err)
      console.error('🔍 Error response:', err.response?.data)
      alert(err.response?.data?.message || "Failed to save product")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    console.log('🗑️ Deleting product:', id)
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('✅ Product deleted')
      fetchProducts()
    } catch (err) {
      console.error('❌ Delete failed:', err)
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="text-center py-20 text-3xl font-black text-blue-900">Loading Products...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">Product Catalog</h1>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 font-bold">
          <PlusIcon className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">
                {p.icon}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Ref: {p.reference || '—'}</p>
              <p className="text-2xl font-bold text-blue-900 mt-3">RWF {Number(p.price).toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setEditing(p); setForm(p); setShowAdd(true) }} className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                  <PencilSquareIcon className="w-5 h-5 mx-auto" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                  <TrashIcon className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit' : 'Add'} Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="px-4 py-3 border rounded-xl" />
              <input placeholder="SKU (unique)" value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))} className="px-4 py-3 border rounded-xl" />
              <input placeholder="Price (RWF)" type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="px-4 py-3 border rounded-xl" />
              <input placeholder="Icon (e.g. beer, water)" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} className="px-4 py-3 border rounded-xl" />
              
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>

                {/* SUCCESS: IMAGE UPLOADED */}
                {form.image && form.image !== 'uploading' && form.image !== '' ? (
                  <div className="relative rounded-xl overflow-hidden border-4 border-green-500 bg-green-50 shadow-2xl">
                    <img
                      src={form.image}
                      alt="Product preview"
                      className="w-full h-80 object-cover bg-gray-100"
                      onError={(e) => {
                        e.target.src = `${API_BASE}/admin/upload/product-image`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full text-3xl font-black shadow-2xl transition transform hover:scale-110"
                    >
                      X
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <div className="flex items-center gap-3 text-white">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-xl font-bold">REAL PHOTO UPLOADED — NDAJE IS ALIVE</span>
                      </div>
                    </div>
                  </div>
                ) : form.image === 'uploading' ? (
                  /* UPLOADING STATE */
                  <div className="w-full h-80 border-4 border-dashed border-blue-600 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full animate-pulse mb-6">
                      <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    </div>
                    <p className="text-4xl font-black text-blue-900">Uploading…</p>
                    <p className="text-xl text-blue-700 mt-2">Real photo for Rwanda's finest</p>
                  </div>
                ) : (
                  /* DEFAULT UPLOAD ZONE */
                  <label className="w-full h-80 border-4 border-dashed border-blue-600 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 transition-all cursor-pointer text-blue-900 font-bold text-2xl shadow-2xl group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        setForm(f => ({ ...f, image: 'uploading' }))

                        const formData = new FormData()
                        formData.append('image', file)

                        try {
                          const token = localStorage.getItem('token')
                          const res = await axios.post(
                            `${API_BASE}/admin/upload/product-image`,
                            formData,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                              }
                            }
                          )

                          setForm(f => ({ ...f, image: res.data.data.url }))
                          console.log('IMAGE UPLOADED:', res.data.data.url)

                        } catch (err) {
                          console.error('Upload failed:', err.response?.data || err)
                          alert('Upload failed: ' + (err.response?.data?.message || 'Try again'))
                          setForm(f => ({ ...f, image: '' }))
                        }
                      }}
                    />
                    <div className="text-center">
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">Upload Photo</div>
                      <div className="text-2xl text-blue-700 font-bold">Click • Drag & Drop • Camera</div>
                      <div className="text-lg text-blue-600 mt-4 font-medium">
                        Real photos for Rwanda's finest hotels
                      </div>
                    </div>
                  </label>
                )}
              </div>
              <input placeholder="Reference (e.g. BEER-001)" value={form.reference} onChange={e => setForm(f => ({...f, reference: e.target.value}))} className="px-4 py-3 border rounded-xl" />
              <input placeholder="Category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="px-4 py-3 border rounded-xl" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => { setShowAdd(false); setEditing(null); setForm({name:'',sku:'',price:'',icon:'',image:'',reference:'',description:'',category:'',active:true}) }} className="flex-1 py-3 border rounded-xl">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold">{editing ? 'Update' : 'Create'} Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Admin Dashboard with Updated Cards
function AdminDashboard({ deleteUser, resetUserPassword }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [managers, setManagers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeManagers: 0, activeDrivers: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddManager, setShowAddManager] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [newManager, setNewManager] = useState({ name: '', email: '', phone: '', password: '' })
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', password: '', vehicle: '' })

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [manRes, driRes, ordRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/managers`, { headers }),
          axios.get(`${API_BASE}/admin/drivers`, { headers }),
          axios.get(`${API_BASE}/admin/orders`, { headers })
        ])

        setManagers(manRes.data.data || [])
        setDrivers(driRes.data.data || [])
        setOrders(ordRes.data.data || [])

        const revenue = ordRes.data.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
        setStats({
          totalRevenue: revenue,
          totalOrders: ordRes.data.data?.length || 0,
          activeManagers: manRes.data.data?.filter(m => m.isActive).length || 0,
          activeDrivers: driRes.data.data?.filter(d => d.isActive).length || 0
        })
      } catch (err) {
        console.error('Failed to load data', err)
        if (err.response?.status === 401) localStorage.clear()
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [token])

  const createManager = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/managers`, newManager, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setManagers(prev => [...prev, res.data.data.manager])
      setShowAddManager(false)
      setNewManager({ name: '', email: '', phone: '', password: '' })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create manager')
    }
  }

  const createDriver = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/drivers`, newDriver, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDrivers(prev => [...prev, res.data.data.driver])
      setShowAddDriver(false)
      setNewDriver({ name: '', email: '', phone: '', password: '', vehicle: '' })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create driver')
    }
  }

  const filteredManagers = managers.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrivers = drivers.filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-3xl font-black text-blue-900">NDAJE IS RISING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">NDAJE Admin</h1>
              <p className="text-xs text-gray-500">Command Center</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'products', name: 'Products', icon: CubeIcon },
            { id: 'managers', name: 'Managers', icon: UsersIcon },
            { id: 'drivers', name: 'Drivers', icon: TruckIcon },
            { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon },
            { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Administrator</p>
              <p className="text-xs text-blue-600">King of Rwanda</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : 
               activeTab === 'products' ? 'Product Catalog' :
               activeTab === 'managers' ? 'Operations Managers' :
               activeTab === 'drivers' ? 'Delivery Drivers' :
               activeTab === 'orders' ? 'Order Management' : 'Settings'}
            </h1>
          </div>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {activeTab === 'products' && <ProductsPanel />}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Revenue', value: `RWF ${stats.totalRevenue.toLocaleString()}`, icon: CurrencyDollarIcon, color: 'green' },
                { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCartIcon, color: 'blue' },
                { title: 'Active Managers', value: stats.activeManagers, icon: UserGroupIcon, color: 'purple' },
                { title: 'Active Drivers', value: stats.activeDrivers, icon: TruckIcon, color: 'orange' }
              ].map((stat) => (
                <div key={stat.title} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color === 'green' ? 'bg-green-50' : stat.color === 'blue' ? 'bg-blue-50' : stat.color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color === 'green' ? 'text-green-600' : stat.color === 'blue' ? 'text-blue-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id?.slice(-8) || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.client?.name || 'Unknown Client'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">RWF {order.total?.toLocaleString() || 0}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'managers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Operations Managers</h2>
              <button onClick={() => setShowAddManager(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
                <PlusIcon className="w-4 h-4" /> Add Manager
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredManagers.map((manager) => (
                <div key={manager.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => resetUserPassword(manager.id, manager.name, manager.email)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                        title="Reset Password"
                      >
                        <LockOpenIcon className="w-5 h-5 text-blue-700" />
                      </button>
                      <button
                        onClick={() => deleteUser(manager.id, manager.name, 'manager')}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                        title="Delete Manager"
                      >
                        <TrashIcon className="w-5 h-5 text-red-700" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{manager.name}</h3>
                  <div className="space-y-2 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {manager.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {manager.phone}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      manager.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {manager.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">Manager</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Drivers</h2>
              <button onClick={() => setShowAddDriver(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
                <PlusIcon className="w-4 h-4" /> Add Driver
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <TruckIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => resetUserPassword(driver.id, driver.name, driver.email)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                        title="Reset Password"
                      >
                        <LockOpenIcon className="w-5 h-5 text-blue-700" />
                      </button>
                      <button
                        onClick={() => deleteUser(driver.id, driver.name, 'driver')}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                        title="Delete Driver"
                      >
                        <TrashIcon className="w-5 h-5 text-red-700" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                  <div className="space-y-2 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {driver.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {driver.phone}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      driver.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {driver.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">Driver</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-900">#{order.id?.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.client?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">RWF {order.total?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Manager</h3>
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

        {showAddDriver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Driver</h3>
              <div className="space-y-4">
                <input placeholder="Name" value={newDriver.name} onChange={e => setNewDriver(prev => ({...prev, name: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Email" value={newDriver.email} onChange={e => setNewDriver(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Phone" value={newDriver.phone} onChange={e => setNewDriver(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
                <input type="password" placeholder="Password" value={newDriver.password} onChange={e => setNewDriver(prev => ({...prev, password: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Vehicle (e.g. Toyota Hiace - RAB 123 A)" value={newDriver.vehicle} onChange={e => setNewDriver(prev => ({...prev, vehicle: e.target.value}))} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddDriver(false)} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>
                <button onClick={createDriver} className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// Enhanced Manager Dashboard - FIXED VERSION
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
  const [newQuotesCount, setNewQuotesCount] = useState(0);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

// Add to useEffect
useEffect(() => {
  const ws = new WebSocket(`${API_BASE.replace('http', 'ws')}/ws/quotes`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'NEW_QUOTE') {
      setToast({
        type: 'info',
        title: 'New Quote!',
        message: `New quote from ${data.clientName} available for pricing.`
      });
      fetchManagerData();
    }
  };
  
  return () => ws.close();
}, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('📡 Fetching manager data...');
      
      // Fetch all manager endpoints
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
      
      console.log(`📊 Stats: ${available.length} available, ${locked.length} locked, ${awaitingApproval.length} awaiting approval`);
      
      setQuotes(allQuotes);
      setAvailableQuotes(available);
      setLockedQuotes(locked);
      
      // Calculate new quotes count
      const lastCheck = localStorage.getItem('lastQuoteCheck') || new Date().toISOString();
      const newQuotes = allQuotes.filter(q => 
        new Date(q.createdAt) > new Date(lastCheck)
      );
      
      if (newQuotes.length > 0 && newQuotesCount === 0) {
        setNewQuotesCount(newQuotes.length);
        // Show notification
        setToast({
          type: 'info',
          title: 'New Quotes Available',
          message: `${newQuotes.length} new quote${newQuotes.length > 1 ? 's' : ''} ready for pricing!`
        });
      }
      
      // Update last check time
      localStorage.setItem('lastQuoteCheck', new Date().toISOString());
      
      // Calculate stats
      setStats({
        pending: available.length,
        active: locked.length,
        completed: awaitingApproval.length,
        totalRevenue: allQuotes.reduce((sum, q) => sum + (q.totalAmount || 0), 0)
      });
      
    } catch (err) {
      console.error('Failed to fetch manager data:', err);
      
      // Try fallback endpoint
      try {
        console.log('Trying fallback endpoint...');
        const fallbackRes = await axios.get(`${API_BASE}/quotes/manager/pending`, { headers });
        const fallbackData = fallbackRes.data.data || [];
        
        // Filter quotes
        const available = fallbackData.filter(q => 
          q.status === 'PENDING_PRICING' && 
          (!q.lockedById || new Date(q.lockExpiresAt) < new Date())
        );
        
        const locked = fallbackData.filter(q => 
          q.status === 'IN_PRICING' && 
          q.lockedById === user?.id &&
          new Date(q.lockExpiresAt) > new Date()
        );
        
        setQuotes(fallbackData);
        setAvailableQuotes(available);
        setLockedQuotes(locked);
        
        setStats({
          pending: available.length,
          active: locked.length,
          completed: 0,
          totalRevenue: fallbackData.reduce((sum, q) => sum + (q.totalAmount || 0), 0)
        });
        
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setToast({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to load quotes. Please check your connection.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
    
    // Enable polling for new quotes every 30 seconds
    //const interval = setInterval(() => {
    //  fetchManagerData();
  //  }, 30000);
    
   // return () => clearInterval(interval);
  }, []);

  const handleLockQuote = async (quote) => {
    setQuoteToLock(quote);
    setShowLockModal(true);
  };

  const confirmLockQuote = async () => {
    if (!quoteToLock) return;
    
    try {
      console.log(`🔒 Locking quote: ${quoteToLock.id}`);
      
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
      
      // Refresh data
      setTimeout(() => {
       fetchManagerData();
      }, 1000);
      
    } catch (error) {
      console.error('Lock error:', error.response?.data || error);
      
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

  const handlePriceQuote = (quote) => {
    setSelectedQuote(quote);
    setShowPricingModal(true);
    
    // Initialize pricing with current values
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
      // Validate items exist
      if (!selectedQuote.items || !Array.isArray(selectedQuote.items)) {
        setToast({
          type: 'error',
          title: 'Error',
          message: 'No items found in quote'
        });
        return;
      }

      // Prepare items array
      const items = selectedQuote.items.map(item => {
        const productId = item.product?.id || item.productId;
        return {
          productId: productId,
          quantity: item.quantity,
          unitPrice: Number(pricing[productId]) || 0
        };
      });

      // Validate all prices are set
      const missingPrices = items.filter(i => i.unitPrice <= 0);
      if (missingPrices.length > 0) {
        setToast({
          type: 'error',
          title: 'Invalid Pricing',
          message: 'Please set a valid price for all items!'
        });
        return;
      }

      console.log(`💰 Submitting pricing for quote: ${selectedQuote.id}`);
      
      // Submit pricing
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

      // Close modal and reset
      setShowPricingModal(false);
      setSelectedQuote(null);
      setPricing({});
      setSourcingNotes('');
      
      // Refresh data
      setTimeout(() => {
        fetchManagerData();
      }, 1000);
      
    } catch (err) {
      console.error('Pricing error:', err.response?.data || err);
      
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

// In your frontend ManagerDashboard component - FIXED handleDeleteQuote
const handleDeleteQuote = async (quote) => {
  if (!quote || !quote.id) return;
  
  const confirmDelete = window.confirm(
    `Are you sure you want to delete quote #${quote.id?.slice(-8)}?\n\n` +
    `Client: ${quote.client?.name || 'Unknown'}\n` +
    `Status: ${quote.status}\n` +
    `This action cannot be undone.`
  );
  
  if (!confirmDelete) return;
  
  try {
    console.log(`🗑️ Deleting quote: ${quote.id}`);
    
    // FIXED: Use the correct endpoint path
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
      setToast({
        type: 'success',
        title: 'Success',
        message: `Quote #${quote.id?.slice(-6)} has been deleted successfully`
      });
      
      // Remove from all lists
      setQuotes(prev => prev.filter(q => q.id !== quote.id));
      setAvailableQuotes(prev => prev.filter(q => q.id !== quote.id));
      setLockedQuotes(prev => prev.filter(q => q.id !== quote.id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: availableQuotes.filter(q => q.id !== quote.id).length,
        active: lockedQuotes.filter(q => q.id !== quote.id).length,
        totalRevenue: prev.totalRevenue - (quote.totalAmount || 0)
      }));
      
    } else {
      throw new Error(response.data.message || 'Failed to delete quote');
    }
  } catch (err) {
    console.error('Delete error:', err);
    console.error('Error response:', err.response?.data);
    
    let errorMessage = 'Failed to delete quote. Please try again.';
    
    if (err.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = 'You are not authorized to delete this quote. Please login again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to delete this quote.';
          break;
        case 404:
          errorMessage = 'Quote not found. It may have been already deleted.';
          break;
        case 500:
          errorMessage = err.response.data?.message || 'Server error. Please try again later.';
          break;
      }
    }
    
    setToast({
      type: 'error',
      title: 'Error',
      message: errorMessage
    });
  }
};

// FIXED: Enhanced canDeleteQuote function
const canDeleteQuote = (quote) => {
  if (!quote || !user.id) return false;
  
  const isLockExpired = quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date();
  
  // Allow deletion if:
  // 1. Manager has locked the quote (IN_PRICING status)
  // 2. Quote is available (PENDING_PRICING with no lock or expired lock)
  // 3. Manager assigned to the quote
  const canDelete = 
    (quote.lockedById === user.id && quote.status === 'IN_PRICING') ||
    (quote.status === 'PENDING_PRICING' && (!quote.lockedById || isLockExpired)) ||
    (quote.managerId === user.id);
  
  console.log(`🔍 Delete check for quote ${quote.id}:`, {
    canDelete,
    status: quote.status,
    lockedById: quote.lockedById,
    managerId: user.id,
    isLockExpired
  });
  
  return canDelete;
};


  const getQuoteStatus = (quote) => {
    if (quote.status === 'IN_PRICING') {
      if (quote.lockedById === user.id) {
        return { 
          text: 'You are pricing this',
          color: 'bg-yellow-100 text-yellow-800',
          icon: '🔒'
        };
      } else {
        return { 
          text: 'Being priced by another',
          color: 'bg-red-100 text-red-800',
          icon: '⏳'
        };
      }
    }
    
    if (quote.status === 'PENDING_PRICING') {
      if (quote.lockedById) {
        if (quote.lockExpiresAt && new Date(quote.lockExpiresAt) < new Date()) {
          return { 
            text: 'Lock expired',
            color: 'bg-green-100 text-green-800',
            icon: '🔄'
          };
        }
        return { 
          text: 'Locked by another',
          color: 'bg-gray-100 text-gray-800',
          icon: '🔐'
        };
      }
      return { 
        text: 'Available',
        color: 'bg-blue-100 text-blue-800',
        icon: '📋'
      };
    }
    
    if (quote.status === 'AWAITING_CLIENT_APPROVAL') {
      return { 
        text: 'Waiting client approval',
        color: 'bg-purple-100 text-purple-800',
        icon: '⏰'
      };
    }
    
    if (quote.status === 'APPROVED') {
      return { 
        text: 'Approved',
        color: 'bg-green-100 text-green-800',
        icon: '✅'
      };
    }
    
    return { 
      text: quote.status?.replace(/_/g, ' ') || 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      icon: '❓'
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
    return (
      (quote.status === 'IN_PRICING' && quote.lockedById === user.id) ||
      (quote.status === 'PENDING_PRICING' && quote.lockedById === user.id)
    );
  };


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
      {/* Lock Confirmation Modal */}
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
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
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

      {/* Header */}
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

      {/* Stats Cards */}
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
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
            Available ({quotes.filter(q => canLockQuote(q)).length})
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'locked' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Locked ({quotes.filter(q => q.lockedById === user.id).length})
          </button>
        </div>

        {/* Quotes List */}
        <div className="space-y-6">
          {(() => {
            let filteredQuotes = quotes;
            if (activeTab === 'available') {
              filteredQuotes = quotes.filter(q => canLockQuote(q));
            } else if (activeTab === 'locked') {
              filteredQuotes = quotes.filter(q => q.lockedById === user.id);
            }

            return filteredQuotes.length > 0 ? (
              filteredQuotes.map(quote => {
                const quoteItems = quote.items || [];
                const totalEstimate = quoteItems.reduce((sum, item) => 
                  sum + (item.quantity * (item.unitPrice || item.product?.price || 0)), 0
                );
                const status = getQuoteStatus(quote);
      
      return (
        <div key={quote.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* ... quote header ... */}
            </div>
           <div className="flex items-center gap-2">
  {/* DELETE BUTTON - FIXED POSITION */}
  {canDeleteQuote(quote) && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteQuote(quote);
      }}
      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-1"
      title="Delete this quote"
    >
      <TrashIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Delete</span>
    </button>
  )}
              
               {/* LOCK BUTTON */}
  {canLockQuote(quote) && (
    <button
      onClick={() => handleLockQuote(quote)}
      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1"
    >
      <LockClosedIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Lock</span>
    </button>
  )}
              
             {canPriceQuote(quote) && (
    <button
      onClick={() => handlePriceQuote(quote)}
      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-1"
    >
      <CurrencyDollarIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Price</span>
    </button>
  )}
              
              {quote.status === 'AWAITING_CLIENT_APPROVAL' && quote.managerId === user.id && (
                <span className="px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded-lg">
                  Awaiting Client
                </span>
              )}
            </div>
          </div>
          
                    
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
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'all' ? 'No quotes available' : 
                   activeTab === 'available' ? 'No available quotes' : 
                   'No locked quotes'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'available' 
                    ? 'All quotes are currently being priced by managers.' 
                    : 'New quotes will appear here automatically.'}
                </p>
                <button
                  onClick={fetchManagerData}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Pricing Modal */}
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
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Sourcing Notes */}
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

              {/* Items List */}
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

              {/* Actions */}
<div className="flex items-center gap-2">
  {canLockQuote(quote) && (
    <button
      onClick={() => handleLockQuote(quote)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
    >
      Lock Quote
    </button>
  )}
  {canPriceQuote(quote) && (
    <button
      onClick={() => handlePriceQuote(quote)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
    >
      Price Quote
    </button>
  )}
  {canDeleteQuote(quote) && (
    <button
      onClick={() => handleDeleteQuote(quote)}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
      title="Delete this quote"
    >
      Delete
    </button>
  )}
  {quote.status === 'AWAITING_CLIENT_APPROVAL' && quote.managerId === user.id && (
    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
      Awaiting Client
    </span>
  )}
</div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
  <div className="text-sm text-gray-500">
    You have {Math.ceil((new Date(selectedQuote.lockExpiresAt) - new Date()) / 60000)} minutes remaining
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

      {/* Toast */}
      {toast && (
        <EnhancedToast 
          toast={toast} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
function ProtectedDashboard({ deleteUser, resetUserPassword, token }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/')
    else if (user.role === 'ADMIN') navigate('/dashboard/overview', { replace: true })
    else if (user.role === 'MANAGER') navigate('/dashboard/manager', { replace: true })
  }, [user, navigate])

  if (!user) return null

  return (
    <DashboardLayout>
      <Routes>
        {/* ALL ADMIN ROUTES — FIXED */}
        <Route path="/overview" element={<AdminDashboard deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
        <Route path="/products" element={<ProductsPanel />} />
        <Route path="/managers" element={<AdminDashboard deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
        <Route path="/drivers" element={<AdminDashboard deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
        <Route path="/orders" element={<AdminDashboard deleteUser={deleteUser} resetUserPassword={resetUserPassword} />} />
        <Route path="/quotes" element={<AdminQuotesPanel />} />
        {/* MANAGER ROUTES */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/my-orders" element={<div className="text-6xl text-center py-32 font-black text-blue-900">My Orders - Coming Soon</div>} />
        
        {/* DEFAULT */}
        <Route path="*" element={<Navigate to={user.role === 'ADMIN' ? '/dashboard/overview' : '/dashboard/manager'} />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App