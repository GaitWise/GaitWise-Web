import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs' // bcrypt를 임포트
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

/**
 * POST 요청을 처리하는 함수
 * @param {NextRequest} request - 요청 객체
 * @returns {Promise<NextResponse>} 응답 객체
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDB에 접속
    await dbConnect()

    // 이메일 주소로 사용자를 검색
    const user = await User.findOne({ email: body.email })

    if (!user) {
      // 사용자가 존재하지 않는 경우
      return NextResponse.json({ message: '사용자가 존재하지 않습니다', flg: false })
    }

    // 비밀번호를 비교 (해시화된 비밀번호와 입력된 비밀번호를 비교)
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password)

    if (!isPasswordCorrect) {
      // 비밀번호가 틀린 경우
      return NextResponse.json({ message: '비밀번호가 틀렸습니다', flg: false })
    }

    // 1: JWT용 시크릿 키를 생성
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')

    // 2: JWT의 페이로드를 생성
    const payload = {
      email: body.email,
      username: user.name,
    }

    // 3: JWT로 토큰을 발행
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h') // 유효 기간 2시간
      .sign(secretKey)

    // 로그인 성공 시 응답
    return NextResponse.json({ message: '로그인 성공', flg: true, token: token })
  } catch (error: unknown) {
    // 예기치 않은 오류가 발생한 경우의 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: '로그인 실패', flg: false, error: errorMessage })
  }
}
