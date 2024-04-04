/**@format */
export function convertWindSpeed(speed:number): string{
    const kmh=speed*3.6;
    return `${kmh.toFixed(0)} km/h`;
}