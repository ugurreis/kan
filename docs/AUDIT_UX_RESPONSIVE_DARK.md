# Nexora — UX / Responsive / Dark-Theme / A11y Audit

> Branch: `audit/nexora-ux-responsive-dark-theme` (main `30060e95`'ten) · Yalnız AUDIT (kod değişikliği yok).
> Aşama 1 = kod/statik audit (TAMAM). Aşama 2 = canlı görsel sweep (breakpoint/tema/modal/tablo/grafik) — dev sunucusu gerektirir, BEKLİYOR.
> Sınıflandırma: 🟢 Product Only · 🟡 Platform Impact · 🔴 Out of Scope. Önem: Critical/High/Medium/Low.

## Kritik marka kontrolü — THE NOVA
✅ **TEMİZ.** Tüm repoda (statik landing + tüm pages/components + meta) müşteri-yüzü "THE NOVA / Powered by / Built on / Running on THE NOVA" referansı **YOK**. `nova` grep isabetleri Portekizce "nova" (=yeni) katalog kelimeleri — marka değil. `src/lib/brand.ts` merkezi (Nexora/Nexovias). Bu kritik risk mevcut değil.

## Bulgular (öncelikli)

| # | Bulgu | Kanıt | Sınıf | Önem |
|---|-------|-------|-------|------|
| 1 | **Karışık TR/EN kaynak msgid'leri** — aynı bileşende hem EN hem TR `t\`…\``; Lingui kaynak dili `en`. EN locale kullanıcısı, `en` çevirisi olmayan TR-msgid'lerde Türkçe görür → garantili karışık dil. | `views/home/components/Footer.tsx:15-30,55,91`; `views/analytics/index.tsx:41,54`; `views/board/components/BoardDropdown.tsx:48-158`; `views/home/components/Faqs.tsx:43` | 🟢 | **High** |
| 2 | **Artık "Kan"/kanbn markası müşteri-yüzünde** — pricing kopyasında "Host Kan…" + `github.com/kanbn/kan`. | `views/pricing/components/Pricing.tsx:66,69`; `views/home/components/Footer.tsx:8-10` | 🟢 | **High** |
| 3 | **A11y — ikon-butonlarda `aria-label` eksik** (yalnız ~4 dosyada var). Erişilebilir ad yok. | `views/home/components/Footer.tsx:44-45` (GitHub ikonu); landing burger/to-top | 🟢 | **High** |
| 4 | **Zoom engeli** — app `maximum-scale=1` (WCAG 1.4.4 ihlali). Landing zoom'a izin veriyor, tutarsız. | `src/components/PageHead.tsx:9` | 🟢 | Medium |
| 5 | **Billing parçalanması** — app Stripe (`packages/stripe`), landing ham Creem checkout linkleri (`creem.io/product/prod_…`). `packages/`'ta Creem adapter YOK; fiyatlar sürüklenebilir. Ödeme kanonu = yalnız Creem. | `nexora-landing.html:890,904,1206-1288`; `views/settings/BillingSettings.tsx:49,74-77`; `packages/stripe/src/index.ts` | 🟡 | **High** |
| 6 | **Çift tema sistemi** — `next-themes` (`_app.tsx:102-106`, aktif) + kullanılmayan legacy `src/providers/theme.tsx` (localStorage). Kafa karışıklığı / ölü kod. | `src/providers/theme.tsx:27,34,47` | 🟢 | Medium |
| 7 | **Çift landing** — servis edilen statik `public/nexora-landing.html` (middleware `/`→rewrite) + hiç servis edilmeyen React `views/home`. İki landing bakımı. | `src/middleware.ts:6-19`; `src/pages/index.tsx` | 🟢 | Medium |
| 8 | **Katalog kirliliği** — stale `… | kan.bn` msgid'leri (ölü ama geri gelebilir); `pt-BR` ve `ptbr` çift dizin. | `src/locales/de/messages.json:159,205,3823,5470` | 🟢 | Medium |
| 9 | **i18n otomasyonu TR'yi dışlıyor** — `i18n.json` hedefleri fr/de/es/it/nl/ru/pl/pt-BR; `tr` yok ama ürün TR-öncelikli (elle bakım). | `i18n.json:3-6` | 🟡 | Medium |
| 10 | **Doküman-kod deltası** — README/.env hâlâ upstream `HIDE_POWERED_BY` (kan.bn) mekanizmasını anlatıyor; gerçek mekanizma middleware swap. | `README.md:214`; `.env.example:43` | 🟢 | Medium |
| 11 | **Dark tema boşlukları** — sabit renkler dark varyantsız (contenteditable placeholder `#707070`, gradient-border rgba). Landing light-only. | `globals.css:12,21-24` | 🟢 | Low |

## Onay bekleyen (mimari / ownership — kendim karar vermiyorum)
- **#5 Billing:** Stripe→Creem tekilleştirme + tek Creem adapter'ı **platform/ödeme kanonu** kararı. Landing ham Creem linkleri mi kalır, app Creem adapter'ına mı taşınır — `feat/creem-billing-adapter-phase-a` branch'iyle koordinasyon gerekir. **Rapor ediyorum, onay bekliyorum.**
- **#9 i18n TR pipeline:** TR'yi lingo.dev hedeflerine eklemek platform i18n akışını etkiler (🟡).

## Aşama 2 — canlı görsel sweep (BEKLİYOR, dev sunucusu gerekir)
360/390/büyük-mobil/tablet-portrait/tablet-landscape/küçük-laptop/desktop/geniş × light/dark × TR/EN: yatay overflow, kırılan nav, taşan metin, dokunma hedefleri, modal/drawer, tablo, grafik okunabilirliği, sticky/safe-area, loading/empty/error/success. **Not:** açık PR #3 `fix/mobile-horizontal-overflow` landing yatay overflow'unu zaten ele alıyor — tekrar çözülmeyecek, doğrulanacak.

## Not
Kritik olmayan iyileştirmeler bu aşamada UYGULANMADI (yalnız audit). Onaylanan bulgular ayrı branch + ayrı PR'larda uygulanacak.
