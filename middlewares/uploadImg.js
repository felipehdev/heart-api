const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src");
    },
    filename: (req, file, cb) => {
      const uniquePreffix = Date.now().toString();
      cb(null, uniquePreffix + "-" + file.originalname);
    },
    fileFilter: (req, file, cb) => { 
        const extension = [ 'image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp' ].find(formatoAceito => formatoAceito == file.mimetype);

        if (extension) {
            return cb(null, true);
        }
        return cb(null, false);
    },
    
  }),
});
