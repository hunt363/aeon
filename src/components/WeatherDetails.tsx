import * as React from 'react';
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export interface Props{
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: Props){
    const {
        visibility="",
        humidity="",
        windSpeed="",
        airPressure="",
        sunrise="",
        sunset=""
    }=props;
    return (
    <>
        <Detail property="Visibility" icon={<LuEye className="text-ctp-teal"/>} value={visibility}/>
        <Detail property="Humidity" icon={<FiDroplet className="text-ctp-blue"/>} value={humidity}/>
        <Detail property="Wind Speed" icon={<MdAir className="text-ctp-green"/>} value={windSpeed}/>
        <Detail property="Air Pressure" icon={<ImMeter className="text-ctp-yellow"/>} value={airPressure}/>
        <Detail property="Sunrise" icon={<LuSunrise className="text-ctp-red"/>} value={sunrise}/>
        <Detail property="Sunset" icon={<LuSunset className="text-ctp-red"/>} value={sunset}/>
    </>
    )
}

export interface DetailProps{
    property: string,
    icon: React.ReactNode,
    value: string
}
function Detail(props: DetailProps){
    return(
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-text">
            <p className="whitespace-nowrap">{props.property}</p>
            <div className="text-3xl">{props.icon}</div>
            <p className="whitespace-nowrap">{props.value}</p>
        </div>
    )
}