'use client'

import { jwtVerify } from 'jose'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie' // js-cookieをインポート

const useAuth = () => {
  const [loginUser, setLoginUser] = useState({
    email: '',
    exp: 0,
    username: '',
  })

  useEffect(() => {
    const checkToken = async () => {
      // 1: クッキーからトークンを取得
      const token = Cookies.get('token') // クッキーからトークンを取得

      // 2: トークンの有効性をチェック
      if (token) {
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
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(errorMessage)
        }
      }
    }

    checkToken()
  }, [])

  return loginUser
}

export default useAuth
