import multer from "multer";
 const multerUpload = multer({
  //we're only uploading the limiting the size of the multer file we need , we're not using diskstorage as we're gonna store the images in cloud
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatar, attachmentsMulter };

