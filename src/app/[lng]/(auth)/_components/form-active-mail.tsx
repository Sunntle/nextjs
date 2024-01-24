import { BeatLoader } from "react-spinners";
import CardWrapper from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import verifyEmail from "@/actions/veirifyEmail";
import { IResponseError } from "@/actions/login";
import FormError from "./form-error";
import FormSuccess from "./from-success";
const ActiveMailForm = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    status: "",
  });
  const token = searchParams.get("token");
  const handleVerifiEmail = useCallback(async () => {
    if (!token) {
      setSuccess({ status: "error", message: "Missing Token" });
      return;
    }
    const isSuccess = await verifyEmail(token);
    setSuccess(isSuccess);
  }, [token]);

  useEffect(() => {
    handleVerifiEmail();
  }, [handleVerifiEmail]);
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButton={{ label: "Back to login", href: "/login" }}
      showSocial={false}
    >
      <div className="text-center">
      {isSuccess.status == "" && <BeatLoader />}
      <FormSuccess
        message={isSuccess.status == "ok" ? isSuccess.message : ""}
      />
      <FormError
        message={
          (isSuccess.status === "error" ? isSuccess.message : "")
        }
      />
      </div>
    </CardWrapper>
  );
};

export default ActiveMailForm;
