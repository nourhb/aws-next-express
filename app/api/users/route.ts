import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { createUser, getUsers } from "@/lib/db/users-dynamodb"

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
    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const profilePicture = formData.get("profilePicture") as File

    if (!name || !email || !profilePicture) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload profile picture to S3
    const fileExtension = profilePicture.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const fileKey = `profile-pictures/${fileName}`

    const fileBuffer = await profilePicture.arrayBuffer()

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: profilePicture.type,
    }

    await s3Client.send(new PutObjectCommand(uploadParams))

    // Generate S3 URL
    const profilePictureUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

    // Save user to DynamoDB
    const user = await createUser({
      name,
      email,
      profilePictureUrl,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
