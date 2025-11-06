import React, { useState, useEffect, useMemo } from 'react'


// Heroicons
import {
  ChartBarIcon,
  UsersIcon,
  TruckIcon,
  Cog6ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

// Mock data for charts and analytics
const generateChartData = () => ({
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [45000, 52000, 48000, 61000, 72000, 68000]
  },
  orders: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [45, 52, 48, 61, 72, 68]
  },
  users: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12, 18, 25, 30, 42, 50]
  }
})

// Mock data for managers and drivers
const initialManagers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@ndaje.rw',
    phone: '+250788123456',
    status: 'active',
    dateAdded: '2024-01-15',
    managedOrders: 45
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@ndaje.rw',
    phone: '+250788654321',
    status: 'locked',
    dateAdded: '2024-02-10',
    managedOrders: 23
  }
]

const initialDrivers = [
  {
    id: 1,
    name: 'David Brown',
    email: 'david@ndaje.rw',
    phone: '+250788111222',
    vehicle: 'Toyota Hilux - RAA123A',
    status: 'active',
    dateAdded: '2024-01-20',
    completedDeliveries: 34
  },
  {
    id: 2,
    name: 'Emma Wilson',
    email: 'emma@ndaje.rw',
    phone: '+250788333444',
    vehicle: 'Mitsubishi L200 - RAB456B',
    status: 'active',
    dateAdded: '2024-02-05',
    completedDeliveries: 28
  }
]

const initialOrders = [
  {
    id: 1,
    orderCode: 'NDJ1A2B3C',
    clientName: 'Hotel Rwanda',
    items: 5,
    total: 245000,
    status: 'processing',
    manager: 'Alice Johnson',
    driver: 'David Brown',
    date: '2024-03-15'
  },
  {
    id: 2,
    orderCode: 'NDJ4D5E6F',
    clientName: 'Kigali Marriott',
    items: 8,
    total: 420000,
    status: 'delivered',
    manager: 'Alice Johnson',
    driver: 'Emma Wilson',
    date: '2024-03-14'
  }
]

