import { type SendVerificationRequestParams } from "next-auth/providers";
import { resend } from "@/lib/resend";
import LoginEmailPage from "@/utils/login-email-page";

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  try {
    await resend.sendEmail({
      from: "noreply@pikapika.stimw.com",
      to: params.identifier,
      subject: "Magic Link ~ Login to PikaPika",
      react: <LoginEmailPage {...params} />,
    });
  } catch (error) {
    console.log({ error });
  }
};
