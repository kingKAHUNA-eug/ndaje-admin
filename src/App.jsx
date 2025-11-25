// Auto-fix double slash and double /api
const API_BASE = import.meta.env.VITE_API_URL
  .replace(/\/+$/, '')           // remove trailing slashes
  .replace(/\/api\/api/, '/api') // fix double /api
  .replace(/\/\/auth/, '/auth')  // fix double slash
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
  CubeIcon
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL

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
    { name: 'Pending Quotes', path: '/dashboard/quotes', icon: ClockIcon },
    { name: 'Orders', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon }
  ] : [
    { name: 'Pending Quotes', path: '/dashboard/quotes', icon: ClockIcon },
    { name: 'My Orders', path: '/dashboard/my-orders', icon: CheckCircleIcon }
  ]

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

  {form.image ? (
    <div className="relative rounded-xl overflow-hidden border-4 border-green-500 bg-green-50">
      <img src={form.image} alt="Preview" className="w-full h-80 object-cover" />
      <button
        type="button"
        onClick={() => setForm(f => ({ ...f, image: '' }))}
        className="absolute top-4 right-4 bg-red-600 text-white w-12 h-12 rounded-full text-2xl font-bold shadow-lg hover:bg-red-700"
      >
        X
      </button>
    </div>
  ) : (
    <button
 
  onClick={() => {
    // THIS FIXES EVERYTHING — AUTO-WAIT + AUTO-RETRY
    const openWidget = () => {
      if (window.cloudinary?.openUploadWidget) {
        window.cloudinary.openUploadWidget(
          {
            cloudName: "dzjsdgqegf",
            uploadPreset: "ndaje-products",
            sources: ["local", "camera", "url"],
            cropping: true,
            multiple: false,
            folder: "ndaje-products",
            clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
          },
          (error, result) => {
            if (!error && result?.event === "success") {
              setForm(f => ({ ...f, image: result.info.secure_url }))
            }
          }
        )
      } else {
        // Script not ready yet — wait and retry
        setTimeout(openWidget, 300)
      }
    }

    openWidget()
  }}
  className="w-full h-80 border-4 border-dashed border-blue-600 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 transition-all cursor-pointer text-blue-900 font-bold text-2xl shadow-xl"
>
  <div className="text-center">
    <div className="text-6xl mb-4">Upload Photo</div>
    <div className="text-xl text-blue-700 font-bold">Click • Drag & Drop • Camera</div>
    <div className="text-sm text-blue-600 mt-4">Real photos for Rwanda's finest hotels</div>
  </div>
</button>
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
// YOUR ORIGINAL ADMIN DASHBOARD — 100% UNTOUCHED
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
      const res = await axios.post(`${API_BASE}/admin/create-manager`, newManager, {
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
      const res = await axios.post(`${API_BASE}/admin/create-driver`, newDriver, {
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

function ManagerQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_BASE}/manager/quotes/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setQuotes(res.data.data || [])
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchQuotes()
  }, [])

  const approveQuote = async (quoteId, prices) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE}/manager/quotes/${quoteId}/price`, { prices }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQuotes(prev => prev.filter(q => q.id !== quoteId))
      alert('Quote approved successfully!')
    } catch (err) {
      alert('Failed to approve quote')
    }
  }

  if (loading) return <div className="text-center py-20 text-3xl font-black text-blue-900">Loading Quotes...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Pending Quotes to Price</h1>
      {quotes.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl">No pending quotes</div>
      ) : (
        <div className="space-y-10">
          {quotes.map(quote => (
            <div key={quote.id} className="bg-white rounded-2xl shadow-xl p-8 border">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">{quote.client?.hotelName || quote.client?.name}</h3>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5" /> {quote.client?.phone}
                  </p>
                </div>
                <span className="px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full font-bold">PENDING</span>
              </div>
              <QuotePricingForm quote={quote} onApprove={approveQuote} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuotePricingForm({ quote, onApprove }) {
  const [prices, setPrices] = useState({})

  const handleSubmit = () => {
    const pricedItems = Object.entries(prices).map(([productId, price]) => ({
      productId,
      finalPrice: Number(price)
    }))
    if (pricedItems.length !== quote.items.length) {
      alert('Please price all items!')
      return
    }
    onApprove(quote.id, pricedItems)
  }

  return (
    <>
      <div className="space-y-6">
        {quote.items.map(item => (
          <div key={item.productId} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xl font-bold">{item.product?.name}</p>
              <p className="text-gray-600">Quantity: {item.quantity} {item.product?.unit}</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="0"
                className="w-48 px-6 py-4 border-2 border-blue-300 rounded-xl text-right text-2xl font-bold"
                onChange={e => setPrices(p => ({ ...p, [item.productId]: e.target.value }))}
              />
              <span className="text-2xl font-bold text-gray-700">RWF</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-right">
        <button
          onClick={handleSubmit}
          className="px-16 py-5 bg-blue-900 text-white text-xl font-bold rounded-xl hover:bg-blue-800 shadow-xl"
        >
          APPROVE & CREATE ORDER
        </button>
      </div>
    </>
  )
}

function ProtectedDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
    } else if (user.role === 'ADMIN') {
      navigate('/dashboard/overview', { replace: true })
    } else if (user.role === 'MANAGER') {
      navigate('/dashboard/quotes', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/overview" element={user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard/quotes" />} />
        <Route path="/products" element={user.role === 'ADMIN' ? <ProductsPanel /> : <Navigate to="/dashboard/quotes" />} />
        <Route path="/quotes" element={<ManagerQuotes />} />
        <Route path="/my-orders" element={<div className="text-center py-32"><h1 className="text-4xl font-bold text-blue-900">My Orders</h1><p className="text-xl text-gray-600 mt-4">Coming soon</p></div>} />
        <Route path="*" element={<Navigate to={user.role === 'ADMIN' ? '/dashboard/overview' : '/dashboard/quotes'} />} />
      </Routes>
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<ProtectedDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}