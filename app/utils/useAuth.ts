'use client'
import { jwtVerify } from 'jose'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const useAuth = () => {
  const [loginUser, setLoginUser] = useState({
    email: '',
    exp: 0,
    username: '',
  })

  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      // 1: トークンを取得する
      const token = localStorage.getItem('token')

      // 2: トークンがあるかどうかを確認
      if (!token) {
        // トークンがない場合、ログイン画面にリダイレクト（コメント解除で動作します）
        router.push('/auth?type=login')
        return
      }

      // 3: トークンの有効性をチェック
      try {
        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')
        const { payload } = await jwtVerify(token, secretKey)

        // ペイロードに期待するプロパティが存在するかをチェック
        if (
          typeof payload.email === 'string' &&
          typeof payload.username === 'string' &&
          typeof payload.exp === 'number'
        ) {
          // ログインユーザーをセット
          setLoginUser({
            email: payload.email,
            exp: payload.exp,
            username: payload.username,
          })
        } else {
          // 不正なトークンの場合はログイン画面に遷移
          router.push('/auth?type=login')
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(errorMessage)
        // トークンが不正な場合はログイン画面に遷移
        router.push('/auth?type=login')
      }
    }

    checkToken()
  }, [router])

  return loginUser
}

export default useAuth
