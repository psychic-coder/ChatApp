import moment from "moment";

export const FileFormat = (url = "") => {
  //we are getting hold of the last element from the array we receive after pop
  const fileExt = url.split(".").pop();
  if (fileExt === "mp4" || fileExt === "ogg" || fileExt === "webm")
    return "video";
  if (fileExt === "mp3" || fileExt === "wav") return "audio";
  if (
    fileExt === "png" ||
    fileExt === "jpg " ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

//https://res.cloudinary.com/dammvsknw/image/upload/v1717035994/77ede28b-853d-4515-a999-3f01c9af2764.png
//the above sthe url we reeive from the cloudinary , from the url we'll do the given changes
export const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

export const getLast7Days = () => {
  const currentDate = moment();
  const Last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    Last7Days.unshift(dayName);
  }
  return Last7Days;
};

export const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};
