import { LoaderFunction, redirect, type MetaFunction } from "@remix-run/node"
import { ActionFunction } from "@remix-run/node"
import { commitSession, createUser, fetchAllUser, getSession, loginUser } from "~/models/user.server"
import { json, useLoaderData, useRouteError } from '@remix-run/react'
import { User } from "@prisma/client"
import Certification from "components/Certification"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export const loader: LoaderFunction = async () => {
  const users = await fetchAllUser()
  return json(users)
}

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  try{
      const user = await loginUser(name, password)
      const session = await getSession(request.headers.get('Cookie'))
      session.set('userId', String(user.id))
      const headers = {'Set-Cookie': await commitSession(session)}
      return redirect('/dashboard', {headers})
  } catch(error: any) {
      console.log(error.message)
      return json({error: error.message}, {status: 400})
  }
}


export default function Index() {
  const users = useLoaderData<User[] | null>()
  const error: any = useRouteError()
  console.log(error, users)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="p-4">
      {error ? <p>{error}</p> : <></>}
      <Certification/>
    </div>
  )
}
