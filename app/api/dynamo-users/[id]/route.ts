import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
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

// GET - Get user by ID from DynamoDB
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await dynamoService.getUserById(id)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (err) {
    console.error("Error fetching user from DynamoDB:", err)
    return NextResponse.json({ error: "Failed to fetch user from DynamoDB" }, { status: 500 })
  }
}

// PUT - Update user in DynamoDB
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const profilePicture = formData.get("profilePicture") as File

    // Get existing user
    const existingUser = await dynamoService.getUserById(id)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (email && email !== existingUser.email) {
      const userWithEmail = await dynamoService.getUserByEmail(email)
      if (userWithEmail && userWithEmail.id !== id) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
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

    // Update user in DynamoDB
    const updatedUser = await dynamoService.updateUser(id, {
      ...(name && { name }),
      ...(email && { email }),
      profilePictureUrl,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (err) {
    console.error("Error updating user in DynamoDB:", err)
    return NextResponse.json({ error: "Failed to update user in DynamoDB" }, { status: 500 })
  }
}

// DELETE - Delete user from DynamoDB
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Get user to delete profile picture from S3
    const existingUser = await dynamoService.getUserById(id)
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

    // Delete user from DynamoDB
    const success = await dynamoService.deleteUser(id)
    
    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (err) {
    console.error("Error deleting user from DynamoDB:", err)
    return NextResponse.json({ error: "Failed to delete user from DynamoDB" }, { status: 500 })
  }
} 