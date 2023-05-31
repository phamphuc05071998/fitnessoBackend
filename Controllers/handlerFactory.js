const catchAsync = require("./../utils/catchAsync");
const APIFeature = require("./../utils/APIFeature");

exports.getAll = (modal) => {
  return catchAsync(async (req, res, next) => {
    const feature = new APIFeature(modal.find(), req.query);
    feature.exclude().sort().limitFields().pagination();
    const data = await feature.query;

    if (!data) return next("Can not find and doc", 400);
    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });
};
exports.getOne = (modal) => {
  return catchAsync(async (req, res, next) => {
    const data = await modal.findById(req.params.id);
    if (!data) return next("Can not find and doc", 400);

    res.status(200).json({
      status: "success",
      data,
    });
  });
};
exports.deleteOne = (modal) => {
  return catchAsync(async (req, res, next) => {
    await modal.findOneAndDelete({ _id: req.params.id });
    res.status(204).json({
      message: "success",
    });
  });
};
exports.updateOne = (modal) => {
  return catchAsync(async (req, res, next) => {
    const data = await modal.findByIdAndUpdate(req.params.id, req.body);
    if (!data) return next("Can not find and doc", 400);

    res.status(200).json({
      status: "success",
      data,
    });
  });
};
exports.createOne = (modal) => {
  return catchAsync(async (req, res, next) => {
    const data = await modal.create(req.body);
    res.status(201).json({
      status: "success",
      data,
    });
  });
};
