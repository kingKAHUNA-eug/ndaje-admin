import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import axios from 'axios'
import {
  ChartBarIcon, UsersIcon, TruckIcon, Cog6ToothIcon, PlusIcon,
  MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon,
  LockClosedIcon, LockOpenIcon, ClipboardDocumentListIcon,
  ShoppingCartIcon, CurrencyDollarIcon, UserGroupIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL

// ==================== ADMIN LOGIN ====================
function AdminLogin() {
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
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      const user = res.data.data?.user || res.data.user

      if (res.data.success && user?.role === 'ADMIN') {
        localStorage.setItem('adminToken', res.data.data?.token || res.data.token)
        localStorage.setItem('adminUser', JSON.stringify(user))
        navigate('/dashboard')
      } else {
        setError('UNAUTHORIZED. ONLY THE KING MAY ENTER.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'ACCESS DENIED')
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
          <p className="text-sm text-gray-500 mt-4">Administrative Access Only</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sign in to Admin Panel</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="admin@ndaje.rw"
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
              className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
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

// ==================== ADMIN DASHBOARD (100% REAL) ====================
function AdminDashboard() {
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

  const token = localStorage.getItem('adminToken')

  // FETCH ALL REAL DATA
  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [manRes, driRes, ordRes] = await Promise.all([
          axios.get(`${API_URL}/admin/managers`, { headers }),
          axios.get(`${API_URL}/admin/drivers`, { headers }),
          axios.get(`${API_URL}/admin/orders`, { headers })
        ])

        setManagers(manRes.data.data || [])
        setDrivers(driRes.data.data || [])
        setOrders(ordRes.data.data || [])

        const revenue = ordRes.data.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
        setStats({
          totalRevenue: revenue,
          totalOrders: ordRes.data.data?.length || 0,
          activeManagers: manRes.data.data?.filter(m => m.status === 'active').length || 0,
          activeDrivers: driRes.data.data?.filter(d => d.status === 'active').length || 0
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
      const res = await axios.post(`${API_URL}/admin/create-manager`, newManager, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setManagers(prev => [...prev, res.data.data.user])
      setShowAddManager(false)
      setNewManager({ name: '', email: '', phone: '', password: '' })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create manager')
    }
  }

  const createDriver = async () => {
    try {
      const res = await axios.post(`${API_URL}/admin/create-driver`, newDriver, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDrivers(prev => [...prev, res.data.data.user])
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
    o.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : 
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

        {/* Overview */}
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
                    <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderCode || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.clientName || 'Unknown Client'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">RWF {order.total?.toLocaleString() || 0}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
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

        {/* Managers Tab */}
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
                <div key={manager._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{manager.name}</h3>
                  <div className="space-y-2 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {manager.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {manager.phone}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {manager.status || 'active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drivers Tab */}
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
                <div key={driver._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <TruckIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                  <div className="space-y-2 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {driver.email}</div>
                    <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {driver.phone}</div>
                    <div className="flex items-center gap-2"><TruckIcon className="w-4 h-4" /> {driver.vehicle || 'No vehicle'}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status || 'active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-900">{order.orderCode || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.clientName || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">RWF {order.total?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
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

        {/* Add Manager Modal */}
        {showAddManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Manager</h3>
              <div className="space-y-4">
                <input placeholder="Name" value={newManager.name} onChange={e => setNewManager(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Email" value={newManager.email} onChange={e => setNewManager(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Phone" value={newManager.phone} onChange={e => setNewManager(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input type="password" placeholder="Password" value={newManager.password} onChange={e => setNewManager(prev => ({...prev, password: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddManager(false)} className="flex-1 px-4 py-2 border rounded-xl">Cancel</button>
                <button onClick={createManager} className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl">Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Driver Modal */}
        {showAddDriver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Driver</h3>
              <div className="space-y-4">
                <input placeholder="Name" value={newDriver.name} onChange={e => setNewDriver(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Email" value={newDriver.email} onChange={e => setNewDriver(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Phone" value={newDriver.phone} onChange={e => setNewDriver(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input type="password" placeholder="Password" value={newDriver.password} onChange={e => setNewDriver(prev => ({...prev, password: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
                <input placeholder="Vehicle (e.g. Toyota Hiace - RAB 123 A)" value={newDriver.vehicle} onChange={e => setNewDriver(prev => ({...prev, vehicle: e.target.value}))}
                  className="w-full px-4 py-3 border rounded-xl" />
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

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/" replace />
}

// ==================== MAIN APP ====================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}