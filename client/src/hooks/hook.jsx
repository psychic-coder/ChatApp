import { useEffect,useState } from "react";
import { toast } from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || " Something went wrong ");
      }
    });
  }, [errors]);
};

const useAsyncMutation=(mutationHook)=>{

  const [isLoading,setIsLoading]=useState(false);
  const [data,setData]=useState(null);
  const [mutate]=mutationHook();


  const executeMutation=async (toastMessage,...args)=>{
      setIsLoading(true);
      const toastId=toast.loading(toastMessage||" Updating data ...");
      try {
        const res=await  mutate(...args);
        if(res.data){
          //we gave id at the end as this toast will replace the toast of the loading 
         toast.success(  res.data.message ||"Updated data successfully ",{id:toastId});
         setData(res.data)
        }
        else{
         toast.error(res?.error?.data?.message||"Something went wrong ",{id:toastId});
        }
        } catch (error) {
         console.log(error);
         toast.error("Something went wrong ",{id:toastId});
        }finally{
        setIsLoading(false);
      }
  }

  return [executeMutation,isLoading,data];

}

export const useSocketEvents=(socket,handlers)=>{
  useEffect(()=>{
    //Object.entries is a built-in method that returns an array of a given object's own enumerable string-keyed property [key, value] pairs. This method is useful for iterating over the properties of an object in a way that allows you to access both the key and value of each property.
    Object.entries(handlers).forEach(([event,handler])=>{
      socket.on(event,handler);
    })
    

    /*socket.off method is used to remove an event listener that was previously added to a socket. This is useful for cleaning up event listeners to prevent memory leaks, avoid duplicate event handling, or stop listening to specific events when they are no longer needed.*/
    return ()=>{
      Object.entries(handlers).forEach(([event,handler])=>{
        socket.off(event,handler);
       //console.log(a);
      })
    }
  },[socket,handlers])
}


export { useErrors,useAsyncMutation };
