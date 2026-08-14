import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("lat") ?? "6.5244");
  const longitude = Number(params.get("lon") ?? "3.3792");
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return Response.json({ error: "Invalid coordinates" }, { status: 400 });
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), current: "temperature_2m,apparent_temperature,is_day,weather_code", daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max", forecast_days: "3", timezone: "auto" }).toString();
  try {
    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error("Weather provider failed");
    return Response.json(await response.json());
  } catch {
    return Response.json({ error: "Weather is temporarily unavailable" }, { status: 503 });
  }
}
