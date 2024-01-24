import { BsCheckCircleFill } from "react-icons/bs"; 
interface FormProps {
    message: string
}
const FormSuccess = ({message}: FormProps) => {
    if(!message) return null;
    return <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-3 text-emerald-500 text-sm">
        <BsCheckCircleFill className="h-4 w-4"/>
        {message}
    </div>;
}
 
export default FormSuccess;