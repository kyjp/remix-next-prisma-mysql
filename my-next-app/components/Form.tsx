'use client'
import React from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUser } from '@/features/user/user'

export const AddFormSchema = z.object({
    name: z.string().min(1, {message: '名前を入力してください。'}),
    password: z.string().min(1, {message: 'パスワードを入力してください。'})
})

const Form = () => {
    const methods = useForm<z.infer<typeof AddFormSchema>>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: zodResolver(AddFormSchema),
        defaultValues: {
            name: '',
            password: ''
        }
    })
    
    const {
        register,
        formState: { errors },
        handleSubmit,
        getFieldState,
        control
    } = methods

    const watchName = useWatch({
        control,
        name: 'name'
    })
    
    const watchPassword = useWatch({
        control,
        name: 'password'
    })

    const isDisabled = (): boolean => {
        if(getFieldState('name').invalid || !watchName) return true
        if(getFieldState('password').invalid || !watchPassword) return true
        return false
    }

    const onSubmit = (data: any) => {
        createUser(data)
    }

    return (
        <section>
            <h1 className="font-bold text-xl">ユーザー追加</h1>
            <FormProvider {...methods}>
                <form className="flex mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name">名前</label>
                        <input id="name" {...register('name')} className="ml-1 border rounded px-2 py-1 leading-7" required type="text"/>
                        {errors.name?.message && <p>{errors.name?.message}</p>}
                    </div>
                    <div className="ml-2"> 
                        <label htmlFor="password">パスワード</label>
                        <input type="password" id="password" {...register('password')} autoComplete="off" className="ml-1 border rounded px-2 py-1 leading-7" required/>
                        {errors.password?.message && <p>{errors.password?.message}</p>}
                    </div>
                    <div className="ml-2">
                        <button
                            type="submit"
                            disabled={isDisabled()}
                            className="rounded bg-slate-950 text-white py-1 px-3 hover:bg-slate-500 leading-7 disabled:bg-gray-400"
                        >
                            追加
                        </button>
                    </div>
                </form>
            </FormProvider>
        </section>
    )
}

export default Form