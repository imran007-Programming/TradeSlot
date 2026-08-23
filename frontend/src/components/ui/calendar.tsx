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
      className={cn("p-3 bg-white font-sans", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        month_caption: "flex justify-between pt-1 relative items-center px-1 mb-2",
        caption_label: "text-sm font-bold text-slate-800",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          "h-7 w-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg p-0 flex items-center justify-center transition absolute right-9"
        ),
        button_next: cn(
          "h-7 w-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg p-0 flex items-center justify-center transition absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full mb-1",
        weekday: "text-slate-400 rounded-md w-9 font-semibold text-[0.8rem] text-center",
        weeks: "space-y-1",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center",
        day_button: cn(
          "h-8 w-8 p-0 font-medium text-xs text-slate-700 rounded-xl hover:bg-violet-50 hover:text-violet-700 transition flex items-center justify-center cursor-pointer"
        ),
        range_end: "range-end",
        selected:
          "bg-violet-600 text-white font-bold hover:bg-violet-700 hover:text-white rounded-xl shadow-sm shadow-violet-200",
        today: "bg-slate-100 text-slate-900 font-bold border border-slate-300",
        outside: "text-slate-300 opacity-50",
        disabled: "text-slate-300 opacity-40 cursor-not-allowed",
        range_middle: "aria-selected:bg-violet-50 aria-selected:text-violet-700",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
