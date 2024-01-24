'use client'
import { ICommonProps } from "@/types/paramsProps";
import LoginForm from "../_components/login-form";
import LoginFormServerAction from "../_components/login-form-server";

const Login = () => {
    return ( <div><LoginForm/></div> );
    // return <LoginFormServerAction/>
}
 
export default Login;