import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { SectionLayout } from "@/components/create-event/section-layout";
import { api } from "@/utils/api";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { Separator } from "@/components/ui/separator";

type RouterOutput = inferRouterOutputs<AppRouter>;
type UserDetails = RouterOutput["userRouter"]["getUserDetails"];

interface AccountSettingFormProps {
  user: UserDetails;
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "The first name of user should be at least 2 characters",
  }),
  // paymentType: z.string(),
  phone: z
    .string()
    .refine((phone) => phone.length === 10, {
      message: "The telephone number should be exactly 16 numbers",
    })
    .refine((phone) => /^\d+$/.test(phone), {
      message: "The telephone number should only contain digits",
    }),
  billingAddress: z.string().min(10, {
    message: "The billing address should be at least 10 characters",
  }),
  shippingAddress: z.string().min(10, {
    message: "The shipping address should be at least 10 characters",
  }),
  billingPostcode: z.string().refine((phone) => phone.length === 4, {
    message: "The Postcode should be exactly 4 numbers",
  }),
  shippingPostcode: z.string().refine((phone) => phone.length === 4, {
    message: "The Postcode should be exactly 4 numbers",
  }),
  cardNum: z
    .string()
    .refine((cardNum) => cardNum.length === 16, {
      message: "The card number should be exactly 16 numbers",
    })
    .refine((cardNum) => /^\d+$/.test(cardNum), {
      message: "The card number should only contain digits",
    }),
  expiryDate: z
    .string()
    .refine((cardNum) => cardNum.length === 4, {
      message: "The card number should be exactly 16 numbers",
    })
    .refine((cardNum) => /^\d+$/.test(cardNum), {
      message: "The card number should only contain digits",
    }),
  cardCVC: z
    .string()
    .refine((cardCVC) => cardCVC.length === 3, {
      message: "The card number should be exactly 16 numbers",
    })
    .refine((cardCVC) => /^\d+$/.test(cardCVC), {
      message: "The card number should only contain digits",
    }),
  cardHoldName: z.string().min(2, {
    message: "The hold name of card should be at least 2 characters",
  }),
});

export const AccountSettingForm = ({ user }: AccountSettingFormProps) => {
  const updateUserInfor = api.userRouter.updateUser.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      billingAddress: user?.billingAddress ?? "",
      shippingAddress: user?.shippingAddress ?? "",
      billingPostcode: user?.billingPostcode ?? "",
      shippingPostcode: user?.shippingPostcode ?? "",
      cardNum: user?.cardNum ?? "",
      expiryDate: user?.expiryDate ?? "",
      cardCVC: user?.cardCVC ?? "",
      cardHoldName: user?.cardHoldName ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      name: data.name,
      phone: data.phone,
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      billingPostcode: data.billingPostcode,
      shippingPostcode: data.shippingPostcode,
      // paymentType: data.paymentType,
      cardNum: data.cardNum,
      expiryDate: data.expiryDate,
      cardCVC: data.cardCVC,
      cardHoldName: data.cardHoldName,
    };

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(newData, null, 2)}</code>
        </pre>
      ),
    });

    updateUserInfor.mutate(newData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-5 w-full space-y-6"
      >
        <SectionLayout
          name="Basic Information"
          description="Please enter your basic information"
          icon="userCircle2"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* phone  */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="0401000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Billing Address */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Billing Code */}
            <FormField
              control={form.control}
              name="billingPostcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Post Code</FormLabel>
                  <FormControl>
                    <Input placeholder="2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* shipping Address */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Shipping Code */}
            <FormField
              control={form.control}
              name="shippingPostcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Post Code</FormLabel>
                  <FormControl>
                    <Input placeholder="2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionLayout>

        <Separator />

        <SectionLayout
          name="Payment Method"
          description="Please enter your payment method"
          icon="creditCard"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cardNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012 3456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardHoldName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on card</FormLabel>
                  <FormControl>
                    <Input placeholder="J Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry day</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CVC */}
            <FormField
              control={form.control}
              name="cardCVC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVC/CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionLayout>

        <div className="w-full">
          <Button type="submit" className="ml-auto block">
            Submit
          </Button>
        </div>
        <div className="my-12" />
      </form>
    </Form>
  );
};
