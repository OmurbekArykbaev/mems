import Sequelize from 'sequelize'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT
    }
  )

export const User = db.define('user', {
  login : {
    type: Sequelize.DataTypes.STRING(140),
    allowNull : false,
  },
  password : {
    type: Sequelize.DataTypes.STRING(256),
    allowNull : false,
  },
  admin : {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue : false
  }
})

export const Message = db.define('message', {
  content: {
    type: Sequelize.DataTypes.STRING(140),
    allowNull: false
  }
})

User.hasMany(Message)
Message.belongsTo(User)

export async function dbStart() {
  await db.sync()
  await User.upsert({
    login: process.env.MEMS_ADMIN_LOGIN,
    password: bcrypt.hashSync(process.env.MEMS_ADMIN_PASSWORD, 8),
    admin: true
  })
}