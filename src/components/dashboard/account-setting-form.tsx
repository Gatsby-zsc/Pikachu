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
import { api } from "@/utils/api";

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
  cardNum: z
    .string()
    .refine((cardNum) => cardNum.length === 16, {
      message: "The card number should be exactly 16 numbers",
    })
    .refine((cardNum) => /^\d+$/.test(cardNum), {
      message: "The card number should only contain digits",
    }),
  // expiryDateSchema: z.object({
  //   month: z.number().min(1, { message: "Month should be between 1 and 12" }).max(12, { message: "Month should be between 1 and 12" }),
  //   day: z.number().min(1, { message: "Day should be between 1 and 31" }).max(31, { message: "Day should be between 1 and 31" }),
  // }),
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

export const AccountSettingForm = () => {
  const updateUserInfo = api.userRouter.updateUser.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      // paymentType: "Master Card",
      cardNum: "",
      // expiryDateSchema: {},
      expiryDate: "",
      cardCVC: "",
      cardHoldName: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      name: data.name,
      phone: data.phone,
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
    console.log(newData);

    updateUserInfo.mutate(newData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-2/3 space-y-6"
      >
        <h1 className="mb-2 text-left text-4xl font-bold">
          Personal Information
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {/* First name */}
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

        {/* update profile photo  */}
        {/* TO DO */}
        <hr className="my-12" />
        <h1 className="mb-2 text-left text-4xl font-bold">Payment Method</h1>

        {/* Payment Types*/}
        {/* <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Card Number */}
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

        {/* Expiry day*/}
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

        <div className="grid grid-cols-2 gap-4">
          {/* Name on card */}
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
          {/* <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    ref={field.ref}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(+event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
