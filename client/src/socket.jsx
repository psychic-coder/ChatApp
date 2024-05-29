import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { server } from "./constants/config";

//createContext is a function that creates a Context object. This Context object allows you to pass data through the component tree without having to pass props down manually at every level. It is part of React's Context API, which is used to share state across many components without prop drilling.

/*Creating Context:

You create a context using createContext, which returns a Context object with two components: a Provider and a Consumer.
The Provider component is used to pass the data to its descendants.
The Consumer component is used to access the data provided by the Provider.
Provider Component:
The Provider component takes a value prop and makes this value available to all of its child components.
Any component within the Provider can access this value through the Consumer or the useContext hook.
Consumer Component:
*/

const SocketContext = createContext();

//we can use the SocketContext using getSocket ;
const getSocket = () => useContext(SocketContext);

//whenever we have to use this hook we will use <SocketProvider></SocketProvider> as wrapper tag , and all the thing written inside it will be its children
const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => io(server, { withCredentials: true }),
    []
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { getSocket, SocketProvider };
/*SocketProvider can be used to wrap parts of the component tree that need access to the socket.
getSocket can be used in functional components to access the socket instance.*/
