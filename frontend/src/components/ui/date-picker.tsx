"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange: (dateStr: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse YYYY-MM-DD to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : undefined
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD
      const dateStr = format(date, "yyyy-MM-dd")
      onChange(dateStr)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 hover:bg-slate-100/80 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition shadow-xs cursor-pointer",
            !value && "text-slate-400",
            className
          )}
        >
          <span className="flex items-center gap-2 font-medium">
            <CalendarIcon className="h-3.5 w-3.5 text-violet-600 flex-shrink-0" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
            {value || "YYYY-MM-DD"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