function AdminDashboard() {
  
  const [activeTab, setActiveTab] = useState('overview')
  const [managers, setManagers] = useState(initialManagers)
  const [drivers, setDrivers] = useState(initialDrivers)
  const [orders, setOrders] = useState(initialOrders)
  const [showAddManager, setShowAddManager] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // New user forms
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: ''
  })

  const chartData = useMemo(() => generateChartData(), [])

  // Stats calculations
  const stats = useMemo(() => ({
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    activeManagers: managers.filter(m => m.status === 'active').length,
    activeDrivers: drivers.filter(d => d.status === 'active').length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length
  }), [orders, managers, drivers])

  const toggleManagerStatus = (managerId) => {
    setManagers(prev => prev.map(manager =>
      manager.id === managerId
        ? { ...manager, status: manager.status === 'active' ? 'locked' : 'active' }
        : manager
    ))
  }

  const toggleDriverStatus = (driverId) => {
    setDrivers(prev => prev.map(driver =>
      driver.id === driverId
        ? { ...driver, status: driver.status === 'active' ? 'locked' : 'active' }
        : driver
    ))
  }

  const addManager = () => {
    const manager = {
      id: managers.length + 1,
      ...newManager,
      status: 'active',
      dateAdded: new Date().toISOString().split('T')[0],
      managedOrders: 0
    }
    setManagers(prev => [...prev, manager])
    setNewManager({ name: '', email: '', phone: '' })
    setShowAddManager(false)
  }

  const addDriver = () => {
    const driver = {
      id: drivers.length + 1,
      ...newDriver,
      status: 'active',
      dateAdded: new Date().toISOString().split('T')[0],
      completedDeliveries: 0
    }
    setDrivers(prev => [...prev, driver])
    setNewDriver({ name: '', email: '', phone: '', vehicle: '' })
    setShowAddDriver(false)
  }

  const deleteManager = (managerId) => {
    setManagers(prev => prev.filter(manager => manager.id !== managerId))
  }

  const deleteDriver = (driverId) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId))
  }

  // Filtered data based on search
  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter(order =>
    order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 truncate">
           
              </p>
              <p className="text-xs text-blue-600 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : 
               activeTab === 'managers' ? 'Operations Managers' :
               activeTab === 'drivers' ? 'Delivery Drivers' :
               activeTab === 'orders' ? 'Order Management' : 'Settings'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'overview' ? 'Monitor your business performance and analytics' :
               activeTab === 'managers' ? 'Manage operations managers and their permissions' :
               activeTab === 'drivers' ? 'Manage delivery drivers and their assignments' :
               activeTab === 'orders' ? 'Track and manage all customer orders' : 'System configuration and settings'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Revenue',
                  value: `RWF ${stats.totalRevenue.toLocaleString()}`,
                  icon: CurrencyDollarIcon,
                  color: 'green',
                  change: '+12%'
                },
                {
                  title: 'Total Orders',
                  value: stats.totalOrders.toString(),
                  icon: ShoppingCartIcon,
                  color: 'blue',
                  change: '+8%'
                },
                {
                  title: 'Active Managers',
                  value: stats.activeManagers.toString(),
                  icon: UserGroupIcon,
                  color: 'purple',
                  change: '+5%'
                },
                {
                  title: 'Active Drivers',
                  value: stats.activeDrivers.toString(),
                  icon: TruckIcon,
                  color: 'orange',
                  change: '+15%'
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-2 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {chartData.revenue.data.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-500 mb-2">
                        {chartData.revenue.labels[index]}
                      </div>
                      <div
                        className="bg-blue-500 rounded-t-lg w-full max-w-12 transition-all hover:bg-blue-600"
                        style={{ height: `${(value / 80000) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">
                        RWF {(value / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
                  <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {chartData.orders.data.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-500 mb-2">
                        {chartData.orders.labels[index]}
                      </div>
                      <div
                        className="bg-green-500 rounded-t-lg w-full max-w-12 transition-all hover:bg-green-600"
                        style={{ height: `${(value / 80) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">{value} orders</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
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
                        <p className="font-medium text-gray-900">{order.orderCode}</p>
                        <p className="text-sm text-gray-500">{order.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">RWF {order.total.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
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
              <button
                onClick={() => setShowAddManager(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
              >
                <PlusIcon className="w-4 h-4" />
                Add Manager
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredManagers.map((manager) => (
                <div key={manager.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleManagerStatus(manager.id)}
                        className={`p-2 rounded-lg ${
                          manager.status === 'active' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {manager.status === 'active' ? (
                          <LockOpenIcon className="w-4 h-4" />
                        ) : (
                          <LockClosedIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteManager(manager.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg">{manager.name}</h3>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      {manager.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      {manager.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      {manager.managedOrders} orders managed
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      manager.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {manager.status}
                    </span>
                    <span className="text-xs text-gray-500">Added {manager.dateAdded}</span>
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
              <button
                onClick={() => setShowAddDriver(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
              >
                <PlusIcon className="w-4 h-4" />
                Add Driver
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <TruckIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDriverStatus(driver.id)}
                        className={`p-2 rounded-lg ${
                          driver.status === 'active' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {driver.status === 'active' ? (
                          <LockOpenIcon className="w-4 h-4" />
                        ) : (
                          <LockClosedIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteDriver(driver.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      {driver.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      {driver.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TruckIcon className="w-4 h-4" />
                      {driver.vehicle}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {driver.completedDeliveries} deliveries
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manager
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-900">{order.orderCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.clientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">RWF {order.total.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.manager}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.driver}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Manager Modal */}
      {showAddManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Manager</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter manager name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newManager.phone}
                  onChange={(e) => setNewManager(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddManager(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addManager}
                disabled={!newManager.name || !newManager.email || !newManager.phone}
                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Driver</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter driver name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                <input
                  type="text"
                  value={newDriver.vehicle}
                  onChange={(e) => setNewDriver(prev => ({...prev, vehicle: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Enter vehicle details"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddDriver(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addDriver}
                disabled={!newDriver.name || !newDriver.email || !newDriver.phone || !newDriver.vehicle}
                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard