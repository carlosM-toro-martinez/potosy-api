const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const deleteImageOnError = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      const filePath = req?.file?.path;
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (deleteError) {
          console.error('Error deleting image:', deleteError);
        }
      }
      return next(err);
    }
    next();
  });
};
const upload = multer({ storage });

module.exports = { upload, deleteImageOnError };
