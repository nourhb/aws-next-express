import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { dynamoService } from "@/lib/aws/dynamodb-service"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function GET() {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "AWS credentials not configured" }, { status: 500 })
    }

    const users = await dynamoService.getAllUsers()
    return NextResponse.json(users)
  } catch (err) {
    console.error("❌ DynamoDB connection failed:", err)
    return NextResponse.json({ error: "DynamoDB connection failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const profilePicture = formData.get("profilePicture") as File

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Create user in DynamoDB
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "AWS credentials not configured" }, { status: 500 })
    }
    
    const existingUser = await dynamoService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    let profilePictureUrl = ""

    // Upload profile picture to S3 if provided
    if (profilePicture && profilePicture.size > 0 && process.env.AWS_S3_BUCKET_NAME) {
      try {
        const fileExtension = profilePicture.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExtension}`
        const fileKey = `profile-pictures/${fileName}`

        const fileBuffer = await profilePicture.arrayBuffer()

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: Buffer.from(fileBuffer),
          ContentType: profilePicture.type,
        }

        await s3Client.send(new PutObjectCommand(uploadParams))
        profilePictureUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
      } catch (s3Error) {
        console.error("❌ S3 upload failed:", s3Error)
        // Continue without profile picture
      }
    }

    // Save user to DynamoDB
    const user = await dynamoService.createUser({
      name,
      email,
      profilePictureUrl,
    })
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    console.error("Error creating user in DynamoDB:", err)
    return NextResponse.json({ error: "Failed to create user in DynamoDB" }, { status: 500 })
  }
} 