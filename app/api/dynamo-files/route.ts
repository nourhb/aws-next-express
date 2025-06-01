import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"
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
    // Get files from DynamoDB
    const dynamoFiles = await dynamoService.getAllFiles()

    // Generate pre-signed URLs for each file
    const filesWithUrls = await Promise.all(
      dynamoFiles.map(async (file) => {
        try {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: file.key,
          })

          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

          return {
            ...file,
            url: url,
          }
        } catch (error) {
          console.warn(`Could not generate URL for file ${file.key}:`, error)
          return {
            ...file,
            url: null,
          }
        }
      })
    )

    return NextResponse.json(filesWithUrls)
  } catch (error) {
    console.error("Error listing files from DynamoDB:", error)
    return NextResponse.json({ error: "Failed to list files from DynamoDB" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique file name
    const fileName = `${uuidv4()}-${file.name}`
    const fileKey = `files/${fileName}`

    const fileBuffer = await file.arrayBuffer()

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    }

    // Upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams))

    // Generate a pre-signed URL for download
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: fileKey,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    // Save file metadata to DynamoDB
    const dynamoFile = await dynamoService.createFile({
      name: file.name,
      key: fileKey,
      size: file.size,
      contentType: file.type,
      url: url,
    })

    return NextResponse.json(dynamoFile, { status: 201 })
  } catch (error) {
    console.error("Error uploading file to S3 and DynamoDB:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
} 