const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Image = require('../models/Image');
const ErrorResponse = require('../utils/errorResponse');

class UploadService {
  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.mimetype)) {
      throw new ErrorResponse('Please upload a valid image file (jpeg, jpg, png, gif, webp)', 400);
    }

    if (file.size > maxSize) {
      throw new ErrorResponse('Image size should not exceed 5MB', 400);
    }
  }

  async uploadSingleImage(file, folder = 'uploads') {
    this.validateImageFile(file);

    const base64Data = file.buffer.toString('base64');
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    const image = await Image.create({
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: base64Data,
      folder,
    });

    return image;
  }

  async uploadMultipleImages(files, folder = 'uploads') {
    for (const file of files) {
      this.validateImageFile(file);
    }

    const uploadedImages = [];

    for (const file of files) {
      const base64Data = file.buffer.toString('base64');
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;

      const image = await Image.create({
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: base64Data,
        folder,
      });

      uploadedImages.push(image);
    }

    return uploadedImages;
  }

  async getImageById(imageId) {
    const image = await Image.findById(imageId);

    if (!image) {
      throw new ErrorResponse('Image not found', 404);
    }

    return image;
  }

  async getImageInfo(imageId) {
    const image = await Image.findById(imageId).select('-data');

    if (!image) {
      throw new ErrorResponse('Image not found', 404);
    }

    return image;
  }

  async deleteImage(imageId) {
    const image = await Image.findById(imageId);

    if (!image) {
      throw new ErrorResponse('Image not found', 404);
    }

    await image.deleteOne();

    return { message: 'Image deleted successfully' };
  }

  async deleteImageByUrl(imageUrl) {
    if (!imageUrl) {
      throw new ErrorResponse('Please provide an image URL', 400);
    }

    const imageId = imageUrl.split('/').pop();
    const image = await Image.findById(imageId);

    if (!image) {
      throw new ErrorResponse('Image not found', 404);
    }

    await image.deleteOne();

    return { message: 'Image deleted successfully' };
  }

  async deleteMultipleImages(imageIds) {
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      throw new ErrorResponse('Please provide an array of image IDs', 400);
    }

    const result = await Image.deleteMany({ _id: { $in: imageIds } });

    return { deletedCount: result.deletedCount };
  }

  async getAllImages(filters = {}) {
    const { folder, page = 1, limit = 20 } = filters;

    const query = {};
    if (folder) {
      query.folder = folder;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const images = await Image.find(query)
      .select('-data')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Image.countDocuments(query);

    return {
      images,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    };
  }
}

module.exports = new UploadService();
