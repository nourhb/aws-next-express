import { type NextRequest, NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { deleteUser, getUserById } from "@/lib/db/users"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Get user to find profile picture URL
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete profile picture from S3 if it exists
    if (user.profilePictureUrl) {
      // Extract key from URL
      const url = new URL(user.profilePictureUrl)
      const key = url.pathname.substring(1) // Remove leading slash

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "",
        Key: key,
      }

      await s3Client.send(new DeleteObjectCommand(deleteParams))
    }

    // Delete user from database
    await deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
