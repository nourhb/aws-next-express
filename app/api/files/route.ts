import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

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
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Prefix: "files/", // Only list files in the files/ directory
    }

    const data = await s3Client.send(new ListObjectsV2Command(params))

    if (!data.Contents) {
      return NextResponse.json([])
    }

    // Process and format file information
    const files = await Promise.all(
      data.Contents.filter((item) => item.Key && !item.Key.endsWith("/")).map(async (item) => {
        const key = item.Key as string
        const fileName = key.split("/").pop() as string

        // Generate a pre-signed URL for download
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME || "",
          Key: key,
        })

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

        return {
          id: key,
          name: fileName,
          size: item.Size,
          lastModified: item.LastModified,
          url: url,
        }
      }),
    )

    return NextResponse.json(files)
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
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

    await s3Client.send(new PutObjectCommand(uploadParams))

    // Generate a pre-signed URL for download
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: fileKey,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return NextResponse.json(
      {
        id: fileKey,
        name: file.name,
        size: file.size,
        lastModified: new Date().toISOString(),
        url: url,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
