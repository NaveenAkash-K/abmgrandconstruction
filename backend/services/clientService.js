const Client = require('../models/Client');
const ErrorResponse = require('../utils/errorResponse');

class ClientService {
  async getAllClients(filters = {}) {
    const { active } = filters;
    let query = {};

    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });

    return clients;
  }

  async getClientById(clientId) {
    const client = await Client.findById(clientId);

    if (!client) {
      throw new ErrorResponse(`Client not found with id of ${clientId}`, 404);
    }

    return client;
  }

  async createClient(clientData) {
    const { name, logo, isActive } = clientData;

    const client = await Client.create({
      name,
      logo,
      isActive: isActive !== undefined ? isActive : true,
    });

    return client;
  }

  async updateClient(clientId, clientData) {
    const { name, logo, isActive } = clientData;

    let client = await Client.findById(clientId);

    if (!client) {
      throw new ErrorResponse(`Client not found with id of ${clientId}`, 404);
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (logo !== undefined) updateFields.logo = logo;
    if (isActive !== undefined) updateFields.isActive = isActive;

    client = await Client.findByIdAndUpdate(clientId, updateFields, {
      new: true,
      runValidators: true,
    });

    return client;
  }

  async deleteClient(clientId) {
    const client = await Client.findById(clientId);

    if (!client) {
      throw new ErrorResponse(`Client not found with id of ${clientId}`, 404);
    }

    await client.deleteOne();

    return { message: 'Client deleted successfully' };
  }

  async toggleClientStatus(clientId) {
    let client = await Client.findById(clientId);

    if (!client) {
      throw new ErrorResponse(`Client not found with id of ${clientId}`, 404);
    }

    client = await Client.findByIdAndUpdate(
      clientId,
      { isActive: !client.isActive },
      { new: true }
    );

    return client;
  }
}

module.exports = new ClientService();
