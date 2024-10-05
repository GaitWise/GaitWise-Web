import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import VerificationCode from '@/db/models/VerificationCode'

/**
 * POST 요청을 처리하는 함수
 * @param {NextRequest} request - 요청 객체
 * @returns {Promise<NextResponse>} 응답 객체
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDB에 연결
    await dbConnect()

    // 이메일 주소와 확인 코드를 요청에서 가져옴
    const { email, code } = body

    // 데이터베이스에서 확인 코드 가져오기
    const record = await VerificationCode.findOne({ email })

    // 코드가 존재하지 않거나 유효 기간이 지난 경우
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ message: '확인 코드가 유효하지 않습니다', flg: false }, { status: 203 })
    }

    // 코드가 일치하는지 확인
    if (record.code !== code) {
      // 코드가 일치하지 않는 경우의 처리
      return NextResponse.json({ message: '확인 코드가 일치하지 않습니다', flg: false }, { status: 201 })
    }

    // 코드가 일치하는 경우
    return NextResponse.json({ message: '인증 성공', flg: true }, { status: 200 })
  } catch (error: unknown) {
    // 예기치 않은 오류가 발생한 경우의 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(errorMessage)
    return NextResponse.json({ message: '오류가 발생했습니다', error: errorMessage }, { status: 500 })
  }
}
