import { type NextRequest, NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { dynamoService } from "@/lib/aws/dynamodb-service"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: "AWS credentials not configured" }, { status: 500 })
    }

    const { id } = await params
    // Get file from DynamoDB first
    const file = await dynamoService.getFileById(id)
    
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete file from S3
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "",
        Key: file.key,
      }

      await s3Client.send(new DeleteObjectCommand(deleteParams))
    } catch (s3Error) {
      console.warn("Could not delete file from S3:", s3Error)
    }

    // Delete file record from DynamoDB
    const success = await dynamoService.deleteFile(id)
    
    if (!success) {
      return NextResponse.json({ error: "File not found in DynamoDB" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: "File deleted successfully from both S3 and DynamoDB"
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
} 