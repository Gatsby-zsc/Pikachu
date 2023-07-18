import { ChevronsUpDown } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

import { cn } from "@/utils/style-utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { env } from "@/env.mjs";

import { type FormSchema } from "@/components/create-event/create-event-form";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

interface LocationFieldProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
}

export function LocationField({ form }: LocationFieldProps) {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // useEffect(() => {
  //   // fetch place details for the first element in placePredictions array
  //   if (placePredictions.length && placePredictions[0])
  //     placesService?.getDetails(
  //       {
  //         placeId: placePredictions[0].place_id,
  //       },
  //       (placeDetails) => console.log(placeDetails as string)
  //     );
  // }, [placePredictions]);

  return (
    <FormField
      control={form.control}
      name="venue"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Find your location</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <Command>
                <CommandInput
                  placeholder="Search address..."
                  onValueChange={(value: string) => {
                    getPlacePredictions({ input: value });
                  }}
                />
                <CommandEmpty>No address found.</CommandEmpty>
                <CommandGroup>
                  {placePredictions.map((prediction) => (
                    <CommandItem
                      value={prediction.description}
                      key={prediction.place_id}
                      onSelect={() => {
                        form.setValue("venue", prediction.description);
                        console.log(prediction.description);
                      }}
                    >
                      {prediction.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>Powered by Google</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
