// Cranston, RI coordinates
const LAT = 41.7798
const LNG = -71.4373

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York`

// WMO weather code → human-readable condition
const WMO_CONDITIONS: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ Hail',
  99: 'Thunderstorm w/ Hail',
}

export interface WeatherData {
  temp: number
  condition: string
}

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) return null
    const data = await res.json()
    const temp = Math.round(data.current.temperature_2m)
    const code = data.current.weather_code as number
    const condition = WMO_CONDITIONS[code] ?? 'Unknown'
    return { temp, condition }
  } catch {
    return null
  }
}
