import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Nour el houda Bouajila',
        email: 'nour.bouajila@iteam.tn',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ghofrane Nasri',
        email: 'ghofrane.nasri@iteam.tn',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ahmed Ben Ali',
        email: 'ahmed.benali@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Fatma Trabelsi',
        email: 'fatma.trabelsi@example.com',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      },
    }),
  ])

  console.log('✅ Created users:', users.length)
  
  users.forEach(user => {
    console.log(`   - ${user.name} (${user.email})`)
  })

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 