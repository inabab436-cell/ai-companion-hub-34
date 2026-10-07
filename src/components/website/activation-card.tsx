import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSiteState } from "@/lib/website.functions";
import { getSubscriptionStatus } from "@/lib/subscription.functions";

export const PREVIEW_TRIED_KEY = "cupai:store-preview-tried";

export function useSubscription() {
  return useQuery({ queryKey: ["subscription"], queryFn: () => getSubscriptionStatus() });
}

/** Pre-activation journey: try the store first, then activate. Hidden once subscribed. */
export function ActivationCard() {
  const { data: site } = useQuery({ queryKey: ["site-state"], queryFn: () => getSiteState() });
  const { data: sub } = useSubscription();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    try { setTried(Boolean(window.localStorage.getItem(PREVIEW_TRIED_KEY))); } catch { /* ignore */ }
  }, []);

  if (!site?.site_created || !site.brand_slug || !sub || sub.subscribed) return null;

  const markTried = () => {
    try { window.localStorage.setItem(PREVIEW_TRIED_KEY, "1"); } catch { /* ignore */ }
    setTried(true);
  };

  const steps = [
    { label: "أنشأت متجرك", done: true },
    { label: "جرّب متجرك كأنك عميل", done: tried },
    { label: "فعّل متجرك واستقبل الطلبات", done: false },
  ];

  return (
    <section className="rounded-lg border border-primary/30 bg-card p-5 shadow-card">
      <p className="text-xs font-semibold text-primary">خطوة أخيرة</p>
      <h2 className="mt-1 text-lg font-bold">
        {tried ? "متجرك جاهز للانطلاق" : "جرّب متجرك قبل التفعيل"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {tried
          ? "رأيت متجرك بنفسك. فعّله الآن ليبدأ باستقبال الطلبات من عملائك."
          : "افتح متجرك وتصفّح منتجاتك وجرّب المحادثة — مجانًا وبدون أي دفع."}
      </p>

      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3 text-sm">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
              s.done ? "bg-dashboard-green-soft text-dashboard-green" : "bg-muted text-muted-foreground"}`}>
              {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={s.done ? "text-muted-foreground" : "font-semibold"}>{s.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {tried ? (
          <>
            <Button asChild size="lg" className="h-12 flex-1 gap-2 text-base">
              <Link to="/activate"><Rocket className="h-4 w-4" /> فعّل متجرك الآن</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2">
              <a href={`/c/${site.brand_slug}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /> جرّب مرة أخرى</a>
            </Button>
          </>
        ) : (
          <Button asChild size="lg" className="h-12 flex-1 gap-2 text-base" onClick={markTried}>
            <a href={`/c/${site.brand_slug}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /> جرّب متجرك الآن</a>
          </Button>
        )}
      </div>
    </section>
  );
}
