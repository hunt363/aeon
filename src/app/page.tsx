"use client";

import Container from "@/components/Container";
import Forecast from "@/components/Forecast";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertToCelcius } from "@/utils/convertToCelcius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
}

interface WeatherEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherInfo[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

const API_KEY=process.env.NEXT_PUBLIC_API_KEY;

export default function Home() {

  const [place, setPlace]=useAtom(placeAtom);
  const [loadingCity ,setLoadingCity]=useAtom(loadingCityAtom);
  
  const { isLoading, error, data , refetch} = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`
      );
      return data;
    }
  );
  useEffect(()=>{refetch()}, [place,refetch])
  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  console.log(data);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center bg-ctp-crust text-ctp-text">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-ctp-crust text-ctp-text min-h-screen">
      <Navbar location={data?.city.name}/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity? <WeatherSkeleton/>:
        <>
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd/MM/yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertToCelcius(firstData?.main.temp ?? 300)}°C
                </span>
                <p className="text-xs space-x-4 whitespace-nowrap">
                  <span>
                    Feels like{" "}
                    {convertToCelcius(firstData?.main.feels_like ?? 300)}°C
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    Min:{convertToCelcius(firstData?.main.temp_min ?? 300)}°C
                  </span>
                  <span>
                    Max:{convertToCelcius(firstData?.main.temp_max ?? 300)}°C
                  </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 scrollbar-thin scrollbar-track-ctp-mantle scrollbar-thumb-ctp-lavender overflow-x-auto w-full justify-between pr-3 pb-5">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "hh:mm a")}
                    </p>
                    <WeatherIcon
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    />
                    <p>{convertToCelcius(d?.main.temp ?? 300)}°C</p>
                  </div>
                ))}
              </div>
            </Container>
            <div className="flex gap-4">
              <Container className="w-fit justify-center flex-col px-4 items-center">
                <p className="capitalize text-center">
                  {firstData?.weather[0].description}{""}
                </p>
                <WeatherIcon
                  iconName={getDayOrNightIcon(firstData?.weather[0].icon??"", firstData?.dt_txt??"")}
                />
              </Container>
              <Container className="bg-ctp-base px-6 gap-4 justify-between overflow-x-auto scrollbar-thin scrollbar-track-ctp-mantle scrollbar-thumb-ctp-lavender">
                <WeatherDetails
                  visibility={firstData?.visibility.toString()+"m"??""}
                  airPressure={firstData?.main.pressure+" hPa"??""}
                  windSpeed={convertWindSpeed(firstData?.wind.speed??0)}
                  humidity={firstData?.main.humidity+"%"??""}
                  sunrise={format(fromUnixTime(data?.city.sunrise??0),"hh:mm a")}
                  sunset={format(fromUnixTime(data?.city.sunset??0),"hh:mm a")}
                />
              </Container>
            </div>
          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">7-Day Forecast</p>
          {firstDataForEachDate.map((d, i) => (
                <Forecast
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd/MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "EEEE") : "EEEE"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 0),
                    "hh:mm a"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 0),
                    "hh:mm a"
                  )}
                  visibility={`${(d?.visibility ?? 10000)}m`}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
        </section>
        </>}
      </main>
    </div>
  );
}
function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-ctp-base rounded"></div>
          <div className="h-6 w-24 bg-ctp-base rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-ctp-base rounded"></div>
              <div className="h-6 w-6 bg-ctp-base rounded-full"></div>
              <div className="h-6 w-16 bg-ctp-base rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-ctp-base rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-ctp-base rounded"></div>
            <div className="h-10 w-10 bg-ctp-base rounded-full"></div>
            <div className="h-8 w-28 bg-ctp-base rounded"></div>
            <div className="h-8 w-28 bg-ctp-base rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
