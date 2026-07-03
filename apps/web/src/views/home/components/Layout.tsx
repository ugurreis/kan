import { authClient } from "@kan/auth/client";

import PatternedBackground from "~/components/PatternedBackground";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  return (
    <>
      {/* Arka plan rengi tema sınıfına (.dark) göre statik CSS ile verilir;
          resolvedTheme'i SSR'da JS ile enjekte etmek hydration uyumsuzluğu
          (styled-jsx hash farkı) yaratıyordu. */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          overflow: auto;
          background-color: hsl(0deg 0% 97.3%);
        }
        html.dark {
          background-color: #161616;
        }
      `}</style>
      <div className="mx-auto flex h-full min-h-screen min-w-[375px] flex-col items-center bg-light-100 dark:bg-dark-50">
        <PatternedBackground />
        <Header isLoggedIn={isLoggedIn} />
        <div className="z-10 mx-auto h-full w-full max-w-[1100px]">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}
