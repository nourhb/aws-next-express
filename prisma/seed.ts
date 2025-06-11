import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      },
    ],
  })

  // Created users successfully
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 