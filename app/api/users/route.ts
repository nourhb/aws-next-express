import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { getUsers, createUser } from "@/lib/db/users"

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
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const users = await getUsers()
    return NextResponse.json(users)
  } catch (err: any) {
    console.error("❌ Database connection failed:", err?.message || err)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
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
        console.error("❌ S3 upload failed:", s3Error)
        // Continue without profile picture
      }
    }

    // Create user in database
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const user = await createUser({
      name,
      email,
      profilePictureUrl,
    })
    return NextResponse.json(user, { status: 201 })

  } catch (err: any) {
    console.error("❌ Error creating user:", err)
    
    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
