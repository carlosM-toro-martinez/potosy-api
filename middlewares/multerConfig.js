const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const furtherOptimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const imagePath = req.file.path;
    const tempImagePath = imagePath.replace(/\.(\w+)$/, '_temp.$1'); // Nombre de archivo temporal

    await sharp(imagePath)
      .resize({ width: 800, height: 600, fit: 'inside' })
      .toFile(tempImagePath);

    await fs.rename(tempImagePath, imagePath);

    next();
  } catch (error) {
    console.error('Error durante la optimización adicional de la imagen:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const imagePath = req.file.path;
    const tempImagePath = imagePath.replace(/\.(\w+)$/, '_temp.$1'); // Nombre de archivo temporal

    await sharp(imagePath)
      .resize({ width: 400, height: 300, fit: 'inside' })
      .toFile(tempImagePath);

    await fs.rename(tempImagePath, imagePath);

    next();
  } catch (error) {
    console.error('Error durante la optimización de la imagen:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteImageOnError = async (req, res, next) => {
  try {
    await upload.single('image')(req, res);
    await optimizeImage(req, res, next);
  } catch (err) {
    const filePath = req?.file?.path;
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }
    next(err);
  }
};

module.exports = { upload, deleteImageOnError, optimizeImage, furtherOptimizeImage };
