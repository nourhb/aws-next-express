import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// Mock data for development
const mockDynamoUsers = [
  {
    id: "dynamo-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dynamo-2",
    name: "Bob Wilson",
    email: "bob@example.com",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

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
    // Try to use DynamoDB first
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      const { dynamoService } = await import("@/lib/aws/dynamodb-service")
      const users = await dynamoService.getAllUsers()
      return NextResponse.json(users)
    } else {
      // Fallback to mock data for development
      console.log("Using mock DynamoDB data - AWS not configured")
      return NextResponse.json(mockDynamoUsers)
    }
  } catch (error) {
    console.error("Error fetching users from DynamoDB:", error)
    console.log("Falling back to mock DynamoDB data")
    return NextResponse.json(mockDynamoUsers)
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

    // Try to use DynamoDB first
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      const { dynamoService } = await import("@/lib/aws/dynamodb-service")
      
      // Check if user with email already exists
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
          console.error("S3 upload failed:", s3Error)
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
    } else {
      // Fallback to mock response for development
      const newUser = {
        id: `dynamo-${Date.now()}`,
        name,
        email,
        profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      console.log("Created mock DynamoDB user:", newUser)
      return NextResponse.json(newUser, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating user in DynamoDB:", error)
    return NextResponse.json({ error: "Failed to create user in DynamoDB" }, { status: 500 })
  }
} 