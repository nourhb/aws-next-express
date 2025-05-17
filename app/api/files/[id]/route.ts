import { type NextRequest, NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

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
    // The ID is the full S3 key
    const key = decodeURIComponent(params.id)

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: key,
    }

    await s3Client.send(new DeleteObjectCommand(deleteParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
