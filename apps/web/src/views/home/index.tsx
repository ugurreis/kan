import Image from "next/image";
import { t } from "@lingui/core/macro";
import { useTheme } from "next-themes";

import Button from "~/components/Button";
import { PageHead } from "~/components/PageHead";
import { BRAND_NAME, BRAND_TITLE_SUFFIX } from "~/lib/brand";
import Cta from "./components/Cta";
import FAQs from "./components/Faqs";
import Features from "./components/Features";
import Layout from "./components/Layout";

export default function HomeView() {
  const { resolvedTheme } = useTheme();

  return (
    <Layout>
      <PageHead
        title={`${BRAND_TITLE_SUFFIX} | Sade, tamamen Türkçe Kanban`}
      />
      <div className="flex h-full w-full flex-col lg:pt-[5rem]">
        <div className="w-full pb-10 pt-32 lg:py-32">
          <div className="my-10 flex h-full w-full animate-fade-down flex-col items-center justify-center px-4">
            <div className="flex items-center gap-2">
              <div className="relative animate-fade-in overflow-hidden rounded-full bg-gradient-to-b from-light-300 to-light-400 p-[2px] dark:from-dark-300 dark:to-dark-400">
                <div className="gradient-border absolute inset-0 animate-border-spin" />
                <div className="relative z-10 rounded-full bg-light-50 px-4 py-1 text-center text-xs text-light-1000 dark:bg-dark-50 dark:text-dark-1000 lg:text-sm">
                  {t`Tamamen Türkçe · Sade · Ekibiniz için`}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-4xl font-bold text-light-1000 dark:text-dark-1000 lg:text-5xl">
              {t`Ekibiniz için sade, Türkçe görev yönetimi`}
            </p>

            <p className="text-md mt-3 max-w-[450px] text-center text-light-950 dark:text-dark-900 lg:max-w-[600px] lg:text-lg">
              {t`Panolar, listeler ve kartlarla işlerinizi düzenleyin, ilerlemeyi takip edin ve ekibinizle birlikte sonuç alın. Karmaşa yok, İngilizce menü yok.`}
            </p>

            <div className="mt-6 flex gap-2">
              <Button href="/signup">{t`Hemen başla`}</Button>
              <Button variant="secondary" href="/login">
                {t`Giriş yap`}
              </Button>
            </div>
          </div>
        </div>
        <div className="px-4 pb-10">
          <div className="rounded-[16px] border border-light-300 bg-light-50 p-1 shadow-md dark:border-dark-300 dark:bg-dark-100 lg:rounded-[24px] lg:p-2">
            <div className="relative overflow-hidden rounded-[12px] border border-light-300 shadow-sm dark:border-dark-300 lg:rounded-[16px]">
              <Image
                src={`/hero-light.png`}
                alt={BRAND_NAME}
                width={1520}
                height={640}
                priority
                className="block dark:hidden"
              />
              <Image
                src={`/hero-dark.png`}
                alt={BRAND_NAME}
                width={1520}
                height={640}
                priority
                className="hidden dark:block"
              />
            </div>
          </div>
        </div>
        <div className="relative pt-10">
          <div id="features" className="absolute -top-20" />
          <Features theme={resolvedTheme === "dark" ? "dark" : "light"} />
        </div>
        <div className="relative pt-10">
          <div id="faq" className="absolute -top-20" />
          <FAQs />
        </div>
        <div className="relative">
          <Cta />
        </div>
      </div>
    </Layout>
  );
}
