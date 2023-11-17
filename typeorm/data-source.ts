import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm';

dotenv.config()

const dataSource = new DataSource({
    type: 'mysql',
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_HOST),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    migrations: [`${__dirname}/migrations/**/*.ts`]
})

export default dataSource;