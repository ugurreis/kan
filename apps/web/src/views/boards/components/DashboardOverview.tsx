import Link from "next/link";
import { t } from "@lingui/core/macro";
import { motion } from "framer-motion";
import {
  HiOutlineArrowRight,
  HiOutlineInbox,
  HiOutlineRectangleStack,
  HiOutlineSquares2X2,
  HiOutlineStar,
} from "react-icons/hi2";

import { authClient } from "@kan/auth/client";

import { useWorkspace } from "~/providers/workspace";
import { api } from "~/utils/api";
import { BoardPreview } from "./BoardPreview";

// Landing sayfasının dili: beyaz zemin + yumuşak emerald gradyan, yuvarlak
// köşeler (rounded-2xl), tek aksan (brand teal), Geist. Bu bileşen o dili
// dashboard'a taşır. Tüm sayılar GERÇEK sorgulardan gelir (uydurma yok).

function initials(name?: string | null) {
  if (!name) return "N";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "N";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return t`İyi geceler`;
  if (h < 12) return t`Günaydın`;
  if (h < 18) return t`İyi günler`;
  return t`İyi akşamlar`;
}

function todayLabel() {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return t`az önce`;
  if (mins < 60) return t`${mins} dk önce`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return t`${hrs} sa önce`;
  const days = Math.round(hrs / 24);
  return t`${days} gün önce`;
}

const stagger = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function DashboardOverview() {
  const { workspace } = useWorkspace();
  const { data: session } = authClient.useSession();

  const { data: boards = [] } = api.board.all.useQuery(
    {
      workspacePublicId: workspace.publicId,
      type: "regular",
      archived: false,
    },
    { enabled: !!workspace.publicId },
  );

  const { data: inbox = [] } = api.inbox.list.useQuery();

  const name = session?.user.name ?? workspace.name ?? "";
  const favorites = boards.filter((b) => b.favorite).length;

  const withinWeek = inbox.filter((i) => {
    if (!i.dueDate) return false;
    const due = new Date(i.dueDate).getTime();
    return due >= Date.now() && due - Date.now() <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    {
      key: "boards",
      label: t`Panolar`,
      value: boards.length,
      icon: HiOutlineRectangleStack,
    },
    {
      key: "favorites",
      label: t`Favoriler`,
      value: favorites,
      icon: HiOutlineStar,
    },
    {
      key: "inbox",
      label: t`Gelen Kutusu`,
      value: inbox.length,
      icon: HiOutlineInbox,
    },
    {
      key: "week",
      label: t`Bu hafta teslim`,
      value: withinWeek,
      icon: HiOutlineSquares2X2,
    },
  ];

  const recent = [...inbox]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="relative mb-10">
      {/* Landing'deki yumuşak emerald parıltısı */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-400/20 blur-[90px] dark:bg-brand-500/10"
      />

      <motion.div
        custom={0}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mb-8 flex items-center gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-sm ring-4 ring-brand-500/10">
          {initials(name)}
        </div>
        <div>
          <h1 className="text-[1.35rem] font-bold tracking-tight text-light-1000 dark:text-dark-1000">
            {greeting()}
            {name ? `, ${name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm capitalize text-light-900 dark:text-dark-900">
            {todayLabel()}
          </p>
        </div>
      </motion.div>

      {/* KPI kartları — tek radius (rounded-2xl), tek aksan, gerçek veri */}
      <div className="relative z-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.key}
            custom={i + 1}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="rounded-2xl bg-white p-4 ring-1 ring-light-300/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_2px_8px_-2px_rgba(16,24,40,0.06),0_16px_36px_-18px_rgba(13,148,136,0.14)] transition-transform hover:-translate-y-0.5 dark:bg-dark-50 dark:ring-dark-300"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_12px_-2px_rgba(13,148,136,0.45)]">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-light-1000 dark:text-dark-1000">
              {s.value}
            </p>
            <p className="text-xs font-medium text-light-900 dark:text-dark-900">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Canlı pano önizlemesi (birincil pano — favoriler önce sıralı) */}
      {boards[0] && (
        <BoardPreview
          boardPublicId={boards[0].publicId}
          boardName={boards[0].name}
        />
      )}

      {/* Gelen Kutusu önizleme */}
      <motion.div
        custom={5}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mt-4 rounded-2xl bg-white p-5 ring-1 ring-light-300/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_2px_8px_-2px_rgba(16,24,40,0.06),0_16px_36px_-18px_rgba(13,148,136,0.12)] dark:bg-dark-50 dark:ring-dark-300"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-light-1000 dark:text-dark-1000">
            {t`Son gelenler`}
          </h2>
          <Link
            href="/inbox"
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            {t`Gelen Kutusu`}
            <HiOutlineArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-light-100 py-8 text-center dark:bg-dark-100">
            <HiOutlineInbox className="h-6 w-6 text-light-800 dark:text-dark-800" />
            <p className="mt-2 text-sm text-light-900 dark:text-dark-900">
              {t`Gelen kutun boş.`}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-light-200 dark:divide-dark-200">
            {recent.map((item) => (
              <li
                key={item.publicId}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      item.source === "email"
                        ? "bg-brand-500"
                        : "bg-light-500 dark:bg-dark-500"
                    }`}
                  />
                  <span className="truncate text-sm text-light-1000 dark:text-dark-1000">
                    {item.title}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-light-800 dark:text-dark-800">
                  {relativeTime(new Date(item.createdAt))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
