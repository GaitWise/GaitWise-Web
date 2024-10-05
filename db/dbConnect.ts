/* eslint-disable no-var */
// db\dbConnect.ts
import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * 데이터베이스에 연결하는 함수
 * @returns {Promise<mongoose.Connection>} MongoDB 연결 객체
 */
async function dbConnect(): Promise<mongoose.Connection> {
  // 이미 연결된 경우, 기존 연결을 반환
  if (cached.conn) {
    return cached.conn
  }

  // 연결이 없는 경우, 새로운 연결을 생성
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(process.env.MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose.connection
    })
  }

  try {
    // 연결을 기다리고, 연결 객체를 캐시에 저장
    cached.conn = await cached.promise
  } catch (e) {
    // 연결 실패 시, 캐시 초기화
    cached.promise = null
    throw e
  }

  // 연결 객체 반환
  return cached.conn
}

export default dbConnect
