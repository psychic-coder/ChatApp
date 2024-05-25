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


export const transformImage=(url="",width=100)=>url


export const getLast7Days=()=>{
  const currentDate=moment();
  const Last7Days=[];
  for(let i=0;i<7;i++){
   const dayDate=currentDate.clone().subtract(i,"days");
    const dayName=dayDate.format("dddd");
    Last7Days.unshift(dayName);
  }
  return Last7Days;
}