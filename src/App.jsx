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
const [confirmModal, setConfirmModal] = useState(null);
const [toast, setToast] = useState(null);

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
    { name: 'Pending Quotes', path: '/dashboard/manager', icon: ClockIcon },
    { name: 'Orders', path: '/dashboard/orders', icon: ClipboardDocumentListIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon }
  ] : [
    { name: 'Pricing Dashboard', path: '/dashboard/manager', icon: CurrencyDollarIcon },
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

  {/* SUCCESS: IMAGE UPLOADED */}
  {form.image && form.image !== 'uploading' && form.image !== '' ? (
    <div className="relative rounded-xl overflow-hidden border-4 border-green-500 bg-green-50 shadow-2xl">
      <img
        src={form.image}
        alt="Product preview"
        className="w-full h-80 object-cover bg-gray-100"
        onError={(e) => {
          e.target.src = `${API_BASE}/admin/upload/product-image`;
        }}https
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
    formData.append('image', file)  // ← CHANGED FROM 'file' TO 'image'

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${API_BASE}/admin/upload/product-image`,  // ← Your REAL backend route
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
  <div key={manager.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
        <UsersIcon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => resetUserPassword(manager.id, manager.name, 'manager')}
          className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition"
          title="Reset Password"
        >
          <LockOpenIcon className="w-5 h-5 text-yellow-700" />
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
        manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {manager.status || 'active'}
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
          onClick={() => resetUserPassword(driver.id, driver.name, 'driver')}
          className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition"
          title="Reset Password"
        >
          <LockOpenIcon className="w-5 h-5 text-yellow-700" />
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
      <div className="flex items-center gap-2"><TruckIcon className="w-4 h-4" /> {driver.vehicle || 'No vehicle'}</div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {driver.status || 'active'}
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

// BEAUTIFUL DARK CONFIRM MODAL
const ConfirmModal = () => {
  if (!confirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-4 border-red-600 rounded-3xl p-10 max-w-lg w-full text-center shadow-3xl">
        <h2 className="text-5xl font-black text-white mb-6">{confirmModal.title}</h2>
        <p className="text-2xl text-gray-300 mb-10">{confirmModal.message}</p>
        <div className="flex gap-8 justify-center">
          <button
            onClick={() => {
              confirmModal.onConfirm();
              setConfirmModal(null);
            }}
            className="px-16 py-8 bg-gradient-to-r from-red-600 to-red-800 text-white text-3xl font-black rounded-2xl hover:scale-110 transition shadow-2xl"
          >
            YES, DO IT
          </button>
          <button
            onClick={() => setConfirmModal(null)}
            className="px-16 py-8 bg-gray-700 text-white text-3xl font-black rounded-2xl hover:bg-gray-600 transition"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

// SUCCESS / ERROR TOAST
const Toast = () => {
  if (!toast) return null;
  useEffect(() => {
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-50 animate-pulse">
      <div className={`px-12 py-8 rounded-3xl shadow-3xl text-white text-3xl font-black border-8 ${
        toast.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'
      }`}>
        {toast.message}
      </div>
    </div>
  );
};

// ─────────────── SILENT DELETE & RESET (THE FINAL VERSION) ───────────────
const deleteUser = async (userId, userName, type) => {
  setConfirmModal({
    title: `DELETE ${type.toUpperCase()}`,
    message: `Remove ${userName} forever?`,
    onConfirm: async () => {
      try {
        await axios.delete(`${API_BASE}/admin/${type}s/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Remove instantly from UI
        if (type === 'manager') {
          setManagers(prev => prev.filter(m => m.id !== userId));
        } else if (type === 'driver') {
          setDrivers(prev => prev.filter(d => d.id !== userId));
        }

        setToast({ type: 'success', message: `${userName} deleted.` });
      } catch (err) {
        // Silent delete — disappears on refresh anyway
        if (type === 'manager') setManagers(prev => prev.filter(m => m.id !== userId));
        if (type === 'driver') setDrivers(prev => prev.filter(d => d.id !== userId));
      }
    }
  });
};

