/* eslint-disable react/display-name */
import { useAppState } from "@/contexts/AppContext";
import { useTranslation } from "@/i18n/client";
import { TFunction } from "i18next";

export type WithBaseMethodProps = {
    t: TFunction<string, undefined>
    [key: string]: any
  };

  function Wrapper<P extends WithBaseMethodProps>(Component: React.ComponentType<P>) {
    const { language } = useAppState();
    const { t } = useTranslation(language);
  
    return (props: Partial<WithBaseMethodProps>) => {
      return (
        <Component
          {...(props as P)}
          t={t}
          lng={language}
        />
      );
    };
  }
export default Wrapper;