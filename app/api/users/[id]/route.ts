import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { getUserById, updateUser, deleteUser } from "@/lib/db/users"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await getUserById(userId)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (err) {
    console.error("Error fetching user:", err)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const profilePicture = formData.get("profilePicture") as File

    // Get existing user
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let profilePictureUrl = existingUser.profilePictureUrl

    // Upload new profile picture to S3 if provided
    if (profilePicture && profilePicture.size > 0) {
      // Delete old profile picture from S3 if exists
      if (existingUser.profilePictureUrl) {
        try {
          const oldKey = existingUser.profilePictureUrl.split('.amazonaws.com/')[1]
          if (oldKey) {
            const deleteParams = {
              Bucket: process.env.AWS_S3_BUCKET_NAME || "",
              Key: oldKey,
            }
            await s3Client.send(new DeleteObjectCommand(deleteParams))
          }
        } catch (deleteError) {
          console.warn("Could not delete old profile picture:", deleteError)
        }
      }

      // Upload new picture
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
      profilePictureUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
    }

    // Update user in RDS
    const updatedUser = await updateUser(userId, {
      ...(name && { name }),
      ...(email && { email }),
      profilePictureUrl,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (err: any) {
    console.error("Error updating user:", err)
    
    if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Get user to delete profile picture from S3
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete profile picture from S3 if exists
    if (existingUser.profilePictureUrl) {
      try {
        const key = existingUser.profilePictureUrl.split('.amazonaws.com/')[1]
        if (key) {
          const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: key,
          }
          await s3Client.send(new DeleteObjectCommand(deleteParams))
        }
      } catch (deleteError) {
        console.warn("Could not delete profile picture from S3:", deleteError)
      }
    }

    // Delete user from RDS
    await deleteUser(userId)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (err) {
    console.error("Error deleting user:", err)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
