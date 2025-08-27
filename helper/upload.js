import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const timeStamp = Date.now();
        cb(null, `${file.fieldname}-${file.originalname}-${req.body.course_code}${path.extname(file.originalname)}`);
    }
});

export const uploadDoc = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        const type = file.mimetype.split('/')
        if (type[0] === 'pdf' || "docs" || "image" || "pptx") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Only PDFs, Word Docs, images and PowerPoint slides accepted'));
        }
    },
    limits: {
        fileSize: 1024 * 1024
    }
}).single('Course_Material');