import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { eventCategories, eventTypes } from "@/config/create-event";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { api } from "@/utils/api";
import { string } from "zod";

type SidebarFilterTypes = React.HTMLAttributes<HTMLDivElement>;

function SidebarFilter({ className }: SidebarFilterTypes) {
  const [date, setDates] = useState("");
  // new Date
  const [isOpenCategory, setIsOpenCategory] = React.useState(false);

  const [isOpenType, setIsOpenType] = React.useState(false);

  api.eventRouter.filterEvents.useQuery({});

  return (
    <div className="mt-5">
      <div className={className}>
        <div id="default-filter">
          <p className="text-xl font-bold">Filters</p>
          <Checkbox id="events-followed" className="mr-2 space-x-2" />
          <Label htmlFor="events-followed">Only show events I follow</Label>
          <br />
          <Checkbox id="online-events" className="mr-2 space-x-2" />
          <Label htmlFor="online-events">Search for online events</Label>
        </div>
        <div id="date-filter" className="mt-8">
          <p className="mb-1 text-xl font-bold">Date</p>
          <RadioGroup defaultValue={date} value={date} onValueChange={setDates}>
            <div className="space-x-2">
              <RadioGroupItem value="Today" id="r1" />
              <Label htmlFor="r1">Today</Label>
            </div>
            <div className="space-x-2">
              <RadioGroupItem value="Tomorrow" id="r2" />
              <Label htmlFor="r2">Tomorrow</Label>
            </div>
            <div className="space-x-2">
              <RadioGroupItem value="This weekend" id="r3" />
              <Label htmlFor="r3">This weekend</Label>
            </div>
          </RadioGroup>
          {/* <button
            onClick={() => {
              setDates("");
            }}
          >
            change
          </button> */}
        </div>
        <div id="category-filter" className="mt-8">
          <Collapsible
            open={isOpenCategory}
            onOpenChange={setIsOpenCategory}
            className="w-[350px] space-y-2"
          >
            <p className="mb-1 text-xl font-bold">Category</p>
            <RadioGroup>
              {eventCategories.map(
                (category, index) =>
                  index < 3 && (
                    <div key={index} className="space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}> {category} </Label>
                    </div>
                  )
              )}
              <CollapsibleContent className="space-y-2">
                {eventCategories.map(
                  (category, index) =>
                    index >= 3 && (
                      <div key={index} className="space-x-2">
                        <RadioGroupItem value={category} id={category} />
                        <Label htmlFor={category}> {category} </Label>
                      </div>
                    )
                )}
              </CollapsibleContent>
            </RadioGroup>
            <CollapsibleTrigger asChild>
              <span className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline">
                view more
              </span>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <div id="type-filter" className="mt-8">
          <Collapsible
            open={isOpenType}
            onOpenChange={setIsOpenType}
            className="w-[350px] space-y-2"
          >
            <p className="mb-1 text-xl font-bold">Type</p>
            <RadioGroup>
              {eventTypes.map(
                (type, index) =>
                  index < 3 && (
                    <div key={index} className="space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}> {type} </Label>
                    </div>
                  )
              )}
              <CollapsibleContent className="space-y-2">
                {eventTypes.map(
                  (type, index) =>
                    index >= 3 && (
                      <div key={index} className="space-x-2">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type}> {type} </Label>
                      </div>
                    )
                )}
              </CollapsibleContent>
            </RadioGroup>
            <CollapsibleTrigger asChild>
              <span className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline">
                view more
              </span>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export default SidebarFilter;
