import Link from "next/link";

import { PageHead } from "~/components/PageHead";
import {
  BRAND_COMPANY,
  BRAND_CONTACT_EMAIL,
  BRAND_NAME,
  BRAND_TITLE_SUFFIX,
} from "~/lib/brand";
import Layout from "../home/components/Layout";

export default function TermsView() {
  const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-4 text-2xl font-bold text-light-1000 dark:text-dark-950">
      {children}
    </h3>
  );

  const Text = ({ children }: { children: React.ReactNode }) => (
    <p className="line-height text-md mb-4 text-light-1000 dark:text-dark-900">
      {children}
    </p>
  );

  const UnorderedList = ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-6">{children}</ul>
  );

  const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="line-height text-md mb-4 text-light-1000 dark:text-dark-900">
      {children}
    </li>
  );

  return (
    <Layout>
      <PageHead title={`Kullanım Koşulları | ${BRAND_TITLE_SUFFIX}`} />
      <div className="flex flex-col items-center">
        <div className="mb-20 flex h-full w-full max-w-[800px] flex-col lg:pt-[5rem]">
          <div className="flex items-center justify-center py-36 text-4xl font-bold tracking-tight text-light-1000 dark:text-dark-1000">
            <h2>Kullanım Koşulları</h2>
          </div>
          <p className="mb-6 text-sm text-light-1000 dark:text-dark-900">
            Son güncelleme: 3 Temmuz 2026
          </p>

          <div className="mb-6">
            <SubHeading>Giriş</SubHeading>
            <Text>
              Bu Kullanım Koşulları (“Koşullar”), {BRAND_COMPANY} tarafından
              işletilen {BRAND_NAME} hizmetinin (“Hizmet”) kullanımını
              düzenler. Hizmete erişerek veya Hizmeti kullanarak bu Koşulları
              okuduğunuzu, anladığınızı ve bunlarla bağlı olmayı kabul
              ettiğinizi beyan edersiniz.
            </Text>
            <Text>
              Kişisel verilerinizi nasıl işlediğimiz{" "}
              <Link className="underline" href="/privacy">
                Gizlilik Politikası
              </Link>
              nda açıklanmıştır ve bu belge Koşulların ayrılmaz bir parçasıdır.
            </Text>
            <Text>
              Koşulları kabul etmiyorsanız Hizmeti kullanmamalısınız. Sorularınız
              için {BRAND_CONTACT_EMAIL} adresinden bize ulaşabilirsiniz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Hesaplar</SubHeading>
            <Text>
              Bir hesap oluşturduğunuzda bize verdiğiniz bilgilerin doğru,
              eksiksiz ve güncel olduğunu taahhüt edersiniz. Yanlış, eksik veya
              güncel olmayan bilgiler hesabınızın askıya alınmasına ya da
              kapatılmasına yol açabilir.
            </Text>
            <Text>
              Hesap parolanızın ve hesabınıza erişimin gizliliğini korumaktan
              siz sorumlusunuz. Hesabınız üzerinden gerçekleşen tüm işlemlerden
              sorumlu olduğunuzu kabul edersiniz. Yetkisiz bir erişim veya
              güvenlik ihlali fark ettiğinizde derhal bize bildirmelisiniz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>İçerik</SubHeading>
            <Text>
              Hizmet üzerinde oluşturduğunuz, yüklediğiniz veya paylaştığınız
              tüm içerik (“İçerik”) size aittir. İçeriğinizin yasalara
              uygunluğundan ve üçüncü kişilerin haklarını ihlal etmemesinden siz
              sorumlusunuz.
            </Text>
            <Text>
              İçeriğinize ilişkin tüm haklar sizde kalır. {BRAND_COMPANY},
              Hizmeti sunmak ve işletmek için gereken ölçüde İçeriğinizi
              barındırma ve işleme hakkına sahiptir; bunun dışında İçeriğiniz
              üzerinde mülkiyet iddia etmez.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Yasak Kullanımlar</SubHeading>
            <Text>Hizmeti yalnızca yasal amaçlarla kullanabilirsiniz. Şunları yapmamayı kabul edersiniz:</Text>
            <UnorderedList>
              <ListItem>
                Yürürlükteki herhangi bir ulusal veya uluslararası mevzuatı
                ihlal edecek şekilde Hizmeti kullanmak.
              </ListItem>
              <ListItem>
                Başkalarını taciz etmek, tehdit etmek, dolandırmak veya onlara
                zarar vermek.
              </ListItem>
              <ListItem>
                Hizmete, sunuculara veya bağlı sistemlere yetkisiz erişim
                sağlamaya çalışmak.
              </ListItem>
              <ListItem>
                Virüs, truva atı, solucan veya kötü amaçlı başka bir yazılım
                yaymak.
              </ListItem>
              <ListItem>
                Hizmetin normal işleyişini bozacak veya aşırı yük bindirecek
                (örneğin hizmet dışı bırakma saldırıları) davranışlarda
                bulunmak.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>Fikri Mülkiyet</SubHeading>
            <Text>
              Kullanıcı İçeriği hariç olmak üzere Hizmetin özgün içeriği,
              özellikleri ve işlevleri {BRAND_COMPANY} ve lisans verenlerinin
              mülkiyetindedir ve fikri mülkiyet mevzuatı ile korunur. Markalarımız
              ve ticari takdim şeklimiz, yazılı önceden iznimiz olmadan
              kullanılamaz.
            </Text>
            <Text>
              {BRAND_NAME}, AGPL-3.0 lisansı altında yayımlanan açık kaynak bir
              yazılım temel alınarak geliştirilmiştir; ilgili açık kaynak
              lisansı saklıdır.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Garanti Reddi</SubHeading>
            <Text>
              Hizmet “olduğu gibi” ve “mevcut olduğu ölçüde” sunulur.
              Yürürlükteki mevzuatın izin verdiği azami ölçüde, {BRAND_COMPANY}
              Hizmetin kesintisiz, hatasız veya belirli bir amaca uygun
              olacağına dair açık ya da zımni hiçbir garanti vermez.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Sorumluluğun Sınırlandırılması</SubHeading>
            <Text>
              Yürürlükteki mevzuatın izin verdiği azami ölçüde, {BRAND_COMPANY};
              Hizmetin kullanımından veya kullanılamamasından doğan dolaylı,
              arızi, özel veya sonuç niteliğindeki zararlardan sorumlu
              tutulamaz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Fesih</SubHeading>
            <Text>
              Koşulların ihlali dâhil olmak üzere haklı bir sebeple, önceden
              bildirimde bulunmaksızın hesabınıza erişimi askıya alabilir veya
              sonlandırabiliriz. Hesabınızı istediğiniz zaman kullanmayı
              bırakarak sonlandırabilirsiniz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Uygulanacak Hukuk</SubHeading>
            <Text>
              Bu Koşullar, Türkiye Cumhuriyeti kanunlarına tabidir ve bu
              kanunlara göre yorumlanır. Koşullardan doğabilecek
              uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve icra
              daireleri yetkilidir.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Koşullardaki Değişiklikler</SubHeading>
            <Text>
              Koşulları zaman zaman güncelleyebiliriz. Güncellenen Koşulları bu
              sayfada yayımlarız. Değişikliklerin ardından Hizmeti kullanmaya
              devam etmeniz, güncel Koşulları kabul ettiğiniz anlamına gelir.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>İletişim</SubHeading>
            <Text>
              Bu Kullanım Koşulları hakkında sorularınız için bize{" "}
              <Link
                className="line-height text-md mb-4 text-light-1000 underline dark:text-dark-900"
                href={`mailto:${BRAND_CONTACT_EMAIL}`}
              >
                {BRAND_CONTACT_EMAIL}
              </Link>{" "}
              adresinden ulaşabilirsiniz.
            </Text>
          </div>
        </div>
      </div>
    </Layout>
  );
}
