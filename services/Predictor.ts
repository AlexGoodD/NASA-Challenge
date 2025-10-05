import axios from "axios";
import env from "#start/env";



export async function getFutureForecast(
  {
    lat, lon, date
  }: {
    lat: number
    lon: number
    date: string
  }
){
  const url = "https://api.openweathermap.org/data/3.0/onecall/day_summary";

  const {data} = await axios.get(url, {
    params: {
      appid: env.get('OPEN_WEATHER_API'),
      lat, 
      lon,
      date
    }
  })

  return data;
}