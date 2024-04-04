import { cn } from "@/utils/cn";
import React from "react";
import { MdSearch } from "react-icons/md";

type Props={
    className?:string;
    value:string;
    onChange:React.ChangeEventHandler<HTMLInputElement>|undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement>|undefined;
}

export default function SearchBox(props: Props){
    return(
        <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10",props.className)}>
            <input 
                type="text" 
                value={props.value}
                onChange={props.onChange}
                placeholder="Search location..."
                className="px-4 py-2 w-[230px] border
                    border-gray-300 rounded-l-md focus:outline-none
                    focus:border-purple-600 h-full
                "
            />
            <button className="px-4 py-[9px] bg-purple-600 text-white rounded-r-md focus:outline-none hover:bg-purple-500 whitespace-nowrap h-full">
                <MdSearch/>
            </button>
        </form>
    )
}