import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import { BsExclamationCircleFill } from "react-icons/bs";

const ErrorPage = () => {
  return (
    <CardWrapper
      headerLabel="Error"
      backButton={{ label: "Back to login?", href: "/login" }}
    >
      <div className="flex items-center justify-center gap-x-2 text-red-600">
        <BsExclamationCircleFill className="h-4 w-4" />
        <h4>Ops! Something went wrong</h4>
      </div>
    </CardWrapper>
  );
};

export default ErrorPage;
