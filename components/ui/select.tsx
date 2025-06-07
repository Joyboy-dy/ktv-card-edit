import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "./button"

interface SelectProps {
  years: number[];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
}

export function SelectYear({ years, selectedYear, onSelectYear }: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedYear
            ? years.find((year) => year === selectedYear)
            : "Sélectionner l'année..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search year..." className="h-9" />
          <CommandList>
            <CommandEmpty>Aucune correspondance.</CommandEmpty>
            <CommandGroup>
              {years.map((year) => (
                <CommandItem
                  key={year}
                  value={year.toString()}
                  onSelect={(currentValue) => {
                    onSelectYear(Number(currentValue))
                    setOpen(false)
                  }}
                >
                  {year}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedYear === year ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}