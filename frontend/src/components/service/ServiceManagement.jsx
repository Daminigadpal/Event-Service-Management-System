// frontend/src/components/service/ServiceManagement.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

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
      requirements: 'Professional camera, lighting equipment'
    },
    {
      id: 2,
      name: 'Videography',
      type: 'Videography',
      description: 'Professional video recording and editing',
      basePrice: 8000,
      isActive: true,
      duration: '6 hours',
      requirements: 'Professional camera, video editing software'
    },
    {
      id: 3,
      name: 'Decoration',
      type: 'Decoration',
      description: 'Event decoration and setup services',
      basePrice: 3000,
      isActive: false,
      duration: '3 hours',
      requirements: 'Decorative materials, setup time'
    }
  ];

  const mockPackages = [
    {
      id: 1,
      name: 'Basic Package',
      description: 'Essential services for small events',
      price: 10000,
      duration: '4 hours',
      includedServices: ['Photography', 'Basic Decoration'],
      isActive: true
    },
    {
      id: 2,
      name: 'Premium Package',
      description: 'Complete services for medium events',
      price: 25000,
      duration: '8 hours',
      includedServices: ['Photography', 'Videography', 'Premium Decoration'],
      isActive: true
    },
    {
      id: 3,
      name: 'Luxury Package',
      description: 'Full services for large events',
      price: 50000,
      duration: '12 hours',
      includedServices: ['Photography', 'Videography', 'Decoration', 'Catering'],
      isActive: false
    }
  ];

  useEffect(() => {
    setServices(mockServices);
    setPackages(mockPackages);
  }, []);

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
      requirements: formData.get('requirements')
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
      includedServices: formData.getAll('includedServices')
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
            <div className="col-12">
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
            <div className="col-md-6">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container-fluid py-4">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <h1 className="display-4 fw-bold text-white mb-3 animate__animated animate__fadeInDown">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                  Service & Package Management
                </span>
              </h1>
              <p className="lead text-light animate__animated animate__fadeInUp">
                Manage your premium event services and packages with style
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-8">
              <div className="card bg-dark bg-opacity-50 backdrop-blur-lg border-0 shadow-2xl">
                <div className="card-body p-2">
                  <div className="btn-group w-100" role="group">
                    <button
                      onClick={() => setActiveTab('services')}
                      className={`btn btn-lg flex-fill transition-all duration-300 ${
                        activeTab === 'services'
                          ? 'btn-primary bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105'
                          : 'btn-outline-light hover:bg-white hover:bg-opacity-10'
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
                          : 'btn-outline-light hover:bg-white hover:bg-opacity-10'
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
              {/* Create Service Button */}
              <div className="text-center mb-5">
                <button
                  onClick={() => setShowServiceForm(true)}
                  className="btn btn-primary btn-lg px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white fw-bold rounded-pill shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate__animated animate__pulse animate__infinite"
                >
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create New Service
                </button>
              </div>

              {/* Services Grid */}
              <div className="row g-4">
                {services.map((service, index) => (
                  <div key={service.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 bg-white bg-opacity-90 backdrop-blur-md border-0 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 animate__animated animate__fadeInUp border border-white border-opacity-30" 
                         style={{animationDelay: `${index * 100}ms`}}>
                      {/* Gradient Header */}
                      <div className="card-header bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 border-0 p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title text-white mb-0 fw-bold">
                            <i className="bi bi-star-fill text-warning me-2"></i>
                            {service.name}
                          </h5>
                          <span className={`badge rounded-pill ${
                            service.isActive 
                              ? 'bg-success bg-opacity-90 text-white' 
                              : 'bg-danger bg-opacity-90 text-white'
                          }`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-body text-white">
                        <div className="mb-3">
                          <span className="badge bg-info bg-opacity-25 text-info mb-2">
                            <i className="bi bi-tag-fill me-1"></i>{service.type}
                          </span>
                          <p className="text-light small">{service.description}</p>
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
                        
                        <div className="bg-warning bg-opacity-20 rounded-lg p-2 mb-3">
                          <small className="text-warning fw-bold">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Requirements
                          </small>
                          <p className="small text-light mb-0">{service.requirements}</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                          <div className="btn-group" role="group">
                            <button
                              onClick={() => handleEditService(service)}
                              className="btn btn-info flex-fill"
                            >
                              <i className="bi bi-pencil-fill"></i> Edit
                            </button>
                            <button
                              onClick={() => toggleServiceStatus(service.id)}
                              className={`btn flex-fill ${
                                service.isActive ? 'btn-warning' : 'btn-success'
                              }`}
                            >
                              <i className={`bi ${service.isActive ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                              {service.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="btn btn-danger w-100"
                          >
                            <i className="bi bi-trash-fill"></i> Delete
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
              {/* Create Package Button */}
              <div className="text-center mb-5">
                <button
                  onClick={() => setShowPackageForm(true)}
                  className="btn btn-primary btn-lg px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white fw-bold rounded-pill shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate__animated animate__pulse animate__infinite"
                >
                  <i className="bi bi-gift-fill me-2"></i>
                  Create New Package
                </button>
              </div>

              {/* Packages Grid */}
              <div className="row g-4">
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 border-0 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate__animated animate__fadeInUp" 
                         style={{animationDelay: `${index * 150}ms`}}>
                      {/* Special Badge */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge rounded-pill fs-6 ${
                          pkg.isActive 
                            ? 'bg-success bg-opacity-90 text-white shadow-lg' 
                            : 'bg-danger bg-opacity-90 text-white shadow-lg'
                        }`}>
                          <i className={`bi ${pkg.isActive ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Package Header */}
                      <div className="card-header bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 border-0 p-4 text-center">
                        <div className="mb-3">
                          <i className="bi bi-box-seam-fill display-4 text-white"></i>
                        </div>
                        <h4 className="card-title text-white mb-2 fw-bold">{pkg.name}</h4>
                        <div className="bg-white bg-opacity-20 rounded-pill px-3 py-1 d-inline-block">
                          <small className="text-white fw-bold">
                            <i className="bi bi-clock-fill me-1"></i>{pkg.duration}
                          </small>
                        </div>
                      </div>
                      
                      <div className="card-body text-white">
                        <div className="text-center mb-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3 mb-3">
                            <span className="display-6 fw-bold text-dark">₹{pkg.price.toLocaleString()}</span>
                            <div className="small text-dark fw-bold">Total Package Price</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="text-warning fw-bold mb-3">
                            <i className="bi bi-stars me-2"></i>Package Description
                          </h6>
                          <p className="text-light small">{pkg.description}</p>
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
                        
                        {/* Action Buttons */}
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
