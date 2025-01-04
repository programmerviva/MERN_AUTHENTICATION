import { catchAsyncError } from './catchAsyncErrorMiddleware.js'
import ErrorHandler  from "./errorMiddleware.js";
import { User } from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});