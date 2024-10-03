'use client'

import { useState, Suspense } from 'react'
import styled from 'styled-components'
import SignUp from './Signup'
import ForgetPassword from './ForgetPass'
import { Gaitwise } from '@/public/svg'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation' // useRouterをインポート
import axios from 'axios' // axiosのインポート

function AuthContent() {
  const searchParams = useSearchParams() // URLのクエリパラメータを取得
  const type = searchParams.get('type') // 'type' クエリパラメータを取得
  const router = useRouter() // useRouterフックを使用

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('analyst')

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/singin', {
        email,
        password,
        role,
      })

      const jsondata = res.data
      if (jsondata.flg) {
        // 成功したら、トークンを保存
        if ('token' in jsondata) {
          localStorage.setItem('token', jsondata.token)
          alert(jsondata.message)
          // ログイン成功時に'/test'ページにリダイレクト
          router.push('/test')
        }
      } else {
        alert(jsondata.message)
      }
    } catch {
      alert('ログイン失敗')
    }
  }

  return (
    <Container>
      {type === 'login' && (
        <LoginBox>
          <Image src={Gaitwise} alt="logo" width={100} height={100} layout="responsive" />
          <Title>Hi, Welcome Back!</Title>
          <Subtitle>Please select a Type</Subtitle>

          <RoleSelect>
            <label>
              <input
                type="radio"
                name="role"
                value="analyst"
                checked={role === 'analyst'}
                onChange={(e) => setRole(e.target.value)}
              />
              Analysts
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === 'doctor'}
                onChange={(e) => setRole(e.target.value)}
              />
              Doctor
            </label>
          </RoleSelect>

          <InputField type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButton onClick={handleLogin} disabled={!email.trim() || !password.trim()}>
            Sign In
          </LoginButton>

          <Links>
            <a href="/auth?type=forgetpass">Forgot password?</a>
            <p>
              Don’t have an account yet? <a href="/auth?type=sign-up">Sign up</a>
            </p>
          </Links>
        </LoginBox>
      )}

      {type === 'sign-up' && <SignUp />}

      {type === 'forgetpass' && <ForgetPassword />}
    </Container>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`

const RoleSelect = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  label {
    margin: 0 1rem;
    font-size: 1rem;
  }
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

const LoginButton = styled.button`
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
