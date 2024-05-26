import multer from "multer";
 const multerUpload = multer({
  //we're only  the limiting the size of the uploads of file we send , we're not using diskstorage as we're gonna store the images in cloud
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatar, attachmentsMulter };

