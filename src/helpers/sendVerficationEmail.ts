import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse"


export async function sendVerficationEmail(
    email: string,
    username: string,
    verfiyCode: string,
): Promise<ApiResponse> {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry message| Verification Code',
            react: VerificationEmail({username, otp: verfiyCode}),
        });


        return { success: true, message: "verfication email send successfully" }

    } catch (error) {
        console.error("Error Sending verfication email", error);
        return { success: false, message: "Failed to send verfication email" }
    }

}