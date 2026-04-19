"use client";

import Link from "next/link";

const domains = [
  {
    n: "01",
    title: "مناخ المدرسة وبيئة التعلم",
    desc: "بيئة التعلم والثقافة المدرسية ودعم التحصيل والسلوك.",
    href: "/manakh",
  },
  {
    n: "02",
    title: "القيادة والحوكمة",
    desc: "التخطيط والتنظيم والمتابعة وقيادة التحسين المؤسسي.",
    href: "/idara",
  },
  {
    n: "03",
    title: "الإنجاز الدراسي",
    desc: "مؤشرات التحصيل والتقدم ونتائج الطلبة.",
    href: "/injaz",
  },
  {
    n: "04",
    title: "التدريس والتقويم",
    desc: "أساليب التدريس وأدوات التقويم ودعم التعلم.",
    href: "/tadrees",
  },
  {
    n: "05",
    title: "النمو الشخصي",
    desc: "الجانب السلوكي والاجتماعي والمواطنة والقيم.",
    href: "/nomow",
  },
];

export function DomainsSection() {
  return (
    <section
      id="domains"
      className="bg-school-white py-16 md:py-24"
      aria-labelledby="domains-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="js-reveal mb-12 text-center md:mb-16">
          <h2
            id="domains-heading"
            className="text-2xl font-bold text-school-black md:text-3xl"
          >
            مجالات تقويم الأداء
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-school-muted">
            خمس مجالات رئيسية — اختر المجال للانتقال إلى صفحته.
          </p>
        </div>

        <div className="js-domains-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <Link
              key={d.n}
              href={d.href}
              className="js-domain-card group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 border-t-4 border-t-neutral-200 bg-school-white p-6 text-start shadow-sm transition-colors hover:border-t-school-gold"
            >
              <span
                className="pointer-events-none absolute start-4 top-4 text-5xl font-bold text-neutral-100"
                aria-hidden
              >
                {d.n}
              </span>
              <div className="relative mt-8">
                <h3 className="text-lg font-bold text-school-black">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-school-muted">
                  {d.desc}
                </p>
                <span className="mt-4 inline-block rounded border border-school-gold px-3 py-1 text-xs font-semibold text-school-gold">
                  عرض المجال
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
