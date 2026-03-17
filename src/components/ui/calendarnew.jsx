import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
} from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function Calendarnew({
  className,
  selected,
  onSelect,
  defaultMonth,
  numberOfMonths = 2,
}) {
  const [currentMonth, setCurrentMonth] = React.useState(
    defaultMonth || new Date()
  )

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDayClick = (day) => {
    if (!onSelect) return

    if (!selected?.from) {
      // First click: set 'from'
      onSelect({ from: day, to: undefined })
    } else if (!selected.to) {
      // Second click: set 'to', or reverse if clicked earlier date
      if (isBefore(day, selected.from)) {
        onSelect({ from: day, to: undefined })
      } else {
        onSelect({ from: selected.from, to: day })
      }
    } else {
      // Third click: reset and start new range
      onSelect({ from: day, to: undefined })
    }
  }

  const renderMonth = (monthOffset) => {
    const monthDate = addMonths(currentMonth, monthOffset)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    return (
      <div key={monthOffset} className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <div className="text-sm font-medium">
            {format(monthDate, "MMMM yyyy")}
          </div>
        </div>

        <div className="w-full border-collapse space-y-1">
          <div className="flex">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 mt-2">
            {days.map((day, idx) => {
              const isOutside = !isSameMonth(day, monthDate)
              const isSelectedFrom = selected?.from && isSameDay(day, selected.from)
              const isSelectedTo = selected?.to && isSameDay(day, selected.to)
              const isSelected = isSelectedFrom || isSelectedTo
              const isInRange =
                selected?.from &&
                selected?.to &&
                isWithinInterval(day, { start: selected.from, end: selected.to })

              // Determine classes for the range highlight background
              let wrapperClasses = "h-9 w-9 p-0 relative "
              if (isInRange && !isOutside) wrapperClasses += "bg-accent "
              if (isSelectedFrom && selected?.to) wrapperClasses += "rounded-l-md bg-accent "
              if (isSelectedTo && selected?.from) wrapperClasses += "rounded-r-md bg-accent "

              return (
                <div key={idx} className={wrapperClasses}>
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-9 w-9 p-0 font-normal hover:bg-primary hover:text-primary-foreground transition-none",
                      isSelected && !isOutside
                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                        : "",
                      isOutside ? "text-muted-foreground opacity-50" : "",
                      isInRange && !isSelected && !isOutside
                        ? "bg-accent text-accent-foreground"
                        : ""
                    )}
                    disabled={isOutside} // Disables clicking the faded "ghost" days from other months
                  >
                    {format(day, "d")}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-3 relative", className)}>
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <button
          type="button"
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Months Grid */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 mt-2 sm:mt-0">
        {Array.from({ length: numberOfMonths }).map((_, i) => renderMonth(i))}
      </div>
    </div>
  )
}