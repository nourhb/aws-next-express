import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface CreateUserData {
  name: string
  email: string
  profilePictureUrl: string
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
  })
}

export async function updateUser(id: number, data: Partial<CreateUserData>) {
  return prisma.user.update({
    where: { id },
    data,
  })
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  })
}
