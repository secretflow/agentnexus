import { AuthLayout } from "@/components/layout";
import { constructMetadata } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next/types";
import LoginForm from "./form";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("/login.metadata");
  return constructMetadata({
    title: t("title", { appName: process.env.NEXT_PUBLIC_APP_NAME }),
  });
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
