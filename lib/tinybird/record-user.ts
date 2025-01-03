import { capitalize, detectBot, fetchWithTimeout, getDomainWithoutWWW } from "@/lib/utils";
import { userAgent } from "next/server";

function getClientIP(req: Request) {
  const ips = req.headers.get("x-forwarded-for");
  return ips ? ips.split(",")[0] : "Unknown";
}

async function getAddressFromIP(ip: string) {
  if (ip !== "Unknown") {
    const res = await fetchWithTimeout(`https://api.ipquery.io/${ip}?format=json`, undefined, 3000);
    if (res.ok) {
      const json = await res.json();
      if (json.location) {
        return {
          country: json.location.country_code || "Unknown",
          city: json.location.city || "Unknown",
          region: json.location.state || "Unknown",
          latitude: json.location.latitude ? `${json.location.latitude}` : "Unknown",
          longitude: json.location.longitude ? `${json.location.longitude}` : "Unknown",
        };
      }
    }
  }

  return {
    country: "Unknown",
    city: "Unknown",
    region: "Unknown",
    latitude: "Unknown",
    longitude: "Unknown",
  };
}

export async function recordUser({
  req,
  appId,
  clientId,
}: {
  req: Request;
  appId: string;
  clientId: string;
}) {
  const isBot = detectBot(req);

  if (isBot) {
    return null;
  }

  const ua = userAgent(req);
  const referer = req.headers.get("referer");
  const ip = getClientIP(req);
  const address = await getAddressFromIP(ip);

  const data = {
    timestamp: new Date(Date.now()).toISOString(),
    app_id: appId,
    client_id: clientId,
    device: capitalize(ua.device.type) || "Desktop",
    device_vendor: ua.device.vendor || "Unknown",
    device_model: ua.device.model || "Unknown",
    browser: ua.browser.name || "Unknown",
    browser_version: ua.browser.version || "Unknown",
    engine: ua.engine.name || "Unknown",
    engine_version: ua.engine.version || "Unknown",
    os: ua.os.name || "Unknown",
    os_version: ua.os.version || "Unknown",
    cpu_architecture: ua.cpu?.architecture || "Unknown",
    ua: ua.ua || "Unknown",
    bot: ua.isBot,
    referer: referer ? getDomainWithoutWWW(referer) || "(direct)" : "(direct)",
    referer_url: referer || "(direct)",
    ip,
    ...address,
  };

  await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=users_events&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify(data),
  });
}
