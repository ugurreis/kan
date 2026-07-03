import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { HiMiniMinusSmall, HiMiniPlusSmall } from "react-icons/hi2";

import { BRAND_CONTACT_EMAIL, BRAND_NAME } from "~/lib/brand";

const Text = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-[14px] leading-[1.7rem] text-light-800 dark:text-dark-800">
      {children}
    </p>
  );
};

const Faqs = () => {
  const faqs = [
    {
      question: t`${BRAND_NAME} nedir?`,
      answer: (
        <Text>
          {t`${BRAND_NAME}, ekiplerin işlerini panolar, listeler ve kartlarla düzenlemesini sağlayan sade, tamamen Türkçe bir Kanban görev yönetimi uygulamasıdır. Amacımız, karmaşık araçların yükü olmadan hızlıca kullanmaya başlayabileceğiniz bir deneyim sunmak.`}
        </Text>
      ),
    },
    {
      question: t`Sıfırdan mı başlamam gerekiyor?`,
      answer: (
        <Text>
          {t`Hayır. Yeni pano oluştururken "Şablon kullan" seçeneğiyle Satış Pipeline, İçerik Takvimi, Yazılım Geliştirme, Müşteri Destek gibi 10 hazır Türkçe şablondan birini seçip saniyeler içinde çalışmaya başlayabilirsiniz. Sütunlar ve etiketler sizin için önceden hazırlanır.`}
        </Text>
      ),
    },
    {
      question: t`Panolarımı başka bir uygulamadan taşıyabilir miyim?`,
      answer: (
        <Text>
          {t`Trello ve GitHub Projects için uygulama içindeki "İçe aktar" bölümünden doğrudan aktarım yapabilirsiniz (bu bağlantıların kurulumunuzda etkinleştirilmiş olması gerekir). Asana, Monday, Notion gibi diğer araçlardaki panoları ise ya bir hazır şablonla yeniden kurabilir ya da verinizi önce Trello'ya alıp oradan taşıyabilirsiniz. Geçiş konusunda destek için bizimle iletişime geçebilirsiniz.`}
        </Text>
      ),
    },
    {
      question: t`Verilerim nerede saklanıyor?`,
      answer: (
        <Text>
          {t`Verileriniz size tahsis edilen kurulumda barındırılır ve sizde kalır. Kişisel verilerin işlenmesine ilişkin ayrıntılar Gizlilik Politikamızda açıklanmıştır.`}
        </Text>
      ),
    },
    {
      question: t`Ekip üyelerini nasıl davet ederim?`,
      answer: (
        <Text>
          {t`Çalışma alanınızın "Üyeler" sayfasından üyelerin e-posta adreslerini girerek davet gönderebilirsiniz. Davet edilen kişiler, çalışma alanına katılmak için bir bağlantı içeren e-posta alır.`}
        </Text>
      ),
    },
    {
      question: t`Arayüz tamamen Türkçe mi?`,
      answer: (
        <Text>
          {t`Evet. ${BRAND_NAME} varsayılan olarak tamamen Türkçedir. Dilerseniz alt kısımdaki dil seçiciden başka dillere de geçebilirsiniz.`}
        </Text>
      ),
    },
    {
      question: t`Mobil ve tablette çalışır mı?`,
      answer: (
        <Text>
          {t`Evet. Arayüz masaüstü, tablet ve mobil ekranlara uyumludur; tarayıcınızdan herhangi bir cihazda kullanabilirsiniz.`}
        </Text>
      ),
    },
    {
      question: t`Destek nasıl alırım?`,
      answer: (
        <Text>
          <Trans>
            Sorularınız için bize{" "}
            <Link href={`mailto:${BRAND_CONTACT_EMAIL}`} className="underline">
              {BRAND_CONTACT_EMAIL}
            </Link>{" "}
            adresinden ulaşabilirsiniz.
          </Trans>
        </Text>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-[900px] px-4">
      <div className="flex flex-col items-center justify-center pb-12">
        <div className="flex items-center gap-2 rounded-full border bg-light-50 px-4 py-1 text-center text-xs text-light-1000 dark:border-dark-300 dark:bg-dark-50 dark:text-dark-900 lg:text-sm">
          <p>{t`SSS`}</p>
        </div>

        <p className="mt-2 text-center text-3xl font-bold text-light-1000 dark:text-dark-1000 lg:text-4xl">
          {t`Sorularınız mı var?`}
        </p>
        <p className="text lg:text-md mt-3 max-w-[500px] text-center text-light-950 dark:text-dark-900">
          <Trans>
            Sık sorulan soruların yanıtları aşağıda. Aradığınızı bulamazsanız{" "}
            <Link href={`mailto:${BRAND_CONTACT_EMAIL}`} className="underline">
              bize yazın
            </Link>
            .
          </Trans>
        </p>
      </div>
      <div className="rounded-2xl bg-light-50 ring-1 ring-light-300 dark:bg-dark-50 dark:ring-dark-200">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <dl className="divide-y divide-light-300 dark:divide-dark-200">
              {faqs.map((faq) => (
                <Disclosure
                  key={faq.question}
                  as="div"
                  className="py-5 first:pt-0 last:pb-0"
                >
                  <dt>
                    <DisclosureButton className="group flex w-full items-center justify-between text-left text-light-1000 dark:text-dark-1000">
                      <span className="text-[14px] font-semibold">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center text-light-800 dark:text-dark-800">
                        <HiMiniPlusSmall
                          aria-hidden="true"
                          className="size-6 group-data-[open]:hidden"
                        />
                        <HiMiniMinusSmall
                          aria-hidden="true"
                          className="size-6 group-[&:not([data-open])]:hidden"
                        />
                      </span>
                    </DisclosureButton>
                  </dt>
                  <DisclosurePanel as="dd" className="mt-2 pr-12">
                    {faq.answer}
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
