import { fetchAllUser } from "@/features/user/user";
import Form from "../components/Form"
import Link from "next/link";

export default async function Home() {
  const users = await fetchAllUser()
  return (
    <main className="">
      <Form />
      <ul className="w-full mt-4">
        {
          users ? users.map(user => <li key={user.id} className="grid gap-1 grid-cols-2"><div className="">id: {user.id}</div><div className="">name: {user.name}</div></li>) : (<></>)
        }
      </ul>
      <div>
          <Link href="/login/">ログインページ</Link>
      </div>
      <div>
          <Link href="/dashboard/">ダッシュボード</Link>
      </div>
    </main>
  );
}