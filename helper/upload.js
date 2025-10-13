import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads');
    },
    filename: function (req, file, cb) {
        console.log(req.body);
        const timeStamp = Date.now();
        cb(null, `${file.fieldname}-${file.originalname}-${req.body.course_code}${path.extname(file.originalname)}`);
    }
});

const acceptableFileFormats = ["pdf", "png", "mp4", "jpeg", "vnd.ms-excel", "vnd.openxmlformats-officedocument.spreadsheetml.sheet", "msword", "vnd.openxmlformats-officedocument.wordprocessingml.document", "vnd.ms-powerpoint", "vnd.openxmlformats-officedocument.presentationml.presentation"];

export const uploadDoc = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(req.body);
        const type = file.mimetype.split('/')
        if (type[1] === "pdf" || "png" || "mp4" || "jpeg" || "vnd.ms-excel" || "vnd.openxmlformats-officedocument.spreadsheetml.sheet" || "msword" || "vnd.openxmlformats-officedocument.wordprocessingml.document" || "vnd.ms-powerpoint" || "vnd.openxmlformats-officedocument.presentationml.presentation") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Only PDFs, Word Docs, Excel spreadsheets, mp4 videos, images and PowerPoint slides accepted'));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
}).array('Course_Materials', 5);
