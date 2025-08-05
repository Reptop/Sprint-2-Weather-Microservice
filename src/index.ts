import express from 'express';

const app = express();

app.get('/weather', async (req, res) => {
  const city = String(req.query.city || '').trim();
  const country = String(req.query.country || '').trim().toUpperCase();

  if (!city || !country) {
    return res.status(400).json({ error: 'Missing city or country' });
  }

  try {
    // Geocoding
    const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geoUrl.searchParams.set('name', city);
    geoUrl.searchParams.set('count', '5');
    geoUrl.searchParams.set('format', 'json');

    const geoResp = await fetch(geoUrl.toString());
    const geoJson = await geoResp.json() as any;

    if (!geoJson.results || geoJson.results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const best = geoJson.results.find((r: any) => r.country_code?.toUpperCase() === country)
      ?? geoJson.results[0];

    // Weather
    const wxUrl = new URL('https://api.open-meteo.com/v1/forecast');
    wxUrl.searchParams.set('latitude', best.latitude);
    wxUrl.searchParams.set('longitude', best.longitude);
    wxUrl.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
    wxUrl.searchParams.set('timezone', best.timezone ?? 'auto');

    const wxResp = await fetch(wxUrl.toString());
    const wxJson = await wxResp.json() as any;

    return res.status(200).json({
      location: {
        name: best.name,
        country: best.country,
        lat: best.latitude,
        lon: best.longitude,
        timezone: best.timezone
      },
      weather: wxJson.current,
      provider: 'open-meteo'
    });
  } catch (e: any) {
    res.status(500).json({ error: 'Server error', detail: e.message });
  }
});

// ✅ Required for Vercel Serverless
export default app;

// ✅ Optional: Local dev mode
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌤️ Weather service running on http://localhost:${PORT}`);
  });
}

