const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');

class ContactService {
  async getContact() {
    const contact = await Contact.findOne();
    return contact;
  }

  async createContact(data) {
    const {
      streetAddress,
      cityAndZip,
      country,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      businessHoursWeekdays,
      businessHoursSaturday,
      businessHoursSunday,
    } = data;

    const existingContact = await Contact.findOne();
    if (existingContact) {
      throw new ErrorResponse('Contact information already exists. Please update instead.', 400);
    }

    const contact = await Contact.create({
      streetAddress,
      cityAndZip,
      country,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      businessHoursWeekdays,
      businessHoursSaturday,
      businessHoursSunday,
    });

    return contact;
  }

  async updateContact(data) {
    const {
      streetAddress,
      cityAndZip,
      country,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      businessHoursWeekdays,
      businessHoursSaturday,
      businessHoursSunday,
    } = data;

    let contact = await Contact.findOne();

    if (!contact) {
      throw new ErrorResponse('Contact information not found', 404);
    }

    const updateFields = {};
    if (streetAddress !== undefined) updateFields.streetAddress = streetAddress;
    if (cityAndZip !== undefined) updateFields.cityAndZip = cityAndZip;
    if (country !== undefined) updateFields.country = country;
    if (primaryPhone !== undefined) updateFields.primaryPhone = primaryPhone;
    if (secondaryPhone !== undefined) updateFields.secondaryPhone = secondaryPhone;
    if (primaryEmail !== undefined) updateFields.primaryEmail = primaryEmail;
    if (secondaryEmail !== undefined) updateFields.secondaryEmail = secondaryEmail;
    if (businessHoursWeekdays !== undefined) updateFields.businessHoursWeekdays = businessHoursWeekdays;
    if (businessHoursSaturday !== undefined) updateFields.businessHoursSaturday = businessHoursSaturday;
    if (businessHoursSunday !== undefined) updateFields.businessHoursSunday = businessHoursSunday;

    contact = await Contact.findByIdAndUpdate(contact._id, updateFields, {
      new: true,
      runValidators: true,
    });

    return contact;
  }

  async deleteContact() {
    const contact = await Contact.findOne();

    if (!contact) {
      throw new ErrorResponse('Contact information not found', 404);
    }

    await contact.deleteOne();

    return { message: 'Contact information deleted successfully' };
  }
}

module.exports = new ContactService();
