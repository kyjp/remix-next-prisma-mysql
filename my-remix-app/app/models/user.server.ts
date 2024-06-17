import {PrismaClient} from '@prisma/client'
import argon2 from 'argon2'
import { createCookieSessionStorage } from '@remix-run/node'

const prisma = new PrismaClient()

const SESSION_SECRET: string | undefined = process.env.SESSION_SECRET
if (SESSION_SECRET === undefined) throw new Error("SESSION_SECRETを設定してください。")
export const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: '__session',
        secure: process.env.NODE_ENV === "production",
        secrets: [SESSION_SECRET],
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
    },
})

export const createUser = async (
    name: string, password: string
) => {
    if (!(name && password)) {
        throw new Error('Invalid input')
    }

    let user = await prisma.user.findUnique({
        where: {
            name
        }
    })
    if (user) {
        throw new Error('名前は既に登録済みです')
    }
    const hashedPassword = await argon2.hash(password)

    const newUser = await prisma.user.create({
        data: { name: name, password: hashedPassword},
    })

    return { id: newUser.id, name: newUser.name }
}

export const loginUser = async (
    name: string, password: string
) => {
    if (!(name && password)) {
        throw new Error('Invalid input')
    }
    let user = await prisma.user.findUnique({
        where: {
            name
        }
    })
    if(!user) throw new Error('名前かパスワードが違います')
    if (await argon2.verify(user.password, password)) {
        return { id: user.id, name: user.name }
    }else{
        throw new Error('名前かパスワードが違います')
    }
}
 
export const fetchUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

export const fetchAllUser = async () => {
    return prisma.user.findMany()
}

export const deleteUserById = async (id: string) => {
    return prisma.user.delete({
        where: {
            id
        }
    })
}