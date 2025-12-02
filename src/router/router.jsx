import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayout";
import Home from "../pages/Home/Home";
 
 
 

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children:[
        {
            index:true,
            Component: Home
        },
        {
          path:"*",
          element:<div className="text-error">404 Not Found</div>
        }
    ]
    
  },
]);