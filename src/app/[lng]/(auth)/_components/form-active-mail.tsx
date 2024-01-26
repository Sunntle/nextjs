"use client"
import { BeatLoader } from "react-spinners";
import CardWrapper from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import verifyEmail from "@/actions/veirifyEmail";
import { IResponseError } from "@/actions/login";
import FormError from "./form-error";
import FormSuccess from "./from-success";
import { useAppState } from "@/contexts/AppContext";
import { useTranslation } from "@/i18n/client";
import { errorCode } from "@/utils/error-code";
const ActiveMailForm = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setSuccess] = useState<IResponseError>({
    message: "",
    status: "",
    code: 0
  });
  const token = searchParams.get("token");
  const {language} = useAppState()
  const {t} = useTranslation(language)
  const handleVerifiEmail = useCallback(async () => {
    if (!token) {
      setSuccess({ status: "error", code: 114 });
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
        message={isSuccess.status == "ok" ? t(`error.${errorCode(isSuccess.code)}`) : ""}
      />
      <FormError
        message={
          (isSuccess.status === "error" ? t(`error.${errorCode(isSuccess.code)}`) : "")
        }
      />
      </div>
    </CardWrapper>
  );
};

export default ActiveMailForm;
