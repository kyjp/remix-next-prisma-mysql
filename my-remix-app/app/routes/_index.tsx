import { LoaderFunction, type MetaFunction } from "@remix-run/node"
import Form from "components/Form"
import { ActionFunction } from "@remix-run/node"
import { createUser, fetchAllUser } from "~/models/user.server"
import { json, useActionData, useLoaderData } from '@remix-run/react'
import { Link as RemixLink } from '@remix-run/react'
import { User } from "@prisma/client"

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
      const user = await createUser(name, password)
      return json({user})
  } catch(error: any) {
      if (error instanceof Response) {
        return error
      }
      if (error instanceof Error) {
        return json({ message: error.message }, { status: 401 })
      }
      return json({error: 'ユーザー追加に失敗しました'}, {status: 401})
  }
}


export default function Index() {
  const users = useLoaderData<User[] | null>()
  const error: any = useActionData<typeof action>() as {
    message?: string
  }
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="p-4">
      {error?.message ? <p>{error.message}</p> : <></>}
      <Form/>
      <ul className="w-full mt-4">
        {
          users ? users.map(user => <li key={user.id} className="grid gap-1 grid-cols-2"><div className="">id: {user.id}</div><div className="">name: {user.name}</div></li>) : (<></>)
        }
      </ul>
      <div>
        <RemixLink to="/login/">ログインページ</RemixLink>
      </div>
      <div>
        <RemixLink to="/dashboard/">ダッシュボード</RemixLink>
      </div>
    </div>
  )
}
