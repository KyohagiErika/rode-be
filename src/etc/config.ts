import { config } from "dotenv";

config();

export default class RodeConfig {
    static readonly PORT = parseInt(process.env.PORT || '3000');
    static readonly DB_HOST = process.env.DB_HOST || 'localhost';
    static readonly DB_PORT = parseInt(process.env.DB_PORT || '3306');
    static readonly DB_USERNAME = process.env.DB_USERNAME || 'root';
    static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'longmetmoivcl';
    static readonly DB_DATABASE = process.env.DB_DATABASE || 'rode';
    static readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shopp.ts.app@gmail.com';
}