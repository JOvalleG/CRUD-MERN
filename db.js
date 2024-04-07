import { createPool } from 'mysql2/promise'

export const pool = createPool({
    host: 'bllr4we8mibdnjfryjim-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'uf6xgdfdnmpfvj7d',
    password: 'zo2CJM9BFD8P5L4HrMZ3',
    database: 'bllr4we8mibdnjfryjim'
})
