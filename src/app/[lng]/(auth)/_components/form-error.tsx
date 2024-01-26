import { BsExclamationCircleFill } from "react-icons/bs"; 
interface FormProps {
    message: string
}
const FormError = ({message}: FormProps) => {
    if(!message) return null;
    return <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-3text-destructive-foreground text-sm">
        <BsExclamationCircleFill className="h-4 w-4"/>
        {message}
    </div>;
}
 
export default FormError;