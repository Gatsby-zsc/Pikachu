import { type inferProcedureInput } from "@trpc/server";
import { expect, test } from "vitest";
import { appRouter, type AppRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";

test("example router", async () => {
  const ctx = createInnerTRPCContext({ session: null });
  const caller = appRouter.createCaller(ctx);

  type Input = inferProcedureInput<AppRouter["example"]["hello"]>;
  const input: Input = {
    text: "test",
  };

  const example = await caller.example.hello(input);

  expect(example).toMatchObject({ greeting: "Hello test" });
});
