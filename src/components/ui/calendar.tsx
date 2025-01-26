"use client";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface IconProps {
  style?: React.CSSProperties;
  className: string;
  children?: React.ReactNode | null;
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // ... existing classNames remain the same
      }}
      components={{
        IconLeft: (props) => (
          <ChevronLeftIcon className={cn("h-4 w-4", props.className)} />
        ),
        IconRight: (props) => (
          <ChevronRightIcon className={cn("h-4 w-4", props.className)} />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
export { Calendar };