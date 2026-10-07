import { createServerFn } from "@tanstack/react-start";

/** Whether the signed-in merchant has an active plan (set by the platform admin). */
export const getSubscriptionStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ subscribed: boolean }> => {
    const { requirePermission } = await import("@/lib/session-guard.server");
    const { getSupabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = await requirePermission("brand_data");
    const { data } = await getSupabaseAdmin().auth.admin.getUserById(userId);
    return { subscribed: data?.user?.app_metadata?.subscribed === true };
  },
);
