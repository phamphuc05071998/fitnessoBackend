const express = require("express");
const gymCourseController = require("./../Controllers/gymCourseController");

const router = express.Router();
router
  .route("/")
  .get(gymCourseController.getAllCourse)
  .post(
    gymCourseController.uploadImage,
    gymCourseController.resizeImage,
    gymCourseController.createOneCourse
  );
router
  .route("/:id")
  .get(gymCourseController.getOneCourse)
  .delete(gymCourseController.deleteOneCourse)
  .patch(gymCourseController.updateOneCourse);

module.exports = router;
