"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white font-sans relative w-[320px] max-w-full", className)}
      classNames={{
        months: "flex flex-col space-y-3",
        month: "space-y-3",
        month_caption: "flex items-center justify-between px-1 mb-2 h-7",
        caption_label: "text-sm font-bold text-[#0F172A]",
        nav: "flex items-center gap-1.5 absolute top-4 right-4 z-10",
        button_previous: cn(
          "h-7 w-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg p-0 flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
        ),
        button_next: cn(
          "h-7 w-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg p-0 flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full justify-between mb-1.5",
        weekday: "text-slate-400 font-semibold text-[0.75rem] text-center w-9",
        weeks: "space-y-1 w-full",
        week: "flex w-full justify-between mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center",
        day_button: cn(
          "h-8 w-8 p-0 font-semibold text-xs text-slate-700 rounded-xl hover:bg-[#FFF1F2] hover:text-[#E11D48] transition flex items-center justify-center cursor-pointer"
        ),
        range_end: "range-end",
        selected:
          "bg-[#E11D48] text-white font-bold hover:bg-[#BE123C] hover:text-white rounded-xl shadow-xs",
        today: "bg-[#FFF1F2] text-[#E11D48] font-bold border border-[#E11D48]/40",
        outside: "text-slate-300 opacity-40",
        disabled: "text-slate-300 opacity-30 cursor-not-allowed pointer-events-none line-through",
        range_middle: "aria-selected:bg-[#FFF1F2] aria-selected:text-[#E11D48]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4 text-[#0F172A]" />
          }
          return <ChevronRight className="h-4 w-4 text-[#0F172A]" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
