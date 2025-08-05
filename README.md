# Weather Microservice

This is a standalone weather microservice that returns **current weather** (in Celsius) and **location metadata** in `JSON` format, given a `city` and `country` code.

It is deployed publicly and accessible via an HTTP `GET` request.

---

## Live Endpoint

```
https://weather-microservice-phi.vercel.app/weather
```

---

## How to Use

### Request

**Method:** `GET`  
**Endpoint:** `/weather`  
**Query Parameters (required):**

| Parameter | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| `city`    | string | The name of the city                         |
| `country` | string | The 2-letter ISO country code (e.g. `US`)    |

**Example:**

```http
GET https://weather-microservice-phi.vercel.app/weather?city=Portland&country=US
```

---

### Response

If the request is valid, the response will be a JSON object with the following structure:

```json
{
  "location": {
    "name": "Portland",
    "country": "United States",
    "lat": 45.52,
    "lon": -122.68,
    "timezone": "America/Los_Angeles"
  },
  "weather": {
    "time": "2025-08-04T19:00",
    "temperature_2m": 23.5,
    "weather_code": 1,
    "wind_speed_10m": 4.7
  },
  "provider": "open-meteo"
}
```

---

## Expected Query Structure

The microservice **requires** both of the following:

- `city`: a string (e.g., `"Toronto"`, `"Paris"`, `"Osaka"`)
- `country`: a **2-letter ISO 3166 country code**, uppercase (e.g., `US`, `CA`, `JP`)

If either field is missing or invalid, the service will return an error like:

```json
{
  "error": "Missing city or country"
}
```

---

## Error Handling

| Status Code | Description                          | Example Message                  |
|-------------|--------------------------------------|----------------------------------|
| `400`       | Missing or invalid query parameters  | `"Missing city or country"`      |
| `404`       | Location not found                   | `"Location not found"`           |
| `500`       | Internal server error                | `"Server error"` + details       |

---

## Tech Stack

- **Node.js** (18+) with native `fetch`
- **Express.js** backend
- **TypeScript**
- Hosted on [Vercel](https://vercel.com)
- Weather and geocoding data from [Open-Meteo](https://open-meteo.com)

---

## Example Usage in TypeScript

```ts
const url = new URL('https://weather-microservice-phi.vercel.app/weather');
url.searchParams.set('city', 'Tokyo');
url.searchParams.set('country', 'JP');

const res = await fetch(url.toString());
const data = await res.json();
console.log(data);
```

---

## Sample Response File

You can also save the response locally using `fs/promises` (Node.js):

```ts
import { writeFile } from 'fs/promises';

const res = await fetch('https://weather-microservice-phi.vercel.app/weather?city=London&country=GB');
const json = await res.json();

await writeFile('london-weather.json', JSON.stringify(json, null, 2));
```

## A Complete TypeScript Usage Example

```ts

export interface WeatherResponse {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  weather: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  provider: string;
}

export async function getWeather(city: string, country: string): Promise<WeatherResponse> {
  const url = new URL('https://weather-microservice-phi.vercel.app/weather');
  url.searchParams.set('city', city);
  url.searchParams.set('country', country);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Weather service error');
  }

  const data: WeatherResponse = await response.json();
  return data;
}

async function testWeatherQuery() {
  try {
    const data = await getWeather('Portland', 'US');
    console.log('Weather Data:', JSON.stringify(data, null, 2));
  }

  catch (err: any) {
    console.error('Error:', err.message);
  }
}

testWeatherQuery();

```

## UML Class Diagram
<img width="3840" height="1267" alt="Untitled diagram _ Mermaid Chart-2025-08-05-035404" src="https://github.com/user-attachments/assets/c8031845-e67a-4f22-bf47-434b4af093d9" />

