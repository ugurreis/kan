// Nexora — hazır şablon-panosu seed'i.
// 10 Türkçe şablonu, örnek kartlarıyla birlikte bir workspace'e "type=template"
// panosu olarak ekler. Böylece /templates sayfasında görünür ve seçilince
// pano kartlarıyla dolu gelir (kullanıcı sıfırdan uğraşmaz).
//
// Çalıştırma (local):
//   POSTGRES_URL=postgresql://<user>:<pass>@<host>:<port>/<db> \
//     node scripts/seed-templates.mjs <workspacePublicId> <createdByUserId>
//
// Arg verilmezse ilk workspace ve o workspace'in bir admin üyesi kullanılır.
// Idempotent: aynı adlı (silinmemiş) şablon zaten varsa o şablon atlanır.

import pg from "pg";

const { Pool } = pg;

const COLOURS = [
  "#0d9488", "#65a30d", "#0284c7", "#4f46e5",
  "#ca8a04", "#ea580c", "#dc2626", "#db2777",
];

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function uid(len = 12) {
  let s = "";
  for (let i = 0; i < len; i++)
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

function slugify(name) {
  const map = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };
  return name
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Şablon tanımları. Kartlar `list` alanıyla ilgili sütuna yerleştirilir.
const templates = [
  {
    name: "Basit Kanban",
    lists: ["Yapılacaklar", "Devam Ediyor", "Tamamlandı"],
    labels: ["Yüksek Öncelik", "Orta Öncelik", "Düşük Öncelik"],
    cards: [
      { list: "Yapılacaklar", title: "Örnek görev — buraya kendi işini ekle", description: "Bu kartı düzenleyerek ilk işini oluştur." },
      { list: "Yapılacaklar", title: "Haftalık toplantı planla" },
      { list: "Devam Ediyor", title: "Üzerinde çalışılan bir iş" },
      { list: "Tamamlandı", title: "Biten bir iş" },
    ],
  },
  {
    name: "Yazılım Geliştirme",
    lists: ["Birikim (Backlog)", "Yapılacaklar", "Geliştiriliyor", "Kod İncelemesi", "Test", "Tamamlandı"],
    labels: ["Hata", "Özellik", "İyileştirme", "Kritik", "Dokümantasyon"],
    cards: [
      { list: "Birikim (Backlog)", title: "Kullanıcı giriş sayfası", description: "E-posta + şifre ile giriş ve oturum yönetimi." },
      { list: "Birikim (Backlog)", title: "API dokümantasyonu hazırla" },
      { list: "Yapılacaklar", title: "Şifre sıfırlama akışı" },
      { list: "Geliştiriliyor", title: "Ödeme entegrasyonu" },
      { list: "Test", title: "Ödeme akışı testi" },
      { list: "Tamamlandı", title: "Proje kurulumu ve CI/CD" },
    ],
  },
  {
    name: "Ürün Yol Haritası",
    lists: ["Talep Edildi", "Değerlendiriliyor", "Planlandı", "Geliştiriliyor", "Yayınlandı"],
    labels: ["Özellik", "İyileştirme", "Kritik", "Araştırma"],
    cards: [
      { list: "Talep Edildi", title: "Karanlık mod", description: "Kullanıcıların sıkça istediği bir özellik." },
      { list: "Talep Edildi", title: "Mobil uygulama" },
      { list: "Değerlendiriliyor", title: "Takvim entegrasyonu" },
      { list: "Planlandı", title: "Çoklu dil desteği" },
      { list: "Yayınlandı", title: "Takım davet sistemi" },
    ],
  },
  {
    name: "İçerik & Sosyal Medya Takvimi",
    lists: ["Fikirler", "Hazırlanıyor", "Tasarım", "Onay Bekliyor", "Planlandı", "Yayınlandı"],
    labels: ["Blog", "Sosyal Medya", "Video", "Bülten", "Acil"],
    cards: [
      { list: "Fikirler", title: "Blog: 2026 sektör trendleri" },
      { list: "Fikirler", title: "Instagram reel serisi" },
      { list: "Hazırlanıyor", title: "Haftalık e-bülten metni" },
      { list: "Tasarım", title: "Kampanya görselleri" },
      { list: "Yayınlandı", title: "Ürün tanıtım videosu" },
    ],
  },
  {
    name: "Satış Pipeline (CRM)",
    lists: ["Potansiyel", "İletişim Kuruldu", "Teklif Gönderildi", "Müzakere", "Kazanıldı", "Kaybedildi"],
    labels: ["Sıcak", "Ilık", "Soğuk", "Kurumsal", "Bireysel"],
    cards: [
      { list: "Potansiyel", title: "ABC Şirketi", description: "Web sitesinden gelen talep." },
      { list: "Potansiyel", title: "XYZ Ltd." },
      { list: "İletişim Kuruldu", title: "Demo talebi — kurumsal müşteri" },
      { list: "Teklif Gönderildi", title: "Yıllık abonelik teklifi" },
      { list: "Kazanıldı", title: "İlk kurumsal anlaşma" },
    ],
  },
  {
    name: "Pazarlama Kampanyası",
    lists: ["Fikir", "Planlama", "Hazırlık", "İncelemede", "Yürütmede", "Tamamlandı"],
    labels: ["Dijital", "Etkinlik", "E-posta", "Reklam", "Acil"],
    cards: [
      { list: "Fikir", title: "Yaz indirim kampanyası" },
      { list: "Planlama", title: "Google Ads bütçesi belirle" },
      { list: "Hazırlık", title: "Açılış sayfası (landing) hazırla" },
      { list: "Yürütmede", title: "E-posta serisi gönderimi" },
      { list: "Tamamlandı", title: "Marka tanıtım videosu" },
    ],
  },
  {
    name: "Müşteri Destek",
    lists: ["Yeni Talep", "İnceleniyor", "Devam Ediyor", "Müşteri Bekleniyor", "Çözüldü"],
    labels: ["Hata Bildirimi", "Talep", "Soru", "Acil", "Faturalama"],
    cards: [
      { list: "Yeni Talep", title: "Giriş yapılamıyor", description: "Müşteri şifresini girince hata alıyor." },
      { list: "Yeni Talep", title: "Fatura ulaşmadı" },
      { list: "İnceleniyor", title: "Yavaş yükleme şikayeti" },
      { list: "Çözüldü", title: "Şifre sıfırlama talebi" },
    ],
  },
  {
    name: "İşe Alım",
    lists: ["Başvurular", "Ön Eleme", "Mülakat", "Teklif", "İşe Başladı"],
    labels: ["Uzaktan", "Tam Zamanlı", "Yarı Zamanlı", "Kıdemli", "Yeni Başlayan"],
    cards: [
      { list: "Başvurular", title: "Senior Frontend Geliştirici" },
      { list: "Başvurular", title: "UX Tasarımcı" },
      { list: "Ön Eleme", title: "Backend Geliştirici — CV incelemesi" },
      { list: "Mülakat", title: "Pazarlama Uzmanı — teknik görüşme" },
      { list: "Teklif", title: "Ürün Yöneticisi" },
    ],
  },
  {
    name: "Etkinlik Planlama",
    lists: ["Fikirler", "Planlama", "Hazırlık", "Yürütme", "Değerlendirme"],
    labels: ["Mekan", "Katılımcı", "Bütçe", "Tanıtım", "Acil"],
    cards: [
      { list: "Fikirler", title: "Yıl sonu lansman etkinliği" },
      { list: "Planlama", title: "Mekan araştırması ve rezervasyon" },
      { list: "Hazırlık", title: "Davetiye tasarımı ve gönderimi" },
      { list: "Yürütme", title: "Etkinlik günü koordinasyonu" },
    ],
  },
  {
    name: "Haftalık Kişisel Plan",
    lists: ["Bu Hafta", "Bugün", "Devam Ediyor", "Bekliyor", "Tamamlandı"],
    labels: ["Önemli", "Hızlı", "Uzun Vadeli", "Kişisel", "İş"],
    cards: [
      { list: "Bu Hafta", title: "Aylık raporu teslim et" },
      { list: "Bu Hafta", title: "Sunum hazırla" },
      { list: "Bugün", title: "E-postaları yanıtla" },
      { list: "Tamamlandı", title: "Haftalık planlama" },
    ],
  },
];

async function resolveTarget(pool, argWorkspace, argUser) {
  let workspaceId, workspacePublicId, createdBy;

  if (argWorkspace) {
    const r = await pool.query(
      `SELECT id, "publicId" FROM workspace WHERE "publicId" = $1 AND "deletedAt" IS NULL`,
      [argWorkspace],
    );
    if (!r.rows[0]) throw new Error(`Workspace bulunamadı: ${argWorkspace}`);
    workspaceId = r.rows[0].id;
    workspacePublicId = r.rows[0].publicId;
  } else {
    const r = await pool.query(
      `SELECT id, "publicId" FROM workspace WHERE "deletedAt" IS NULL ORDER BY id ASC LIMIT 1`,
    );
    if (!r.rows[0]) throw new Error("Hiç workspace yok.");
    workspaceId = r.rows[0].id;
    workspacePublicId = r.rows[0].publicId;
  }

  if (argUser) {
    createdBy = argUser;
  } else {
    const r = await pool.query(
      `SELECT wm."userId" FROM workspace_members wm
       WHERE wm."workspaceId" = $1 AND wm."userId" IS NOT NULL AND wm."deletedAt" IS NULL
       ORDER BY (wm.role = 'admin') DESC, wm.id ASC LIMIT 1`,
      [workspaceId],
    );
    if (!r.rows[0]) throw new Error("Workspace'te üye/kullanıcı bulunamadı.");
    createdBy = r.rows[0].userId;
  }

  return { workspaceId, workspacePublicId, createdBy };
}

async function main() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("POSTGRES_URL tanımlı değil.");

  const argWorkspace = process.argv[2];
  const argUser = process.argv[3];

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    const { workspaceId, workspacePublicId, createdBy } = await resolveTarget(
      pool,
      argWorkspace,
      argUser,
    );
    console.log(
      `Hedef workspace: ${workspacePublicId} (id=${workspaceId}), createdBy=${createdBy}`,
    );

    let created = 0;
    let skipped = 0;

    for (const tpl of templates) {
      await client.query("BEGIN");
      try {
        const existing = await client.query(
          `SELECT id FROM board WHERE "workspaceId" = $1 AND name = $2 AND type = 'template' AND "deletedAt" IS NULL`,
          [workspaceId, tpl.name],
        );
        if (existing.rows[0]) {
          await client.query("ROLLBACK");
          skipped++;
          console.log(`  atlandı (zaten var): ${tpl.name}`);
          continue;
        }

        const boardPublicId = uid();
        const slug = `${slugify(tpl.name)}-${uid()}`;
        const boardRes = await client.query(
          `INSERT INTO board ("publicId", name, slug, "createdBy", "workspaceId", type, visibility)
           VALUES ($1,$2,$3,$4,$5,'template','private') RETURNING id`,
          [boardPublicId, tpl.name, slug, createdBy, workspaceId],
        );
        const boardId = boardRes.rows[0].id;

        // Listeler
        const listIdByName = {};
        for (let i = 0; i < tpl.lists.length; i++) {
          const listName = tpl.lists[i];
          const lr = await client.query(
            `INSERT INTO list ("publicId", name, index, "createdBy", "boardId")
             VALUES ($1,$2,$3,$4,$5) RETURNING id`,
            [uid(), listName, i, createdBy, boardId],
          );
          listIdByName[listName] = lr.rows[0].id;
        }

        // Etiketler
        for (let i = 0; i < tpl.labels.length; i++) {
          await client.query(
            `INSERT INTO label ("publicId", name, "colourCode", "createdBy", "boardId")
             VALUES ($1,$2,$3,$4,$5)`,
            [uid(), tpl.labels[i], COLOURS[i % COLOURS.length], createdBy, boardId],
          );
        }

        // Kartlar (liste içi index)
        const indexByList = {};
        for (const card of tpl.cards) {
          const listId = listIdByName[card.list];
          if (!listId) throw new Error(`Liste yok: ${card.list} (${tpl.name})`);
          const idx = indexByList[card.list] ?? 0;
          indexByList[card.list] = idx + 1;
          await client.query(
            `INSERT INTO card ("publicId", title, description, index, "createdBy", "listId")
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [uid(), card.title, card.description ?? null, idx, createdBy, listId],
          );
        }

        await client.query("COMMIT");
        created++;
        console.log(`  eklendi: ${tpl.name} (${tpl.cards.length} kart)`);
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }

    console.log(`\nBitti. Eklenen: ${created}, atlanan: ${skipped}.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Seed hatası:", e);
  process.exit(1);
});
