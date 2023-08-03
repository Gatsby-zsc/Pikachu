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
    <div className={className}>
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-2 font-heading text-xl font-bold">
          <Filter />
          <div>Filters</div>
        </div>
        <div className="space-y-4">
          {status === "authenticated" && (
            <div className="flex items-center space-x-2">
              <Checkbox onCheckedChange={viewFavourite} id="events-followed" />
              <Label htmlFor="events-followed">Only show events I follow</Label>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox onCheckedChange={filterOnline} id="online-events" />
            <Label htmlFor="online-events">Search for online events</Label>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-2 font-heading text-xl font-bold">
          <CalendarDays />
          <div>Date</div>
          <Button variant="ghost" onClick={restoreDate}>
            Reset
          </Button>
        </div>
        <RadioGroup
          defaultValue={value.Date}
          value={value.Date}
          onValueChange={changeDate}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Today" id="r1" />
            <Label htmlFor="r1">Today</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Tomorrow" id="r2" />
            <Label htmlFor="r2">Tomorrow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="This weekend" id="r3" />
            <Label htmlFor="r3">This weekend</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="mb-6">
        <Collapsible
          open={isOpenCategory}
          onOpenChange={setIsOpenCategory}
          className="w-[350px]"
        >
          <div className="mb-4 flex items-center space-x-2 font-heading text-xl font-bold">
            <LayoutDashboard />
            <div>Category</div>
            <Button variant="ghost" onClick={restoreCategory}>
              Reset
            </Button>
          </div>
          <RadioGroup
            defaultValue={value.Category}
            value={value.Category}
            onValueChange={changeCategory}
            className="space-y-2"
          >
            {eventCategories.map(
              (category, index) =>
                index < 3 && (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label htmlFor={category}> {category} </Label>
                  </div>
                )
            )}
            <CollapsibleContent className="space-y-2">
              {eventCategories.map(
                (category, index) =>
                  index >= 3 && (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}> {category} </Label>
                    </div>
                  )
              )}
            </CollapsibleContent>
          </RadioGroup>
          <CollapsibleTrigger asChild>
            <div className="mt-4 cursor-pointer text-sm font-semibold text-blue-600 hover:underline">
              {isOpenCategory ? "view less" : "view more"}
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
      <div>
        <Collapsible
          open={isOpenType}
          onOpenChange={setIsOpenType}
          className="w-[350px]"
        >
          <div className="mb-4 flex items-center space-x-2 font-heading text-xl font-bold">
            <SlidersHorizontal />
            <div>Type</div>
            <Button variant="ghost" onClick={restoreType}>
              Reset
            </Button>
          </div>

          <RadioGroup
            defaultValue={value.Type}
            value={value.Type}
            onValueChange={changeType}
            className="space-y-2"
          >
            {eventTypes.map(
              (type, index) =>
                index < 3 && (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type}> {type} </Label>
                  </div>
                )
            )}
            <CollapsibleContent className="space-y-2">
              {eventTypes.map(
                (type, index) =>
                  index >= 3 && (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}> {type} </Label>
                    </div>
                  )
              )}
            </CollapsibleContent>
          </RadioGroup>
          <CollapsibleTrigger asChild>
            <span className="mt-4 cursor-pointer text-sm font-semibold text-blue-600 hover:underline">
              {isOpenType ? "view less" : "view more"}
            </span>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </div>
  );
}

export default SidebarFilter;
