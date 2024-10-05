'use client'

import { Gaitwise } from '@/public/svg'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('') // 인증 코드 입력용
  const [isCodeSent, setIsCodeSent] = useState<'unsent' | 'sent' | 'resend'>('unsent') // 3가지 상태를 가짐
  const [loading, setLoading] = useState(false) // 로딩 상태 관리

  const router = useRouter()

  const handleSendCode = async () => {
    setLoading(true) // 로딩 시작
    try {
      const response = await axios.post('/api/auth/email', { email }) // axios.post를 사용하여 API 호출

      if (response.status === 200) {
        setIsCodeSent('sent') // 코드가 전송되면 인증 상태로 변경
        alert('확인 코드가 전송되었습니다')
      } else if (response.status === 203) {
        alert('이 사용자는 존재하지 않습니다')
      } else {
        alert(`오류: ${response.data.message}`)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`오류: ${error.response.data.message || '코드 전송에 실패했습니다'}`)
      } else {
        alert('코드 전송에 실패했습니다')
      }
    } finally {
      setLoading(false) // 로딩 종료
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true) // 로딩 시작
    try {
      const response = await axios.post('/api/auth/verify-code', {
        email,
        code: verificationCode,
      })

      if (response.status === 200) {
        alert('인증 성공')
        // 비밀번호 재설정 화면으로 리다이렉트
        router.push(`/auth/reset-pass?email=${email}`)
      } else if (response.status === 203) {
        alert('유효하지 않은 코드입니다')
        setIsCodeSent('resend') // 인증 실패 시 재전송 모드로 변경
      } else if (response.status === 201) {
        alert('코드가 일치하지 않습니다')
        setIsCodeSent('resend') // 인증 실패 시 재전송 모드로 변경
      }
    } catch (error) {
      console.error(error)
      alert('오류가 발생했습니다')
    } finally {
      setLoading(false) // 로딩 종료
    }
  }

  return (
    <ForgetPasswordBox>
      <Image src={Gaitwise} alt="logo" width={100} height={100} layout="responsive" />
      <Title>비밀번호를 잊어버리셨나요?</Title>
      <Subtitle>
        이메일 주소를 입력해 주세요.
        <br /> 확인 코드를 보내드립니다.
      </Subtitle>
      <InputField type="email" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />

      {(isCodeSent === 'sent' || isCodeSent === 'resend') && (
        <InputField
          type="text"
          placeholder="확인 코드를 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      )}

      {isCodeSent === 'unsent' && (
        <SendCodeButton onClick={handleSendCode} disabled={!email.trim() || loading}>
          {loading ? 'Loading...' : 'Send code'}
        </SendCodeButton>
      )}

      {isCodeSent === 'sent' && (
        <SendCodeButton onClick={handleVerifyCode} disabled={!verificationCode.trim() || loading}>
          {loading ? 'Loading...' : '인증'}
        </SendCodeButton>
      )}

      {isCodeSent === 'resend' && (
        <SendCodeButton onClick={handleSendCode} disabled={loading}>
          {loading ? 'Loading...' : '재전송'}
        </SendCodeButton>
      )}
      <Links>
        <p>
          Already have an account?<a href="/auth?type=login"> Sign In</a>
        </p>
        <p>
          Don’t have an account yet? <a href="/auth?type=sign-up">Sign up</a>
        </p>
      </Links>
    </ForgetPasswordBox>
  )
}

const ForgetPasswordBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
`

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9f9f9;
`

const SendCodeButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #1a202c;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`
const Links = styled.div`
  margin-top: 1rem;

  a {
    color: #3182ce;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`
