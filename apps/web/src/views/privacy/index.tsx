import Link from "next/link";

import { PageHead } from "~/components/PageHead";
import {
  BRAND_COMPANY,
  BRAND_CONTACT_EMAIL,
  BRAND_NAME,
  BRAND_TITLE_SUFFIX,
} from "~/lib/brand";
import Layout from "../home/components/Layout";

export default function PrivacyView() {
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
      <PageHead title={`Gizlilik Politikası | ${BRAND_TITLE_SUFFIX}`} />
      <div className="flex flex-col items-center">
        <div className="mb-20 flex h-full w-full max-w-[800px] flex-col lg:pt-[5rem]">
          <div className="flex items-center justify-center py-36 text-4xl font-bold tracking-tight text-light-1000 dark:text-dark-1000">
            <h2>Gizlilik Politikası</h2>
          </div>
          <p className="mb-6 text-sm text-light-1000 dark:text-dark-900">
            Son güncelleme: 3 Temmuz 2026
          </p>

          <div className="mb-6">
            <SubHeading>Giriş</SubHeading>
            <Text>
              Gizliliğiniz bizim için önemlidir. Bu Gizlilik Politikası,{" "}
              {BRAND_COMPANY} tarafından işletilen {BRAND_NAME} hizmeti (“Hizmet”)
              kapsamında kişisel verilerinizi nasıl topladığımızı,
              kullandığımızı ve koruduğumuzu açıklar. Kişisel verileriniz, 6698
              sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili
              mevzuata uygun olarak işlenir.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Topladığımız Bilgiler</SubHeading>
            <Text>
              Hizmeti kullanırken bize doğrudan sağladığınız bilgileri ve
              Hizmete erişiminiz sırasında otomatik olarak oluşan teknik
              bilgileri toplarız. Bunlar şunları içerebilir:
            </Text>
            <UnorderedList>
              <ListItem>Ad ve e-posta adresi gibi hesap bilgileri.</ListItem>
              <ListItem>
                Oluşturduğunuz pano, liste, kart ve yorum gibi içerik verileri.
              </ListItem>
              <ListItem>
                IP adresi, tarayıcı türü, ziyaret edilen sayfalar ve tarih/saat
                gibi kayıt (log) verileri.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>Verileri Kullanma Amaçlarımız</SubHeading>
            <Text>
              Kişisel verilerinizi yalnızca meşru bir amaç bulunduğunda ve
              hizmeti sunmak için gerekli olduğu ölçüde işleriz:
            </Text>
            <UnorderedList>
              <ListItem>Hizmete erişiminizi sağlamak ve sürdürmek.</ListItem>
              <ListItem>
                Sizinle iletişim kurmak ve destek taleplerinizi yanıtlamak.
              </ListItem>
              <ListItem>
                Hizmeti geliştirmek, güvenliğini sağlamak ve kötüye kullanımı
                önlemek.
              </ListItem>
              <ListItem>
                Yasal yükümlülüklerimizi yerine getirmek.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>Verilerin Güvenliği</SubHeading>
            <Text>
              Kişisel verilerinizi kayıp, hırsızlık ve yetkisiz erişime karşı
              korumak için makul teknik ve idari tedbirleri alırız. Bununla
              birlikte, hiçbir elektronik iletim veya depolama yönteminin
              %100 güvenli olmadığını hatırlatırız. Bir veri ihlali durumunda
              yürürlükteki mevzuata uygun olarak hareket ederiz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Verilerin Saklanma Süresi</SubHeading>
            <Text>
              Kişisel verilerinizi yalnızca işleme amacının gerektirdiği süre
              boyunca ve yürürlükteki mevzuatın öngördüğü süreler dâhilinde
              saklarız. Verilere artık ihtiyaç kalmadığında bunları siler veya
              kimliğinizi belirlemeyecek şekilde anonim hâle getiririz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Verilerin Üçüncü Kişilerle Paylaşımı</SubHeading>
            <Text>
              Kişisel verilerinizi satmayız. Verilerinizi yalnızca aşağıdaki
              hâllerde ve gerekli olduğu ölçüde paylaşabiliriz:
            </Text>
            <UnorderedList>
              <ListItem>
                Barındırma, veri depolama ve altyapı gibi hizmetleri sağlayan
                yüklenicilerimizle (yalnızca hizmeti sunmaları amacıyla).
              </ListItem>
              <ListItem>
                Yürürlükteki mevzuat gereği yetkili kamu kurumları ve adli
                mercilerle.
              </ListItem>
            </UnorderedList>
          </div>

          <div className="mb-6">
            <SubHeading>KVKK Kapsamındaki Haklarınız</SubHeading>
            <Text>
              KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip
              işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
              işleme amacını öğrenme, eksik veya yanlış işlenmiş verilerin
              düzeltilmesini, mevzuatta öngörülen şartlarla silinmesini veya yok
              edilmesini isteme ve işlemenin hukuka aykırı olması hâlinde
              zararın giderilmesini talep etme haklarına sahipsiniz. Bu
              haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Çocukların Gizliliği</SubHeading>
            <Text>
              Hizmetimiz 13 yaşın altındaki çocuklara yönelik değildir ve
              bilerek 13 yaşın altındaki çocuklara ait kişisel veri
              toplamayız.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>Politikadaki Değişiklikler</SubHeading>
            <Text>
              Bu Gizlilik Politikasını iş süreçlerimizdeki, güncel
              uygulamalardaki veya mevzuattaki değişiklikleri yansıtmak için
              zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada
              yayımlandığında yürürlüğe girer.
            </Text>
          </div>

          <div className="mb-6">
            <SubHeading>İletişim</SubHeading>
            <Text>
              Gizliliğinizle ilgili soru ve talepleriniz için bize{" "}
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
