const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const furtherOptimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const imagePath = req.file.path;
    const tempImagePath = imagePath.replace(/\.(\w+)$/, '_temp.$1');

    await sharp(imagePath)
      .resize({ width: 800, height: 600, fit: 'inside' })
      .toFile(tempImagePath);

    await fs.rename(tempImagePath, imagePath);

    next();
  } catch (error) {
    console.error(
      'Error durante la optimización adicional de la imagen:',
      error
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const imagePath = req.file.path;
    const tempImagePath = imagePath.replace(/\.(\w+)$/, '_temp.$1');

    await sharp(imagePath)
      .resize({ width: 800, height: 600, fit: 'inside' })
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
    const imageId = req.params.name;
    const imagePath = path.join(__dirname, '..', 'uploads', imageId);
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      await fs.unlink(imagePath);
      console.log('Image deleted successfully:', imagePath);
    } else {
      console.log('Image not found:', imagePath);
    }

    next();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  upload,
  deleteImageOnError,
  optimizeImage,
  furtherOptimizeImage,
};
