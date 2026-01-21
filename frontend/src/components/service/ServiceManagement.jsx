// frontend/src/components/service/ServiceManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiscountCodeManagement from '../discount/DiscountCodeManagement';
import { createBooking } from '../../services/bookingService';

const ServiceManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

  // Check if current user is admin for button visibility
  const isAdmin = user && user.role === 'admin';
  const isPhotographer = user && user.services && user.services.includes('photographers');
  console.log('ServiceManagement - User role:', user?.role, 'IsAdmin:', isAdmin, 'IsPhotographer:', isPhotographer, 'UserServices:', user?.services);

  // Mock data
  const mockServices = [
    {
      id: 1,
      name: 'Photography',
      type: 'Photography',
      description: 'Professional photography services for events',
      basePrice: 5000,
      isActive: true,
      duration: '4 hours',
      requirements: 'Professional camera, lighting equipment',
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 2,
      name: 'Event Photography',
      type: 'Photography',
      description: 'Complete event photography coverage',
      basePrice: 8000,
      isActive: true,
      duration: '6 hours',
      requirements: 'Professional camera, multiple lenses',
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 3,
      name: 'Portrait Photography',
      type: 'Photography',
      description: 'Professional portrait photography sessions',
      basePrice: 3000,
      isActive: true,
      duration: '2 hours',
      requirements: 'Studio lighting, backdrops',
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 4,
      name: 'Videography',
      type: 'Videography',
      description: 'Professional video recording and editing',
      basePrice: 8000,
      isActive: true,
      duration: '6 hours',
      requirements: 'Professional camera, video editing software',
      discountEligible: true,
      targetService: 'videographers'
    },
    {
      id: 5,
      name: 'Decoration',
      type: 'Decoration',
      description: 'Event decoration and setup services',
      basePrice: 3000,
      isActive: false,
      duration: '3 hours',
      requirements: 'Decorative materials, setup time',
      discountEligible: true,
      targetService: 'decorators'
    },
    {
      id: 6,
      name: 'DJ Services',
      type: 'Entertainment',
      description: 'Professional DJ and music services',
      basePrice: 4000,
      isActive: true,
      duration: '4 hours',
      requirements: 'Sound system, music library',
      discountEligible: true,
      targetService: 'DJs'
    },
    {
      id: 7,
      name: 'Makeup Services',
      type: 'Beauty',
      description: 'Professional makeup and styling services',
      basePrice: 2500,
      isActive: true,
      duration: '2 hours',
      requirements: 'Makeup kit, styling tools',
      discountEligible: true,
      targetService: 'makeup artists'
    }
  ];

  const mockPackages = [
    {
      id: 1,
      name: 'Photography Basic Package',
      description: 'Essential photography services for small events',
      price: 10000,
      duration: '4 hours',
      includedServices: ['Photography', 'Basic Editing'],
      isActive: true,
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 2,
      name: 'Photography Premium Package',
      description: 'Complete photography coverage for medium events',
      price: 25000,
      duration: '8 hours',
      includedServices: ['Photography', 'Advanced Editing', 'Basic Decoration'],
      isActive: true,
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 3,
      name: 'Photography Luxury Package',
      description: 'Full photography services for large events',
      price: 50000,
      duration: '12 hours',
      includedServices: ['Photography', 'Professional Editing', 'Premium Decoration', 'Assistant'],
      isActive: true,
      discountEligible: true,
      targetService: 'photographers'
    },
    {
      id: 4,
      name: 'Videography Package',
      description: 'Complete video recording and editing services',
      price: 30000,
      duration: '8 hours',
      includedServices: ['Videography', 'Video Editing'],
      isActive: true,
      discountEligible: true,
      targetService: 'videographers'
    },
    {
      id: 5,
      name: 'Decoration Package',
      description: 'Event decoration and setup services',
      price: 15000,
      duration: '6 hours',
      includedServices: ['Decoration', 'Setup'],
      isActive: true,
      discountEligible: true,
      targetService: 'decorators'
    }
  ];

  const mockDiscountCodes = [
    {
      id: 1,
      code: 'PHOTO10',
      type: 'percentage',
      value: 10,
      minAmount: 5000,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 25,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      applicableTo: 'services',
      targetService: 'photographers'
    },
    {
      id: 2,
      code: 'PHOTO20',
      type: 'percentage',
      value: 20,
      minAmount: 10000,
      maxDiscount: 5000,
      usageLimit: 50,
      usedCount: 12,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isActive: true,
      applicableTo: 'packages',
      targetService: 'photographers'
    },
    {
      id: 3,
      code: 'EVENT500',
      type: 'fixed',
      value: 500,
      minAmount: 3000,
      maxDiscount: null,
      usageLimit: 200,
      usedCount: 45,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      isActive: true,
      applicableTo: 'all',
      targetService: 'photographers'
    },
    {
      id: 4,
      code: 'VIDEO15',
      type: 'percentage',
      value: 15,
      minAmount: 8000,
      maxDiscount: 3000,
      usageLimit: 75,
      usedCount: 18,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      applicableTo: 'services',
      targetService: 'videographers'
    }
  ];

  useEffect(() => {
    // Filter services based on user's service type
    const filteredServices = isPhotographer 
      ? mockServices.filter(service => service.targetService === 'photographers')
      : isAdmin 
      ? mockServices 
      : [];
    
    const filteredPackages = isPhotographer
      ? mockPackages.filter(pkg => pkg.targetService === 'photographers')
      : isAdmin
      ? mockPackages
      : [];
    
    const filteredDiscountCodes = isPhotographer
      ? mockDiscountCodes.filter(code => code.targetService === 'photographers')
      : isAdmin
      ? mockDiscountCodes
      : [];

    console.log('Filtering data for user:', {
      userServices: user?.services,
      isPhotographer,
      servicesCount: filteredServices.length,
      packagesCount: filteredPackages.length,
      discountCodesCount: filteredDiscountCodes.length,
      filteredDiscountCodes: JSON.stringify(filteredDiscountCodes, null, 2),
      allDiscountCodes: JSON.stringify(mockDiscountCodes, null, 2)
    });

    setServices(filteredServices);
    setPackages(filteredPackages);
    setDiscountCodes(filteredDiscountCodes);
  }, [user?.services, isPhotographer, isAdmin]);

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const serviceData = {
      name: formData.get('name'),
      type: formData.get('type'),
      description: formData.get('description'),
      basePrice: parseFloat(formData.get('basePrice')),
      isActive: formData.get('isActive') === 'true',
      duration: formData.get('duration'),
      requirements: formData.get('requirements'),
      discountEligible: formData.get('discountEligible') === 'true'
    };

    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === editingService.id ? { ...s, ...serviceData } : s
      ));
      toast.success('Service updated successfully!');
    } else {
      // Create new service
      const newService = {
        id: Date.now(),
        ...serviceData
      };
      setServices([...services, newService]);
      toast.success('Service created successfully!');
    }

    setShowServiceForm(false);
    setEditingService(null);
    e.target.reset();
  };

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const packageData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      duration: formData.get('duration'),
      includedServices: formData.getAll('includedServices'),
      discountEligible: formData.get('discountEligible') === 'true'
    };

    if (editingPackage) {
      // Update existing package
      setPackages(packages.map(p => 
        p.id === editingPackage.id ? { ...p, ...packageData } : p
      ));
      toast.success('Package updated successfully!');
    } else {
      // Create new package
      const newPackage = {
        id: Date.now(),
        ...packageData
      };
      setPackages([...packages, newPackage]);
      toast.success('Package created successfully!');
    }

    setShowPackageForm(false);
    setEditingPackage(null);
    e.target.reset();
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowPackageForm(true);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
      toast.success('Service deleted successfully!');
    }
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(p => p.id !== id));
      toast.success('Package deleted successfully!');
    }
  };

  const handleAddBooking = async (item) => {
    try {
      // Create booking data for the database - matching backend requirements
      // Use valid ObjectIds for both services and packages
      const serviceIdMap = {
        1: '696084c33d7a9dace9f7c48b',  // Photography service
        2: '507f1f1bc8619e35a1c35c9f',  // Videography service  
        3: '507f1f1bc8619e35a1c35c9f',  // Decoration service
        4: '507f1f1bc8619e35a1c35c9f',  // DJ Services
        5: '507f1f1bc8619e35a1c35c9f',  // Makeup Services
        6: '507f1f1bc8619e35a1c35c9f',  // Catering service
        7: '507f1f1bc8619e35a1c35c9f'   // Entertainment service
        8: '507f1f1bc8619e35a1c35c9f'   // Transportation service
      };
      
      const serviceId = serviceIdMap[item.id] || item.id;
      
      // Calculate future date (tomorrow) to satisfy backend validation
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureDate = tomorrow.toISOString().split('T')[0];
      
      const bookingData = {
        service: serviceId, // Use valid ObjectId for the service
        eventType: 'other', // Use 'other' since Photography is not in the allowed enum
        eventDate: futureDate, // Use future date to satisfy backend validation
        eventLocation: 'To be confirmed', // Event location (required by backend)
        guestCount: 50, // Guest count (required by backend)
        specialRequests: `Booking for ${item.name}`, // Special requests (optional)
        specialRequirements: `Booking for ${item.name} - ${item.description}` // Special requirements (optional)
      };
      
      console.log('Creating booking with data:', bookingData);
      console.log('Service ID being sent:', serviceId);
      console.log('User authentication status:', user);
      
      // Create booking in the database using the booking service
      const response = await createBooking(bookingData);
      
      // Show success message - handle different response structures
      const bookingId = response.data?._id || response.data?.data?._id || response.data?._id || 'unknown';
      toast.success(`Booking successfully created for ${item.name}! Booking ID: ${bookingId}`);
      
      // Trigger booking refresh in User Dashboard
      localStorage.setItem('bookingRefreshTrigger', Date.now().toString());
      window.dispatchEvent(new Event('bookingRefresh'));
      
      console.log('Booking created successfully:', response.data);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to create booking: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const toggleServiceStatus = (id) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
    toast.success('Service status updated!');
  };

  const togglePackageStatus = (id) => {
    setPackages(packages.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
    toast.success('Package status updated!');
  };

  const ServiceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full z-50 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn border border-white border-opacity-20">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                <i className="bi bi-gear-fill me-2"></i>
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h3>
              <p className="text-blue-100 text-sm">
                {editingService ? 'Update your service details' : 'Add a new service to your portfolio'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowServiceForm(false);
                setEditingService(null);
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
            >
              <i className="bi bi-x-lg fs-4"></i>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleServiceSubmit} className="p-6">
          <div className="row g-4">
            {/* Service Name */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-tag-fill text-primary me-2"></i>
                Service Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingService?.name || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="Enter service name"
                required
              />
            </div>
            
            {/* Service Type */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-list-ul text-primary me-2"></i>
                Service Type
              </label>
              <select
                name="type"
                defaultValue={editingService?.type || 'Photography'}
                className="form-select form-select-lg border-2 border-primary rounded-lg"
                required
              >
                <option value="">Select Service Type</option>
                <option value="Photography">📸 Photography</option>
                <option value="Videography">🎥 Videography</option>
                <option value="Decoration">🎨 Decoration</option>
                <option value="Catering">🍽️ Catering</option>
                <option value="Entertainment">🎵 Entertainment</option>
                <option value="Transportation">🚗 Transportation</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-text-paragraph text-primary me-2"></i>
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editingService?.description || ''}
                rows={4}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="Describe your service in detail"
                required
              />
            </div>

            {/* Base Price */}
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-currency-rupee text-primary me-2"></i>
                Base Price (₹)
              </label>
              <input
                type="number"
                name="basePrice"
                defaultValue={editingService?.basePrice || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Duration */}
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-clock-fill text-primary me-2"></i>
                Duration
              </label>
              <input
                type="text"
                name="duration"
                defaultValue={editingService?.duration || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="e.g., 4 hours"
                required
              />
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-toggle-on text-primary me-2"></i>
                Status
              </label>
              <select
                name="isActive"
                defaultValue={editingService?.isActive.toString() || 'true'}
                className="form-select form-select-lg border-2 border-primary rounded-lg"
                required
              >
                <option value="true">✅ Active</option>
                <option value="false">❌ Inactive</option>
              </select>
            </div>

            {/* Requirements */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-exclamation-triangle-fill text-primary me-2"></i>
                Requirements
              </label>
              <textarea
                name="requirements"
                defaultValue={editingService?.requirements || ''}
                rows={3}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="List any special requirements or equipment needed"
                required
              />
            </div>

            {/* Discount Eligibility */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-tag-fill text-primary me-2"></i>
                Discount Eligibility
              </label>
              <select
                name="discountEligible"
                defaultValue={editingService?.discountEligible?.toString() || 'true'}
                className="form-select form-select-lg border-2 border-primary rounded-lg"
                required
              >
                <option value="true">✅ Eligible for Discounts</option>
                <option value="false">❌ Not Eligible for Discounts</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
            <button
              type="button"
              onClick={() => {
                setShowServiceForm(false);
                setEditingService(null);
              }}
              className="btn btn-secondary btn-lg px-4 py-2 rounded-pill"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg px-6 py-2 rounded-pill bg-gradient-to-r from-blue-600 to-purple-600 border-0"
            >
              <i className={`bi ${editingService ? 'bi-check-circle-fill' : 'bi-plus-circle-fill'} me-2`}></i>
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const PackageForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full z-50 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn border border-white border-opacity-20">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                <i className="bi bi-gift-fill me-2"></i>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h3>
              <p className="text-purple-100 text-sm">
                {editingPackage ? 'Update your package details' : 'Create an attractive package for customers'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowPackageForm(false);
                setEditingPackage(null);
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
            >
              <i className="bi bi-x-lg fs-4"></i>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handlePackageSubmit} className="p-6">
          <div className="row g-4">
            {/* Package Name */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-box-seam-fill text-primary me-2"></i>
                Package Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingPackage?.name || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="Enter package name"
                required
              />
            </div>
            
            {/* Price */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-currency-rupee text-primary me-2"></i>
                Package Price (₹)
              </label>
              <input
                type="number"
                name="price"
                defaultValue={editingPackage?.price || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-text-paragraph text-primary me-2"></i>
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editingPackage?.description || ''}
                rows={4}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="Describe what's included in this package"
                required
              />
            </div>

            {/* Duration */}
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-clock-fill text-primary me-2"></i>
                Duration
              </label>
              <input
                type="text"
                name="duration"
                defaultValue={editingPackage?.duration || ''}
                className="form-control form-control-lg border-2 border-primary rounded-lg"
                placeholder="e.g., 8 hours"
                required
              />
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-toggle-on text-primary me-2"></i>
                Status
              </label>
              <select
                name="isActive"
                defaultValue={editingPackage?.isActive.toString() || 'true'}
                className="form-select form-select-lg border-2 border-primary rounded-lg"
                required
              >
                <option value="true">✅ Active</option>
                <option value="false">❌ Inactive</option>
              </select>
            </div>

            {/* Discount Eligibility */}
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-tag-fill text-primary me-2"></i>
                Discount Eligibility
              </label>
              <select
                name="discountEligible"
                defaultValue={editingPackage?.discountEligible?.toString() || 'true'}
                className="form-select form-select-lg border-2 border-primary rounded-lg"
                required
              >
                <option value="true">✅ Eligible for Discounts</option>
                <option value="false">❌ Not Eligible for Discounts</option>
              </select>
            </div>

            {/* Included Services */}
            <div className="col-12">
              <label className="form-label fw-bold text-dark">
                <i className="bi bi-check2-square text-primary me-2"></i>
                Included Services
              </label>
              <div className="bg-light p-4 rounded-lg border-2 border-primary">
                <div className="row g-3">
                  {mockServices.map(service => (
                    <div key={service.id} className="col-md-6">
                      <div className="form-check form-check-card border rounded p-3 bg-white">
                        <input
                          type="checkbox"
                          name="includedServices"
                          value={service.name}
                          defaultChecked={editingPackage?.includedServices?.includes(service.name) || false}
                          className="form-check-input me-2"
                          id={`service-${service.id}`}
                        />
                        <label 
                          className="form-check-label fw-medium cursor-pointer w-100" 
                          htmlFor={`service-${service.id}`}
                        >
                          <i className="bi bi-star-fill text-warning me-2"></i>
                          {service.name}
                          <div className="small text-muted">{service.description}</div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
            <button
              type="button"
              onClick={() => {
                setShowPackageForm(false);
                setEditingPackage(null);
              }}
              className="btn btn-secondary btn-lg px-4 py-2 rounded-pill"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg px-6 py-2 rounded-pill bg-gradient-to-r from-purple-600 to-pink-600 border-0"
            >
              <i className={`bi ${editingPackage ? 'bi-check-circle-fill' : 'bi-plus-circle-fill'} me-2`}></i>
              {editingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container-fluid py-4">
        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <h1 className="display-4 fw-bold text-dark mb-3 animate__animated animate__fadeInDown">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Service & Package Management
                </span>
              </h1>
              <p className="lead text-dark animate__animated animate__fadeInUp">
                Manage your premium event services and packages with style
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-8">
              <div className="card bg-white border-0 shadow-lg">
                <div className="card-body p-2">
                  <div className="btn-group w-100" role="group">
                    <button
                      onClick={() => setActiveTab('services')}
                      className={`btn btn-lg flex-fill transition-all duration-300 ${
                        activeTab === 'services'
                          ? 'btn-primary bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105'
                          : 'btn-outline-primary hover:bg-primary hover:bg-opacity-10'
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-gear-fill me-2"></i>
                        <span className="fw-bold">Services</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('packages')}
                      className={`btn btn-lg flex-fill transition-all duration-300 ${
                        activeTab === 'packages'
                          ? 'btn-primary bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg transform scale-105'
                          : 'btn-outline-primary hover:bg-primary hover:bg-opacity-10'
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-box-seam-fill me-2"></i>
                        <span className="fw-bold">Packages</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="container-fluid">
              {/* Create Service Button - Admin Only */}
              {user && user.role === 'admin' && (
                <div className="text-center mb-5">
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="btn btn-primary btn-lg px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white fw-bold rounded-pill shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate__animated animate__pulse animate__infinite"
                  >
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Create New Service
                  </button>
                </div>
              )}

              {/* Services Grid */}
              <div className="row g-4">
                {services.map((service, index) => (
                  <div key={service.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 bg-white border-0 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 animate__animated animate__fadeInUp" 
                         style={{animationDelay: `${index * 100}ms`}}>
                      {/* Gradient Header */}
                      <div className="card-header bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 border-0 p-3" style={{background: 'linear-gradient(to right, #06b6d4, #2563eb, #9333ea)'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title text-white mb-0 fw-bold" style={{color: 'white !important', fontSize: '1.1rem', fontWeight: 'bold'}}>
                            <i className="bi bi-star-fill text-warning me-2"></i>
                            {service.name}
                          </h5>
                          <span className={`badge rounded-pill ${
                            service.isActive 
                              ? 'bg-success text-white' 
                              : 'bg-danger text-white'
                          }`} style={{fontSize: '0.8rem'}}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-body" style={{color: '#212529 !important'}}>
                        <div className="mb-3">
                          <span className="badge bg-info text-white mb-2" style={{backgroundColor: '#17a2b8', color: 'white'}}>
                            <i className="bi bi-tag-fill me-1"></i>{service.type}
                          </span>
                          <p className="text-dark small" style={{color: '#212529 !important', fontSize: '0.9rem'}}>{service.description}</p>
                        </div>
                        
                        <div className="row text-center mb-3">
                          <div className="col-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2 mb-2">
                              <i className="bi bi-currency-rupee d-block fs-4"></i>
                              <span className="fw-bold">{service.basePrice.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-2 mb-2">
                              <i className="bi bi-clock-fill d-block fs-4"></i>
                              <span className="small">{service.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Applicable Discounts */}
                        <div className="mb-3">
                          <h6 className="text-success fw-bold mb-2">
                            <i className="bi bi-tag-fill me-2"></i>Available Discounts
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {discountCodes && discountCodes.length > 0 && discountCodes
                              .filter(code => code.targetService === 'photographers')
                              .slice(0, 2)
                              .map((discount, index) => (
                                <span key={discount.id} className="badge rounded-pill px-2 py-1" style={{background: '#10b981', color: '#000000 !important', fontWeight: 'bold', border: '1px solid #059669'}}>
                                  <i className="bi bi-percent me-1" style={{color: '#000000 !important'}}></i>
                                  <span style={{color: '#000000 !important'}}>{discount.code}</span> - <span style={{color: '#000000 !important'}}>{discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}</span>
                                </span>
                              ))}
                            {discountCodes && discountCodes.filter(code => code.targetService === 'photographers').length > 2 && (
                              <span className="badge bg-secondary text-white rounded-pill px-2 py-1" style={{color: 'black !important'}}>
                                +{discountCodes.filter(code => code.targetService === 'photographers').length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-light rounded-lg p-2 mb-3">
                          <small className="text-dark fw-bold">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Requirements
                          </small>
                          <div className="text-muted small">{service.requirements}</div>
                        </div>
                        
                        {/* Action Buttons - Removed for regular users */}
                        {isAdmin && (
                          <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-sm" onClick={() => handleEditService(service)}>
                              <i className="bi bi-pencil me-1"></i>Edit
                            </button>
                            <button className="btn btn-warning btn-sm" onClick={() => handleToggleServiceStatus(service)}>
                              <i className="bi bi-power me-1"></i>{service.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteService(service.id)}>
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </div>
                        )}
                        
                        {/* Add Booking Button - For all users */}
                        <div className="d-grid gap-2 mt-3">
                          <button className="btn btn-success btn-sm" onClick={() => handleAddBooking(service)}>
                            <i className="bi bi-calendar-plus me-1"></i>Add Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="container-fluid">
              {/* Create Package Button - Admin Only */}
              {user && user.role === 'admin' && (
                <div className="text-center mb-5">
                  <button
                    onClick={() => setShowPackageForm(true)}
                    className="btn btn-primary btn-lg px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white fw-bold rounded-pill shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate__animated animate__pulse animate__infinite"
                  >
                    <i className="bi bi-gift-fill me-2"></i>
                    Create New Package
                  </button>
                </div>
              )}

              {/* Packages Grid */}
              <div className="row g-4">
                {console.log('Rendering packages:', packages.length, packages)}
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 bg-white border-0 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate__animated animate__fadeInUp" 
                         style={{animationDelay: `${index * 150}ms`}}>
                      {/* Special Badge */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge rounded-pill fs-6 ${
                          pkg.isActive 
                            ? 'bg-success text-white shadow-lg' 
                            : 'bg-danger text-white shadow-lg'
                        }`}>
                          <i className={`bi ${pkg.isActive ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Package Header */}
                      <div className="card-header bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 border-0 p-4 text-center" style={{background: 'linear-gradient(to right, #9333ea, #ec4899, #6366f1)'}}>
                        <div className="mb-3">
                          <i className="bi bi-box-seam-fill display-4" style={{color: 'white'}}></i>
                        </div>
                        <h4 className="card-title mb-2 fw-bold" style={{color: 'white !important', fontSize: '1.2rem', fontWeight: 'bold'}}>{pkg.name}</h4>
                        <div className="bg-light rounded-pill px-3 py-1 d-inline-block">
                          <small className="text-dark fw-bold" style={{color: '#212529 !important'}}>
                            <i className="bi bi-clock-fill me-1"></i>{pkg.duration}
                          </small>
                        </div>
                      </div>
                      
                      <div className="card-body" style={{color: '#212529 !important'}}>
                        <div className="text-center mb-4">
                          <div className="display-6 fw-bold text-primary mb-2" style={{color: '#2563eb !important', fontSize: '2rem', fontWeight: 'bold'}}>
                            <i className="bi bi-currency-rupee"></i>
                            {pkg.price.toLocaleString()}
                          </div>
                          <p className="lead" style={{color: '#6c757d !important', fontSize: '1rem'}}>{pkg.description}</p>
                        </div>
                        
                        {/* Applicable Discounts */}
                        <div className="mb-4">
                          <h6 className="text-success fw-bold mb-2">
                            <i className="bi bi-tag-fill me-2"></i>Available Discounts
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {discountCodes && discountCodes.length > 0 && discountCodes
                              .filter(code => code.targetService === 'photographers')
                              .slice(0, 2)
                              .map((discount, index) => (
                                <span key={discount.id} className="badge rounded-pill px-2 py-1" style={{background: '#10b981', color: '#000000 !important', fontWeight: 'bold', border: '1px solid #059669'}}>
                                  <i className="bi bi-percent me-1" style={{color: '#000000 !important'}}></i>
                                  <span style={{color: '#000000 !important'}}>{discount.code}</span> - <span style={{color: '#000000 !important'}}>{discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}</span>
                                </span>
                              ))}
                            {discountCodes && discountCodes.filter(code => code.targetService === 'photographers').length > 2 && (
                              <span className="badge bg-secondary text-white rounded-pill px-2 py-1" style={{color: 'black !important'}}>
                                +{discountCodes.filter(code => code.targetService === 'photographers').length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="text-primary fw-bold mb-3">
                            <i className="bi bi-stars me-2"></i>Package Description
                          </h6>
                          <p className="text-dark small">{pkg.description}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="text-info fw-bold mb-3">
                            <i className="bi bi-check2-square me-2"></i>Included Services
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {pkg.includedServices.map((serviceName, idx) => (
                              <span key={idx} className="badge bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-pill px-3 py-2">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                {serviceName}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons - Removed for regular users */}
                        {isAdmin && (
                          <div className="d-grid gap-2">
                            <div className="btn-group" role="group">
                              <button
                                onClick={() => handleEditPackage(pkg)}
                                className="btn btn-info flex-fill"
                              >
                                <i className="bi bi-pencil-fill"></i> Edit
                              </button>
                              <button
                                onClick={() => togglePackageStatus(pkg.id)}
                                className={`btn flex-fill ${
                                  pkg.isActive ? 'btn-warning' : 'btn-success'
                                }`}
                              >
                                <i className={`bi ${pkg.isActive ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                                {pkg.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="btn btn-danger w-100"
                            >
                              <i className="bi bi-trash-fill"></i> Delete
                            </button>
                          </div>
                        )}
                        
                        {/* Add Booking Button - For all users */}
                        <div className="d-grid gap-2 mt-3">
                          <button className="btn btn-success btn-sm" onClick={() => handleAddBooking(pkg)}>
                            <i className="bi bi-calendar-plus me-1"></i>Add Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forms */}
      {showServiceForm && <ServiceForm />}
      {showPackageForm && <PackageForm />}
    </div>
  );
};

export default ServiceManagement;
