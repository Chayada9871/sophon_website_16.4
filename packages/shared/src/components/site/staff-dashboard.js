"use client";

import Link from "next/link";

import { useLanguage } from "./language-provider";
import { StaffSiteShell } from "./staff-site-shell";
import { localize } from "../../lib/site-content";

const dashboardContent = {
  eyebrow: { en: "Staff workspace", th: "พื้นที่ทำงานของทีมงาน" },
  title: { en: "Content Management Dashboard", th: "แดชบอร์ดจัดการเนื้อหา" },
  description: {
    en: "Choose the content area you want to update for the live website.",
    th: "เลือกส่วนของเนื้อหาที่ต้องการอัปเดตสำหรับเว็บไซต์หน้าร้าน",
  },
  cards: [
    {
      href: "/promotions",
      title: { en: "Promotions", th: "โปรโมชั่น" },
      description: {
        en: "Add, edit, and review promotional cards shown on the public website.",
        th: "เพิ่ม แก้ไข และตรวจสอบรายการโปรโมชั่นที่แสดงบนเว็บไซต์หน้าร้าน",
      },
      action: { en: "Manage promotions", th: "จัดการโปรโมชั่น" },
    },
    {
      href: "/brochures",
      title: { en: "Brochures", th: "โบรชัวร์" },
      description: {
        en: "Upload brochure files and keep the latest brochure link ready for customers.",
        th: "อัปโหลดไฟล์โบรชัวร์และจัดการรายการล่าสุดให้พร้อมสำหรับลูกค้า",
      },
      action: { en: "Manage brochures", th: "จัดการโบรชัวร์" },
    },
  ],
};

export function StaffDashboard() {
  const { language } = useLanguage();
  const content = localize(dashboardContent, language);

  return (
    <StaffSiteShell>
      <section className="section shell staff-console-page">
        <div className="staff-console-intro staff-console-intro--single">
          <div className="staff-console-intro-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </div>
        </div>

        <div className="staff-dashboard-grid">
          {content.cards.map((card) => (
            <article key={card.href} className="staff-dashboard-card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <Link href={card.href} className="button">
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </StaffSiteShell>
  );
}
