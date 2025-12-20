const WhyChooseUs = require('../models/WhyChooseUs');
const ErrorResponse = require('../utils/errorResponse');

class WhyChooseUsService {
  async getAllWhyChooseUs(filters = {}) {
    const { limit } = filters;

    let queryBuilder = WhyChooseUs.find({}).sort({ displayOrder: 1 });

    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const whyChooseUs = await queryBuilder;

    return whyChooseUs;
  }

  async getWhyChooseUsById(id) {
    const whyChooseUs = await WhyChooseUs.findById(id);

    if (!whyChooseUs) {
      throw new ErrorResponse(`Why Choose Us item not found with id of ${id}`, 404);
    }

    return whyChooseUs;
  }

  async createWhyChooseUs(data) {
    const { title, icon, order, description } = data;

    if (!title || !description || !icon) {
      throw new ErrorResponse('Please provide title, description and icon', 400);
    }

    let orderValue = order;
    if (orderValue === undefined || orderValue === null) {
      const lastItem = await WhyChooseUs.findOne().sort({ order: -1 });
      orderValue = lastItem ? lastItem.order + 1 : 0;
    }

    const whyChooseUs = await WhyChooseUs.create({
      title,
      icon,
      order: orderValue,
      description,
    });

    return whyChooseUs;
  }

  async updateWhyChooseUs(id, data) {
    const { title, icon, displayOrder, description } = data;

    let whyChooseUs = await WhyChooseUs.findById(id);

    if (!whyChooseUs) {
      throw new ErrorResponse(`Why Choose Us item not found with id of ${id}`, 404);
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (icon !== undefined) updateFields.icon = icon;
    if (displayOrder !== undefined) updateFields.displayOrder = displayOrder;
    if (description !== undefined) updateFields.description = description;

    whyChooseUs = await WhyChooseUs.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    return whyChooseUs;
  }

  async deleteWhyChooseUs(id) {
    const whyChooseUs = await WhyChooseUs.findById(id);

    if (!whyChooseUs) {
      throw new ErrorResponse(`Why Choose Us item not found with id of ${id}`, 404);
    }

    await whyChooseUs.deleteOne();

    return { message: 'Why Choose Us item deleted successfully' };
  }

  async reorderWhyChooseUs(items) {
    if (!items || !Array.isArray(items)) {
      throw new ErrorResponse('Please provide an array of items with id and displayOrder', 400);
    }

    for (const item of items) {
      if (!item.id || item.displayOrder === undefined) {
        throw new ErrorResponse('Each item must have an id and displayOrder', 400);
      }
    }

    const updatePromises = items.map((item) =>
      WhyChooseUs.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }, { new: true })
    );

    await Promise.all(updatePromises);

    const whyChooseUs = await WhyChooseUs.find().sort({ displayOrder: 1 });

    return whyChooseUs;
  }
}

module.exports = new WhyChooseUsService();
