import { useForm, getFormProps, getInputProps } from "@conform-to/react"
import { parseWithZod } from '@conform-to/zod'
import { Form as RemixForm } from '@remix-run/react'
import { z } from 'zod'


const schema = z.object({
    name: z.string({required_error: '名前は必須です'}),
    password: z
        .string({required_error: 'パスワードは必須です'})
})

const Certification = () => {
    const [form, {name, password}] = useForm({
        onValidate({formData}) {
            return parseWithZod(formData, {schema})
        }
    })

    return (
        <section>
            <h1 className="font-bold text-xl">ログイン</h1>
            <RemixForm method="post" {...getFormProps(form)} className="flex mt-4" action="/login?index">
                <div>
                    <label htmlFor="name">名前</label>
                    <input {...getInputProps(name, {type: 'text'})} id="name" className="ml-1 border rounded px-2 py-1 leading-7" required/>
                    {name.errors && (
                        <div>
                            {name.errors.map((e, index) => (
                                <p key={index} className="text-red-500">{e}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="ml-2"> 
                    <label htmlFor="password">パスワード</label>
                    <input {...getInputProps(password, {type: 'password'})} id="password" autoComplete="off" className="ml-1 border rounded px-2 py-1 leading-7" required/>
                    {name.errors && (
                        <div>
                            {name.errors.map((e, index) => (
                                <p key={index} className="text-red-500">{e}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="ml-2">                
                    <button
                        className="rounded bg-slate-950 text-white py-1 px-3 hover:bg-slate-500 leading-7"
                    >
                        認証
                    </button>
                </div>
            </RemixForm>
        </section>
    )
}

export default Certification