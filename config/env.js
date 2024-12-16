import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET || '35d04417b5f1487023ba6db5220c7bfa170df2c8c1ea33c16a793b7c79c2028980fee8dd85792b42f04e6923a20cfd796bcc069efce152e519ccaa8a7f479b82',
  // port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*'
};