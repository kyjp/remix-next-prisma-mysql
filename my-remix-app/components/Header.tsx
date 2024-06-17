import { Form } from '@remix-run/react'
import React from 'react'

const Header = () => {
  return (
    <header className="flex justify-between p-4">
        <div>
            <h1 className="font-bold text-lg">ヘッダー</h1>
        </div>
        <div>
            <Form method="post" action="/dashboard/?index">
                <button
                    className="rounded bg-slate-950 text-white py-1 px-3 hover:bg-slate-500 leading-7"
                >
                    ログアウト
                </button>
            </Form>
        </div>
    </header>
  )
}

export default Header