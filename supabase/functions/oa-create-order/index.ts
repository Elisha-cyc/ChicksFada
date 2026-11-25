import { createClient } from "npm:@supabase/supabase-js@2.119.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed." });

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 16000) return json(413, { error: "Order details are too large." });

  let payload: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 16000) return json(413, { error: "Order details are too large." };
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: "Please send valid order details." });
  }

  const buyerName = typeof payload.buyer_name === "string" ? payload.buyer_name.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const address = typeof payload.delivery_address === "string" ? payload.delivery_address.trim() : "";
  const items = payload.items;

  if (buyerName.length < 1 || buyerName.length > 120 ||
      phone.length < 5 || phone.length > 40 ||
      address.length < 5 || address.length > 500 ||
      !Array.isArray(items) || items.length < 1 || items.length > 20) {
    return json(400, { error: "Please check your name, phone, delivery location and bag." });
  }

  const cleanItems = [];
  for (const item of items) {
    if (!item || typeof item.product_id !== "string" ||
        typeof item.size !== "string" || item.size.length > 20 ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
      return json(400, { error: "One of the items in your bag is invalid." });
    }
    cleanItems.push({
      product_id: item.product_id,
      size: item.size.trim(),
      quantity: item.quantity,
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json(503, { error: "Ordering is temporarily unavailable." });

  const ip = req.headers.get("cf-connecting-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown";
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(serviceKey + "|" + ip),
  );
  const ipHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0")).join("");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: allowed, error: rateError } = await supabase.rpc(
    "oa_consume_checkout_rate",
    { p_ip_hash: ipHash },
  );
  if (rateError || allowed !== true) {
    return json(429, { error: "Too many order attempts. Please wait a little and try again." });
  }

  const { data, error } = await supabase.rpc("oa_place_order", {
    p_buyer_name: buyerName,
    p_phone: phone,
    p_delivery_address: address,
    p_items: cleanItems,
  });

  if (error) {
    return json(400, { error: error.message || "Could not place this order. Please check stock and try again." });
  }

  return json(200, { success: true, order: data });
});
