

import dotenv from "dotenv";

// Load environment variables at the beginning
dotenv.config();

const getEnv = (key: string, defaultValue?: string):string=> {

    const value = process.env[key] || defaultValue;
    
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    
    return value;

}
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const MONGO_URI = getEnv("MONGO_URI");
export const PORT = getEnv("PORT", "3000");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESENT_API_KEY= getEnv("RESEND_API_KEY");
export const APP_ORIGIN = getEnv("APP_ORIGIN");

