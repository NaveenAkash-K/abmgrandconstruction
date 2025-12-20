const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');

class ServiceService {
  async getAllServices(filters = {}) {
    const { active } = filters;
    let query = {};

    if (active === 'true') {
      query.isActive = true;
    }

    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

    return services;
  }

  async getServiceById(serviceId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new ErrorResponse(`Service not found with id of ${serviceId}`, 404);
    }

    return service;
  }

  async createService(serviceData) {
    const service = await Service.create(serviceData);
    return service;
  }

  async updateService(serviceId, serviceData) {
    let service = await Service.findById(serviceId);

    if (!service) {
      throw new ErrorResponse(`Service not found with id of ${serviceId}`, 404);
    }

    service = await Service.findByIdAndUpdate(serviceId, serviceData, {
      new: true,
      runValidators: true,
    });

    return service;
  }

  async deleteService(serviceId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new ErrorResponse(`Service not found with id of ${serviceId}`, 404);
    }

    await service.deleteOne();

    return { message: 'Service deleted successfully' };
  }
}

module.exports = new ServiceService();
