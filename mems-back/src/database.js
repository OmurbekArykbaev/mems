import Sequelize from 'sequelize'
import bcrypt    from 'bcryptjs'
import Redis     from 'ioredis'

import dotenv from 'dotenv'
dotenv.config()

if (!process.env.DB_PASS) {
    throw new Error('DB_PASS environment variable is not set')
}
if (!process.env.MEMS_ADMIN_PASS) {
    throw new Error('MEMS_ADMIN_PASS environment variable is not set')
}

const orm = new Sequelize(
    process.env.DB_NAME || 'mems_db',
    process.env.DB_USER || 'mems_db_user',
    process.env.DB_PASS,
    {
        host:    process.env.DB_HOST    || 'localhost',
        port:    process.env.DB_PORT    || '3306',
        dialect: process.env.DB_DIALECT || 'mysql'
    }
)

export const sessionDB = new Redis({
    host: process.env.SESS_DB_HOST || 'localhost',
    port: process.env.SESS_DB_PORT || '6379',
    password: process.env.SESS_DB_PASS || undefined
})

export const User = orm.define('user', {
    login: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
    },
    admin: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export const Message = orm.define('message', {
    content: {
      type: Sequelize.DataTypes.STRING(140),
      allowNull: false
    }
})

User.hasMany(Message)
Message.belongsTo(User)

export default async function database() {
    await orm.sync()

    const login =
        process.env.MEMS_ADMIN_LOGIN || 'admin'
    const saltRounds =
        parseInt(process.env.MEMS_PASS_SALT_ROUNDS || '8')
    const password =
        bcrypt.hashSync(process.env.MEMS_ADMIN_PASS, saltRounds)

    return User.upsert({
        login, password,
        admin: true
    })
}
