const uploadMiddleware = require("./UploadAvatar");

const dynamicUpload = (req, res, next) => {
  let folder = "others";

  if (req.path.includes("/user/upload")) folder = "avatars";
  if (req.path.includes("/product/upload")) folder = "products";

  return uploadMiddleware(folder).single("file")(req, res, next);
};

module.exports = dynamicUpload;
