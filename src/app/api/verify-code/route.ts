import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne(
            { username: decodedUsername }
        );

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500 }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Account verfied successfully"
                },
                { status: 200 }
            )
        } else if(!isCodeExpired){
            return Response.json(
                {
                    success: false,
                    message: "Code Expired"
                },
                { status: 500 }
            )
        } else{
            return Response.json(
                {
                    success: false,
                    message: "Code is not valid"
                },
                { status: 500 }
            )
        }

    } catch (error) {
        console.log("Error checking Verify Code: ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking Verify Code"
            },
            { status: 500 }
        )
    }
}