
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email: { type: String, require: true },
    // select 属性设置给前端返回数据时，不返回该字段
    passwd: { type: String, require: true, select: false },
    nickname: { type: String, require: true },
    avatar: { type: String, require: false },
  }, { timestamps: true })
  return mongoose.model('User', UserSchema)
}
