import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, PartyPopper, Rocket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getSiteState } from "@/lib/website.functions";
import { useSubscription } from "@/components/website/activation-card";

export const Route = createFileRoute("/activate")({
  head: () => ({
    meta: [
      { title: "فعّل متجرك · cupai" },
      { name: "description", content: "متجرك جاهز — فعّله الآن وابدأ باستقبال الطلبات." },
      { property: "og:title", content: "فعّل متجرك · cupai" },
      { property: "og:description", content: "متجرك جاهز — فعّله الآن وابدأ باستقبال الطلبات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ActivatePage,
});

const PERKS = [
  "متجرك ظاهر لكل عملائك",
  "استقبال الطلبات وتتبعها",
  "مساعد ذكي يرد على عملائك ويبيع عنك",
];

function ActivatePage() {
  const { data: site } = useQuery({ queryKey: ["site-state"], queryFn: () => getSiteState() });
  const { data: sub } = useSubscription();

  return (
    <div dir="rtl" className="hub hub-dashboard flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-lg items-center px-4 py-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard"><ArrowRight className="ml-1 h-4 w-4" /> لوحة التحكم</Link>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-8">
        <div className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-full bg-dashboard-green-soft text-dashboard-green">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-bold">
          {sub?.subscribed ? "متجرك مفعّل" : `${site?.brand_name || "متجرك"} جاهز!`}
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
          {sub?.subscribed
            ? "متجرك يستقبل الطلبات الآن."
            : "كل شيء مُعد. لتفعيل متجرك واستقبال الطلبات من عملائك، اشترك في الباقة."}
        </p>

        {!sub?.subscribed && (
          <>
            <div className="mt-7 rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">باقة ابدأ فورًا</span>
                <span className="text-xl font-bold text-primary">299ج</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-dashboard-green" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              منتجاتك وإعداداتك محفوظة كما هي — لن تفقد أي شيء.
            </p>
          </>
        )}

        <div className="mt-auto space-y-2 pt-8">
          {sub?.subscribed ? (
            <Button asChild size="lg" className="h-12 w-full text-base">
              <Link to="/dashboard">العودة للوحة التحكم</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" className="h-12 w-full gap-2 text-base"
                onClick={() => toast.success("تم استلام طلب التفعيل، سنتواصل معك لإتمام الاشتراك.")}>
                <Rocket className="h-4 w-4" /> فعّل متجرك الآن
              </Button>
              {site?.brand_slug && (
                <Button asChild size="lg" variant="ghost" className="h-12 w-full">
                  <a href={`/c/${site.brand_slug}`} target="_blank" rel="noopener noreferrer">جرّب متجرك مرة أخرى</a>
                </Button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
