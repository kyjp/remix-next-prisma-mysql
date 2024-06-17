import { User } from '@prisma/client'
import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Header from 'components/Header'
import { destroySession, fetchUserById, getSession } from '~/models/user.server'

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'))
    if(!session.has('userId')) {
        return redirect('/login')
    }
    const userId = session.get('userId')
    let user = json(await fetchUserById(userId))
    if(user) {
        return user
    } else {
        return redirect('/login')
    }
}

export const action: ActionFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'))
    return redirect('/', {headers: {'Set-Cookie': await destroySession(session)}})
}

const _index = () => {
    const user = useLoaderData<User>()
    return (
        <div>
            <Header />
            <main className="p-4">
                <p>{user.id}</p>
                <p>{user.name}</p>
                <p>ダッシュボードです</p>
            </main>
        </div>
    )
}

export default _index