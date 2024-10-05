// db\models\user.ts
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'user', // collection 이름을 지정
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User
