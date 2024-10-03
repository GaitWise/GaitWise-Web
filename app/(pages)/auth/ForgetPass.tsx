'use client'

import { Gaitwise } from '@/public/svg'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('') // 認証コード入力用
  const [isCodeSent, setIsCodeSent] = useState<'unsent' | 'sent' | 'resend'>('unsent') // 3つのステートを持たせる
  const [loading, setLoading] = useState(false) // ローディング状態管理

  const router = useRouter()

  const handleSendCode = async () => {
    setLoading(true) // ローディングを開始
    try {
      const response = await axios.post('/api/auth/email', { email }) // axios.post を使用してAPI呼び出し

      if (response.status === 200) {
        setIsCodeSent('sent') // コードが送信されたら、認証状態に変更
        alert('確認コードが送信されました')
      } else if (response.status === 203) {
        alert('このユーザーは存在しません')
      } else {
        alert(`エラー: ${response.data.message}`)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`エラー: ${error.response.data.message || 'コードの送信に失敗しました'}`)
      } else {
        alert('コードの送信に失敗しました')
      }
    } finally {
      setLoading(false) // ローディング終了
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true) // ローディングを開始
    try {
      const response = await axios.post('/api/auth/verify-code', {
        email,
        code: verificationCode,
      })

      if (response.status === 200) {
        alert('認証成功')
        // パスワードリセット画面にリダイレクト
        router.push(`/auth/reset-pass?email=${email}`)
      } else if (response.status === 203) {
        alert('無効なコードです')
        setIsCodeSent('resend') // 認証失敗時に再送信モードに変更
      } else if (response.status === 201) {
        alert('コードが一致しません')
        setIsCodeSent('resend') // 認証失敗時に再送信モードに変更
      }
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました')
    } finally {
      setLoading(false) // ローディング終了
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
          placeholder="確認コードを入力"
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
          {loading ? 'Loading...' : '認証'}
        </SendCodeButton>
      )}

      {isCodeSent === 'resend' && (
        <SendCodeButton onClick={handleSendCode} disabled={loading}>
          {loading ? 'Loading...' : '再送信'}
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
