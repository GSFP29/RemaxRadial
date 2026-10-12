import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";

type ItemFaq = { question: string; answer: string };

export async function Faqs() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as ItemFaq[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="border-t border-grid px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("title")}</h2>
          <p className="mt-2 text-foreground-secondary">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col divide-y divide-grid">
          {items.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-foreground-secondary transition group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
