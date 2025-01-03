import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BlurImage } from "./";

export async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("/login.page");
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-5">
      <div className="col-span-1 flex min-h-screen flex-col items-center justify-between border-gray-200 border-r bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur sm:col-span-3">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="mb-8 font-bold text-3xl text-black dark:text-white">{appName}</h1>
          <div className="w-full max-w-md overflow-hidden border-gray-200 border-y sm:rounded-2xl sm:border sm:shadow-sm">
            <div className="border-gray-200 border-b bg-white pt-8 pb-6 text-center">
              <h3 className="font-semibold text-lg">{t("title", { appName })}</h3>
            </div>
            <div className="grid gap-3 bg-gray-50 px-4 py-8 sm:px-16">
              <Suspense>{children}</Suspense>
            </div>
          </div>
        </div>
        <div className="grid gap-2 pt-4 pb-8">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {appName} Technologies, Inc.
          </p>
          <div className="flex gap-3 text-center text-gray-500 text-xs underline underline-offset-2">
            <a href="#" target="_blank" className="hover:text-gray-800">
              隐私政策
            </a>
            <a href="#" target="_blank" className="hover:text-gray-800">
              服务条款
            </a>
          </div>
        </div>
      </div>
      <div className="hidden h-full flex-col justify-center space-y-12 overflow-hidden md:col-span-2 md:flex">
        <div className="ml-12 h-1/2 w-[112%] rounded-xl border border-gray-200 p-2 shadow-xl">
          <BlurImage
            alt="Dub.co Analytics"
            src="/_static/ai.jpg"
            width={1773}
            height={1182}
            priority
            className="h-full rounded-lg border border-gray-200 object-cover"
          />
        </div>
        {/* <a
          href="https://dub.co/customers"
          target="_blank"
          className="animate-infinite-scroll flex items-center space-x-4"
        >
          {logos.map((logo, idx) => (
            <BlurImage
              alt={`${logo} logo`}
              key={idx}
              src={`https://dub.co/_static/clients/${logo}.svg`}
              width={520}
              height={182}
              className="h-12 grayscale transition-all hover:grayscale-0"
            />
          ))}
        </a> */}
      </div>
    </div>
  );
}
