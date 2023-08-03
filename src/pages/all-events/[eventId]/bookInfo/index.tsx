import Layout from "@/components/landing-page/layout";
import { type ReactElement } from "react";
import { BookDetail } from "@/components/book-ticket-page/book-detail";
import React from "react";
import { useRouter } from "next/router";
import { Provider } from "jotai";

const BookInfoPage = () => {
  const router = useRouter();
  let eventId = router.query.eventId;
  if (Array.isArray(eventId)) {
    eventId = eventId[0];
  }
  if (!eventId) {
    return <div>WRONG EVENT!</div>;
  }
  return (
    <Provider>
      <div className="container mx-auto flex flex-col">
        <div className="flex w-full flex-col items-center">
          <BookDetail eventId={eventId} />
        </div>
      </div>
    </Provider>
  );
};

BookInfoPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default BookInfoPage;
