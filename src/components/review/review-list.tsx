import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { getDuration } from "@/utils/date";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { DisplayStarRating } from "@/components/review/display-star-rating";

interface eventIdProps {
  eventId: string;
}
export const ReviewList = (props: eventIdProps) => {
  const { data: event } = api.reviewRouter.checkReplyValid.useQuery(
    props.eventId
  );

  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const updateHostResponse = api.reviewRouter.updateHostResponse.useMutation({
    onSuccess: () => {
      toast({
        title: "Host Response Updated.",
      });
      void ctx.reviewRouter.getReviews.invalidate();
      void ctx.reviewRouter.checkReplyValid.invalidate();
    },
  });
  const [hostResponse, setResponse] = useState("");
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = api.reviewRouter.getReviews.useQuery(props.eventId);

  console.log(reviews);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (reviews === null) {
    return <div>No data available</div>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(event.target.value);
  };

  const onSubmit = (id: string, hostResponse: string) => {
    if (hostResponse.length < 5) {
      toast({
        title: "Not enough words.",
        description: "Please add more response.",
        variant: "destructive",
      });
      return;
    }
    updateHostResponse.mutate({ id, hostResponse });

    setOpen(false);
    setResponse("");
  };
  const currentDate = new Date();

  return (
    <div>
      {reviews.map((review) => (
        <div className="flex flex-col space-y-4" key={review.id}>
          <div className="mb-4 flex items-center space-x-2 text-sm text-slate-400">
            <DisplayStarRating rating={review.rating} />
            <div className="text-lg font-semibold text-slate-600">
              {review.rating.toFixed(1)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4 text-sm text-slate-400">
              <p>
                Rating by{" "}
                <span className="font-semibold text-slate-600">
                  {review.user.name}
                </span>
              </p>
            </div>
            <div className="w-full">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  {!review.hostResponse && event && (
                    <Button variant="outline" className="ml-auto block px-2">
                      Reply
                    </Button>
                  )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adding Your Reply</DialogTitle>
                    <DialogDescription>
                      Make your reply for this review, click submit when you
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor="hostresponse" className="text-left">
                        Reply Message
                      </Label>
                      <Textarea
                        id="hostresponse"
                        value={hostResponse}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => onSubmit(review.id, hostResponse)}
                    >
                      Submit Reply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-4 text-base text-slate-600">
            {review.reviewContent}
          </div>
          <div className="mb-4 text-xs text-slate-400">
            Reviewed at {getDuration(review.reviewDate, currentDate)} ago
          </div>

          {review.hostResponse && (
            <>
              <Separator className="my-12" />
              <div className="mb-4 text-sm text-slate-400">
                <p>
                  Replied by{" "}
                  <span className="font-semibold text-slate-600">
                    {review.user.name}
                  </span>
                </p>
              </div>
              <p className="text-gray-600">{review.hostResponse}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