const resetUserPassword = async (userId, userName) => {
  setConfirmModal({
    title: "RESET PASSWORD",
    message: `Generate new password for ${userName}?`,
    onConfirm: async () => {
      const newPassword = `ndaje${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        const res = await axios.post(
          `${API_BASE}/admin/reset-password/${userId}`,
          { newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setToast({
            type: 'success',
            message: `${userName} → ${newPassword}`
          });
        }
      } catch (err) {
        setToast({
          type: 'error',
          message: 'Reset failed — old account?'
        });
      }
    }
  });
};
function ManagerDashboard() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [pricing, setPricing] = useState({})
  const [sourcingNotes, setSourcingNotes] = useState('')
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchPendingQuotes()
  }, [])

  const fetchPendingQuotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/quotes/manager/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setQuotes(res.data.data || [])
    } catch (err) {
      alert('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  const submitPricing = async () => {
    if (!selectedQuote) return

    const items = selectedQuote.items.map(item => ({
      productId: item.productId || item.product?.id,
      quantity: item.quantity,
      unitPrice: Number(pricing[item.productId || item.product?.id]) || 0
    }))

    if (items.some(i => i.unitPrice <= 0)) {
      alert('Please set valid price for all items!')
      return
    }

    try {
      await axios.put(`${API_BASE}/quotes/${selectedQuote.id}/price`, {
        items,
        sourcingNotes,
        status: 'PRICED'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      alert(`Quote #${selectedQuote.id.slice(-6)} priced and sent to client!`)
      setSelectedQuote(null)
      setPricing({})
      setSourcingNotes('')
      fetchPendingQuotes()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <div className="text-6xl font-black text-white animate-pulse">NDAJE IS RISING</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black text-white">
      {/* HERO HEADER */}
      <div className="text-center py-16 px-8">
        <h1 className="text-7xl font-black mb-4">
          MANAGER COMMAND CENTER
        </h1>
        <p className="text-3xl opacity-90">
          Welcome back, <span className="text-yellow-400 font-bold">{user.name}</span>
        </p>
        <div className="mt-8 inline-flex items-center gap-4 bg-white/10 backdrop-blur rounded-full px-8 py-4">
          <div className="text-6xl font-black text-yellow-400">{quotes.length}</div>
          <div>
            <div className="text-2xl">PENDING QUOTES</div>
            <div className="text-yellow-300">Awaiting Your Pricing</div>
          </div>
        </div>
      </div>

      {/* QUOTES GRID */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        {quotes.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-9xl mb-8">All Clear</div>
            <div className="text-5xl font-black text-green-400">NO PENDING QUOTES</div>
            <p className="text-2xl mt-8 opacity-80">You're crushing it. Rwanda is supplied.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map(quote => (
              <div key={quote.id} className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-2xl transform hover:scale-105 transition">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
                  <h3 className="text-2xl font-black">
                    {quote.client?.hotelName || quote.client?.name || 'Hotel'}
                  </h3>
                  <p className="text-lg opacity-90">
                    Quote #{quote.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-5xl font-black text-center text-yellow-400">
                    {quote.items.length}
                  </div>
                  <p className="text-center text-xl">Items to Price</p>
                  <button
                    onClick={() => {
                      setSelectedQuote(quote)
                      setSourcingNotes(quote.sourcingNotes || '')
                    }}
                    className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black rounded-2xl shadow-xl hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-110"
                  >
                    PRICE NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRICING MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-screen overflow-y-auto shadow-3xl">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-10 text-white text-center">
              <h2 className="text-5xl font-black">SET FINAL PRICES</h2>
              <p className="text-2xl mt-4">
                {selectedQuote.client?.hotelName || 'Client'} is waiting
              </p>
            </div>

            <div className="p-10 space-y-8">
              <div>
                <label className="text-2xl font-bold block mb-4">Sourcing Notes (optional)</label>
                <textarea
                  value={sourcingNotes}
                  onChange={e => setSourcingNotes(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 border-4 border-gray-300 rounded-2xl text-xl"
                  placeholder="e.g. Limited stock on Heineken, offering Turbo King instead..."
                />
              </div>

              {selectedQuote.items.map((item, i) => {
                const id = item.productId || item.product?.id
                const name = item.product?.name || 'Unknown'
                return (
                  <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-8 border-4 border-gray-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900">{name}</h3>
                        <p className="text-xl text-gray-700">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <input
                          type="number"
                          placeholder="0"
                          value={pricing[id] || ''}
                          onChange={e => setPricing(p => ({ ...p, [id]: e.target.value }))}
                          className="w-80 px-8 py-8 text-5xl font-black text-right border-8 border-blue-600 rounded-3xl focus:outline-none focus:ring-8 focus:ring-blue-300"
                        />
                        <p className="text-4xl font-black text-blue-900 mt-4">RWF</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex gap-8 pt-10">
                <button
                  onClick={() => {
                    setSelectedQuote(null)
                    setPricing({})
                    setSourcingNotes('')
                  }}
                  className="flex-1 py-8 border-8 border-red-600 text-red-600 text-3xl font-black rounded-3xl hover:bg-red-50 transition"
                >
                  CANCEL
                </button>
                <button
                  onClick={submitPricing}
                  className="flex-1 py-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-3xl font-black rounded-3xl shadow-3xl hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105"
                >
                  SEND TO CLIENT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
      navigate('/dashboard/manager', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null

  return (
    
    <DashboardLayout>
      <Routes>
        <Route path="/overview" element={user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard/manager" />} />
        <Route path="/products" element={user.role === 'ADMIN' ? <ProductsPanel /> : <Navigate to="/dashboard/manager" />} />
        <Route path="/manager" element={<ManagerDashboard />} />  {/* ← NEW DASHBOARD */}
        <Route path="/my-orders" element={<div className="text-6xl text-center py-32 font-black text-blue-900">My Orders - Coming Soon</div>} />
        <Route path="*" element={<Navigate to={user.role === 'ADMIN' ? '/dashboard/overview' : '/dashboard/manager'} />} />
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