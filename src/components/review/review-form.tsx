import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { stopPropagate } from "@/utils/stop-propagate";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/review/star-rating";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
  reviewContent: z.string().min(10, {
    message: "Review Content must be at least 2 characters.",
  }),
});

interface CheckReviewProps {
  eventId: string;
  startDate: Date;
}

export const ReviewForm = (props: CheckReviewProps) => {
  const ctx = api.useContext();
  const createReview = api.reviewRouter.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Review Updated.",
      });
      void ctx.reviewRouter.getReviews.invalidate();
    },
  });
  const [rating, setRating] = useState(0);

  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reviewContent: "",
    },
  });

  const { data, isLoading, isError, error } =
    api.reviewRouter.checkReviewVaild.useQuery({ eventId: props.eventId });

  const [isDisabled, setDisabled] = useState(true);

  console.log(isDisabled);
  useEffect(() => {
    const currentDate = new Date();
    if (data && data.length != 0) {
      setDisabled(false);
    }
    if (currentDate > props.startDate && data && data.length > 0) {
      setDisabled(false);
    }
  }, [data, props.startDate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (data === null) {
    return <div>No data available</div>;
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      reviewContent: data.reviewContent,
      rating: rating,
      eventId: props.eventId,
    };
    createReview.mutate(newData);

    // close the sheet
    setOpen(false);

    form.reset();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          Reviews
          <ChevronRight className="mr-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Reviews</SheetTitle>
          <SheetDescription>Rating this event</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(onSubmit))}
            className="mt-6 space-y-4"
          >
            <StarRating setRating={setRating} />
            <FormField
              control={form.control}
              name="reviewContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Give us your feedback to help us to improve"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isDisabled} type="submit">
              Submit review
            </Button>
            {isDisabled && (
              <p className="underline decoration-pink-500">
                Sorry, You can not review now. Book a ticket and review after
                the event start.
              </p>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
