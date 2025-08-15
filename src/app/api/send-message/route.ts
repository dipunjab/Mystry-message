import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/User";
import { Message } from "@/modal/User";


export async function POST(request: Request) {
    await dbConnect();

    const {username,  content} = await request.json();

    try {
        const user = await UserModel.findOne({ username });
                if (!user) {
            return Response.json(
            {
                success: false,
                message: "User Not Found"
            },
            { status: 404 }
        )
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
            {
                success: false,
                message: "User Not accepting messages"
            },
            { status: 403 }
        )
        }

        const newMeesage = { content, createdAt: new Date()};
        user.messages.push(newMeesage as Message);

        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message Sent successfully"
            },
            { status: 200 }
        )
        

    } catch (error) {
        console.log("failed to send message", error);
        
        return Response.json(
            {
                success: false,
                message: "failed to send message"
            },
            { status: 500 }
        )
    }
}
