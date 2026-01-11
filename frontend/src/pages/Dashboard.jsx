// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with actual API calls
const mockData = {
  totalBookings: 128,
  upcomingEvents: [
    { id: 1, name: 'Wedding Reception', date: '2023-06-15', status: 'Confirmed' },
    { id: 2, name: 'Corporate Conference', date: '2023-06-20', status: 'Pending' },
  ],
  revenue: {
    monthly: 12500,
    quarterly: 38750,
    yearly: 145000,
  },
  staffAssignments: [
    { name: 'John Doe', assigned: 8, completed: 5 },
    { name: 'Jane Smith', assigned: 6, completed: 6 },
    { name: 'Mike Johnson', assigned: 7, completed: 4 },
  ],
  servicePerformance: [
    { name: 'Catering', bookings: 45, revenue: 22500, rating: 4.5 },
    { name: 'Venue', bookings: 32, revenue: 32000, rating: 4.2 },
    { name: 'Entertainment', bookings: 28, revenue: 19600, rating: 4.7 },
  ],
};

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API call
        // const response = await api.get('/dashboard');
        // setDashboardData(response.data);
        
        // Using mock data for now
        setDashboardData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Event Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/service-management')}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Service Management
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {dashboardData.totalBookings}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {dashboardData.upcomingEvents.length}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${dashboardData.revenue.monthly.toLocaleString()}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Staff</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {dashboardData.staffAssignments.length}
                </dd>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
              </div>
              <div className="bg-white overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.upcomingEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="mb-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Revenue Summary</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      ${dashboardData.revenue.monthly.toLocaleString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 truncate">Quarterly</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      ${dashboardData.revenue.quarterly.toLocaleString()}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500 truncate">Yearly</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                      ${dashboardData.revenue.yearly.toLocaleString()}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Assignments and Service Performance */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Staff-wise Assignments */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Staff-wise Assignments</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {dashboardData.staffAssignments.map((staff, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">{staff.name}</span>
                        <span className="text-gray-500">{staff.completed}/{staff.assigned} completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(staff.completed / staff.assigned) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service-wise Performance */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Service-wise Performance</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {dashboardData.servicePerformance.map((service, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{service.name}</span>
                        <span className="text-sm text-gray-500">${service.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{service.bookings} bookings</span>
                        <span>Rating: {service.rating}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(service.bookings / Math.max(...dashboardData.servicePerformance.map(s => s.bookings))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;