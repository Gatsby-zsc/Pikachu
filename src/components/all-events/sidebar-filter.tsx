import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { eventCategories, eventTypes } from "@/config/create-event";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  LayoutDashboard,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

type FilterListType = {
  Date: string;
  Category: string;
  Type: string;
  isOnline: boolean;
  onlyEventsFollowed: boolean;
  sortKey: string;
  userKey: string;
  sortDirection: string;
};

interface SidebarFilterProps {
  className: string;
  value: FilterListType;
  func: React.Dispatch<React.SetStateAction<FilterListType>>;
}

function SidebarFilter({ className, value, func }: SidebarFilterProps) {
  const [isOpenCategory, setIsOpenCategory] = React.useState(false);

  const [isOpenType, setIsOpenType] = React.useState(false);

  const { status } = useSession();

  function viewFavourite(checked: boolean) {
    func((data) => ({ ...data, onlyEventsFollowed: checked }));
  }

  function filterOnline(checked: boolean) {
    func((data) => ({ ...data, isOnline: checked }));
  }

  function changeDate(newDate: string) {
    func((data) => ({ ...data, Date: newDate }));
  }

  function restoreDate() {
    func({ ...value, Date: "none" });
  }

  function changeCategory(newCategory: string) {
    func((data) => ({ ...data, Category: newCategory }));
  }

  function restoreCategory() {
    func({ ...value, Category: "none" });
    setIsOpenCategory(false);
  }

  function changeType(newType: string) {
    func((data) => ({ ...data, Type: newType }));
  }

  function restoreType() {
    func({ ...value, Type: "none" });
    setIsOpenType(false);
  }

  return (
    <div className="mt-5">
      <div className={className}>
        <div id="default-filter">
          <p className="text-xl font-bold">
            <Filter className="mb-1 mr-1 inline-block" />
            Filters
          </p>
          {status === "authenticated" && (
            <>
              <Checkbox
                onCheckedChange={viewFavourite}
                id="events-followed"
                className="mb-3 mr-2 space-x-2"
              />
              <Label htmlFor="events-followed">Only show events I follow</Label>
              <br />
            </>
          )}
          <Checkbox
            onCheckedChange={filterOnline}
            id="online-events"
            className="mr-2 space-x-2"
          />
          <Label htmlFor="online-events">Search for online events</Label>
        </div>
        <div id="date-filter" className="mt-5">
          <span className="mr-1 text-center text-xl font-bold">
            <CalendarDays className="mb-1 mr-1 inline-block" />
            Date
            <Button variant="ghost" onClick={restoreDate}>
              Reset
            </Button>
          </span>
          <RadioGroup
            defaultValue={value.Date}
            value={value.Date}
            onValueChange={changeDate}
          >
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
        </div>
        <div id="category-filter" className="mt-5">
          <Collapsible
            open={isOpenCategory}
            onOpenChange={setIsOpenCategory}
            className="w-[350px] space-y-2"
          >
            <span className="text-center text-xl font-bold">
              <LayoutDashboard className="mb-1 mr-1 inline-block" />
              Category
              <Button variant="ghost" onClick={restoreCategory}>
                Reset
              </Button>
            </span>
            <RadioGroup
              defaultValue={value.Category}
              value={value.Category}
              onValueChange={changeCategory}
            >
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
                {isOpenCategory ? "view less" : "view more"}
              </span>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <div id="type-filter" className="mt-5">
          <Collapsible
            open={isOpenType}
            onOpenChange={setIsOpenType}
            className="w-[350px] space-y-2"
          >
            <span className="text-center text-xl font-bold">
              <SlidersHorizontal className="mb-1 mr-1 inline-block" />
              Type
              <Button variant="ghost" onClick={restoreType}>
                Reset
              </Button>
            </span>

            <RadioGroup
              defaultValue={value.Type}
              value={value.Type}
              onValueChange={changeType}
            >
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
                {isOpenType ? "view less" : "view more"}
              </span>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export default SidebarFilter;
