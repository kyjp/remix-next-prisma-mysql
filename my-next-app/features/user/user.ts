'use server'
import argon2 from 'argon2'
import {PrismaClient} from '@prisma/client'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

const SESSION_SECRET: string | undefined = process.env.SESSION_SECRET
if (SESSION_SECRET === undefined) throw new Error("SESSION_SECRETを設定してください。")

export const createUser = async (data: {name: string; password: string;}) => {
    let {name, password} = data
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
    await prisma.user.create({
        data: { name: name, password: hashedPassword},
    })
    redirect('/')
}

export const loginUser = async (
    data: {name: string; password: string;}
) => {
    let {name, password} = data
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
        const cookieStore = cookies()
        cookieStore.set('userId', user.id)
        redirect('/dashboard')
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
 