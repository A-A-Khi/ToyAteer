export function SchoolMessageSection() {
  return (
    <section
      id="message"
      className="bg-school-black py-16 md:py-24"
      aria-labelledby="message-heading"
    >
      <div className="js-reveal mx-auto max-w-4xl px-4 md:px-6">
        <h2
          id="message-heading"
          className="mb-8 text-center text-2xl font-bold text-school-white md:text-3xl"
        >
          رسالة المدرسة
        </h2>
        <p className="text-center text-lg leading-[1.9] text-school-muted md:text-xl">
          <span className="text-school-gold">
            توفير بيئة تعليمية محفزة وآمنة
          </span>{" "}
          تهدف إلى تنمية قدرات{" "}
          <span className="text-school-gold">الطلبة</span> التحصيلية والشخصية
          والاجتماعية، وغرس{" "}
          <span className="text-school-gold">القيم الخلقية والمواطنة الصالحة</span>
          ، وتعزيز مهارات{" "}
          <span className="text-school-gold">التفكير النقدي والإبداعي</span> لتخريج{" "}
          <span className="text-school-gold">جيل متعلم</span> مؤهل لمواجهة التحديات من
          خلال{" "}
          <span className="text-school-gold">
            كوادر مؤهلة ومدربة وبمشاركة مجتمعية فاعلة
          </span>
          .
        </p>
      </div>
    </section>
  );
}
