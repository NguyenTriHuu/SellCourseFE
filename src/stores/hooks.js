import Context from "./Context";
import { useContext } from "react";

  export const useStore=()=>{
    return useContext(Context)
  }
