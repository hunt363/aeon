/** @format */

export function getDayOrNightIcon(
    iconName: string,
    dateTime: string
): string{
    const hours=new Date(dateTime).getHours();
    const isDayTime=hours>=6&&hours<18;
    return isDayTime?iconName.replace(/.$/,"d"):iconName.replace(/.$/,"n");
}