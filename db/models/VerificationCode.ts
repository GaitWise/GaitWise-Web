import mongoose from 'mongoose'

const verificationCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // 有効期限
  },
  {
    timestamps: true,
    collection: 'VerificationCode', // collection 이름을 지정
  }
)

const VerificationCode = mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema)

export default VerificationCode
