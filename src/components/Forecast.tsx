import * as React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { Props } from './WeatherDetails';
import { convertToCelcius } from '@/utils/convertToCelcius';

export interface ForecastProps extends Props{
    weatherIcon:string;
    date: string;
    day:string;
    temp:number;
    feels_like:number;
    temp_min:number;
    temp_max:number;
    description:string;
}
export default function Forecast(props:ForecastProps){
    const{
        weatherIcon="",
        date="",
        day="",
        temp=0,
        feels_like=0,
        temp_min=0,
        temp_max=0,
        description=""
    }=props;
    return(
        <Container className="gap-4">
            <section className="flex gap-4 items-center px-4">
                <div className="flex flex-col gap-1 items-center">
                    <WeatherIcon iconName={weatherIcon}/>
                    <p>{date}</p>
                    <p className="text-sm">{day}</p>
                </div>
                <div className="flex flex-col px-4">
                    <span className="text-5xl">{convertToCelcius(temp??0)}°C</span>
                    <p className='text-xs space-x-1 whitespace-nowrap'>
                        <span>Feels like</span>
                        <span>{convertToCelcius(feels_like??0)}°C</span>
                    </p>
                    <p className="capitalize">{description}</p>
                </div>
            </section>

            <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
                <WeatherDetails{...props}/>
            </section>
        </Container>
    )
}