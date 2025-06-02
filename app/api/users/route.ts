import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// Mock data for development
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    profilePictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
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
    // Try to use database first
    if (process.env.DATABASE_URL) {
      const { getUsers } = await import("@/lib/db/users")
      const users = await getUsers()
      return NextResponse.json(users)
    } else {
      // Fallback to mock data for development
      console.log("Using mock data - database not configured")
      return NextResponse.json(mockUsers)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    console.log("Falling back to mock data")
    return NextResponse.json(mockUsers)
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

    let profilePictureUrl = ""

    // Upload profile picture to S3 if provided and configured
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

    // Try to use database first
    if (process.env.DATABASE_URL) {
      const { createUser } = await import("@/lib/db/users")
      const user = await createUser({
        name,
        email,
        profilePictureUrl,
      })
      return NextResponse.json(user, { status: 201 })
    } else {
      // Fallback to mock response for development
      const newUser = {
        id: Date.now(),
        name,
        email,
        profilePictureUrl: profilePictureUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      console.log("Created mock user:", newUser)
      return NextResponse.json(newUser, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    
    // Handle unique constraint violation for email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
