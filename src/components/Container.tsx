import { cn } from '@/utils/cn';
import * as React from 'react';

export default function Container(props: React.HTMLProps<HTMLDivElement>){
    return(
        <div 
            {...props} 
            className={cn(
                    "w-full bg-ctp-base border-r-ctp-mantle rounded-xl flex py-4 shadow-sm", 
                    props.className
                )
            }
        />
    );
}