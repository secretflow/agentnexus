import { Toaster, TooltipProvider } from "@/components/ui";
import { cn } from "@/lib/utils";
import { constructMetadata } from "@/lib/utils";
import { geistMono, inter, satoshi } from "@/styles/fonts";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import "@/styles/globals.css";
import "tippy.js/themes/light.css";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Global.metadata");
  return constructMetadata({
    title: t("title", { appName: process.env.NEXT_PUBLIC_APP_NAME }),
    description: t("description", {
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    }),
  });
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ViewTransitions>
      <html
        lang={locale}
        className={cn(satoshi.variable, inter.variable, geistMono.variable)}
        suppressHydrationWarning
      >
        <body>
          <NextIntlClientProvider messages={messages}>
            <SessionProvider>
              <TooltipProvider>
                <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="light">
                  {children}
                  <Toaster position="top-center" offset={10} />
                </ThemeProvider>
              </TooltipProvider>
            </SessionProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
