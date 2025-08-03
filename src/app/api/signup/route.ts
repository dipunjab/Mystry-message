import { sendVerficationEmail } from "@/helpers/sendVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        };

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 400 })
            } else {
                const hashedPasswrod = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPasswrod;
                existingUserByEmail.verifyCode = verifyCode;

                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save()
            }


        } else {
            const hashedPasswrod = await bcrypt.hash(password, 10);

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                hashedPasswrod,
                verifyCode,
                expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerficationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }


        return Response.json(
            {
                success: true,
                message: "User registered successfully. please verfiy email "
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Error Registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User"
            },
            {
                status: 500
            }
        )
    }
}