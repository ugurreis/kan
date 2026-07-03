import type { GetServerSideProps } from "next";

// Install-based (tek kiracı) satış modelinde self-servis bulut fiyat kademesi
// yoktur; gerçek paketleme belirlenene kadar /pricing ana sayfaya yönlendirilir.
export const getServerSideProps: GetServerSideProps = () => {
  return Promise.resolve({
    redirect: { destination: "/", permanent: false },
  });
};

export default function Pricing() {
  return null;
}
