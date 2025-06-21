// routes/index.js
import userRoutes from './routes/AuthRouter.js';
import userCourse from './routes/userCourses.js';
import userProfile from './routes/Profile.js';
import Post from './routes/PostRoutes.js';
import CouponCode from './routes/CouponCode.js';
import userContact from './routes/Contack.js';
import userPayment from './routes/Payment.js';
import generate from './routes/Generate.js';
import BookStoreRouter from './routes/BookStoreRouter.js';
import MetaData from './routes/MetaData.js';
import Exercise from './routes/ExecriseRoutes.js';
import Article from './routes/ArticleRoutes.js'

const setupRoutes = (app) => {
  // Mount all routes
  app.use("/api/v1/auth", userRoutes);
  app.use("/api/v1/courses", userCourse);
  app.use("/api/v1/profile", userProfile);
  app.use("/api/v1/contact", userContact);
  app.use("/api/v1/payment", userPayment);
  app.use("/api/v1/post", Post);
  app.use("/api/v1/coupon", CouponCode);
  app.use("/api/v1/store", BookStoreRouter);
  app.use("/api/v1/generate", generate);
  app.use("/api/v1/metadata", MetaData);
  app.use("/api/v1/exercise", Exercise);
  app.use("/api/v1/article", Article)
};

export default setupRoutes;