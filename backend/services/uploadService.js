const { v4: uuidv4 } = require('uuid');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const supabase = require('../config/supabase');

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

    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new ErrorResponse(`Failed to upload image: ${error.message}`, 500);
    }

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async uploadMultipleImages(files, folder = 'uploads') {
    for (const file of files) {
      this.validateImageFile(file);
    }

    const uploadedImages = [];

    for (const file of files) {
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      const filePath = `${folder}/${filename}`;

      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new ErrorResponse(`Failed to upload image: ${error.message}`, 500);
      }

      const { data: urlData } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);

      uploadedImages.push({
        url: urlData.publicUrl,
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    }

    return uploadedImages;
  }

  extractPathFromUrl(imageUrl) {
    if (!imageUrl) return null;
    const parts = imageUrl.split('/public/' + process.env.SUPABASE_BUCKET_NAME + '/');
    return parts.length > 1 ? parts[1] : null;
  }

  async deleteImageByUrl(imageUrl) {
    if (!imageUrl) {
      throw new ErrorResponse('Please provide an image URL', 400);
    }

    const filePath = this.extractPathFromUrl(imageUrl);

    if (!filePath) {
      throw new ErrorResponse('Invalid image URL format', 400);
    }

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new ErrorResponse(`Failed to delete image from storage: ${error.message}`, 500);
    }

    return { message: 'Image deleted successfully' };
  }


  async deleteMultipleImagesByUrls(imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new ErrorResponse('Please provide an array of image URLs', 400);
    }

    const filePaths = imageUrls
      .map(url => this.extractPathFromUrl(url))
      .filter(path => path !== null);

    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .remove(filePaths);

      if (error) {
        throw new ErrorResponse(`Failed to delete images from storage: ${error.message}`, 500);
      }
    }

    return { deletedCount: filePaths.length };
  }

}

module.exports = new UploadService();
