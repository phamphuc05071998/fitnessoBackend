const handlerFactory = require("./../Controllers/handlerFactory");
const GymCourse = require("./../Models/gymCourseModel");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const multerStorage = multer.memoryStorage();
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});
exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `course-${req.file.originalname}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(800, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/img/${req.file.filename}`);
  req.body.image = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/img/${req.file.filename}`;
  next();
});
exports.uploadImage = upload.single("image");

exports.getAllCourse = handlerFactory.getAll(GymCourse);
exports.getOneCourse = handlerFactory.getOne(GymCourse);
exports.createOneCourse = handlerFactory.createOne(GymCourse);
exports.deleteOneCourse = handlerFactory.deleteOne(GymCourse);
exports.updateOneCourse = handlerFactory.updateOne(GymCourse);
