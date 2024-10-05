'use client'

import { jwtVerify } from 'jose'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie' // js-cookie를 임포트

/**
 * 사용자 인증 상태를 확인하고 로그인된 사용자의 정보를 반환하는 커스텀 훅
 * @returns {Object} 로그인된 사용자의 정보 (email, exp, username)
 */
const useAuth = () => {
  const [loginUser, setLoginUser] = useState({
    email: '',
    exp: 0,
    username: '',
  })

  useEffect(() => {
    /**
     * 쿠키에서 JWT 토큰을 가져와 유효성을 검사하고, 유효한 경우 로그인된 사용자 정보를 설정하는 함수
     */
    const checkToken = async () => {
      // 1: 쿠키에서 토큰을 가져옴
      const token = Cookies.get('token') // 쿠키에서 토큰을 가져옴

      // 2: 토큰의 유효성을 체크
      if (token) {
        try {
          const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')
          const { payload } = await jwtVerify(token, secretKey)

          // 페이로드에 기대하는 프로퍼티가 존재하는지 체크
          if (
            typeof payload.email === 'string' &&
            typeof payload.username === 'string' &&
            typeof payload.exp === 'number'
          ) {
            // 로그인 유저를 설정
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
