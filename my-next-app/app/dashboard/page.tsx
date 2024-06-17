import { fetchUserById } from "@/features/user/user"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
    const cookieStore = cookies()
    let id = cookieStore.get('userId')
    let user
    if(id) {
        user = await fetchUserById(id.value)
        if(!user) {
            redirect('/')
        }
    } else {
        redirect('/')
    }
    return (
        <main className="">
            <p>{user.id}</p>
            <p>{user.name}</p>
            <p>ダッシュボード</p>
        </main>
    )
}