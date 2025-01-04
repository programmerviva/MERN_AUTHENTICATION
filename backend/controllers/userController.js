import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrorMiddleware.js";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from '../utils/sendToken.js'
import crypto from "crypto";

dotenv.config();
console.log(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
console.log(process.env.TWILIO_PHONE_NUMBER)
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {

  try {

    const { name, email, phone, password, verificationMethod } = req.body;

    if (!name || !email || !phone || !password || !verificationMethod) {
      return next(new ErrorHandler("Please fill in all fields", 400));
    }

    function validatePhoneNumber(phone) {
      const phoneRegex = /^\+91\d{10}$/; // To validate an Indian phone number.
      return phoneRegex.test(phone);
    }

    if (!validatePhoneNumber(phone)) {
      return next(new ErrorHandler("Please enter a valid phone number", 400));
    }

    const existingUser = await User.findOne({
      $or: [
        {
          email,
          accountVerified: true,
        },
        {
          phone,
          accountVerified: true,
        },
      ],
    });

    if (existingUser) {
      return next(
        new ErrorHandler(
          "User with this email or phone number is already registered",
          400
        )
      );
    }

    const registrationAttemptsByUser = await User.find({
      $or: [
        {
          email,
          accountVerified: false,
        },
        {
          phone,
          accountVerified: false,
        },
      ],
    });

    if (registrationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of registration attempts (3). Please try again after an hour.",
          429 //400 Too Many Requests
        )
      );
    }

    const userData = {
      name,
      email,
      phone,
      password,
    };

    const user = await User.create(userData);
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationMethod, verificationCode, name, email, phone, res);
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      sendEmail({ email, subject: "Your Verification Code", message });
      res.status(201).json({
        success: true,
        message: ` Verification code sent to your email ${name}`,
      });
    }
    else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split("")
        .join(" ");
      await client.calls.create({
        twiml: `<Response>
    <Say voice="alice" language="en-US">
      Hello! Thank you for choosing our service. 
      Your secure verification code is ${verificationCodeWithSpace}. 

      I'll repeat that one more time.
      Your verification code is ${verificationCodeWithSpace}.
      Please enter this code on the verification page.
      For your security, never share this code with anyone.
      Thank you and have a great day!
    </Say>
  </Response>`,          
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      res.status(201).json({
        success: true,
        message: `OTP Sent.`,
      });

    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification method. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Verification failed. Please try again." });
  }
}

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 0; text-align: center;">
          <h1>Verification Code</h1>
        </div>
        <div style="margin: 20px 0;">
          <p>Dear User,</p>
          <p>Your verification code is:</p>
          <h2 style="color: #4CAF50;">${verificationCode}</h2>
          <p>Please use this code to complete your registration. This code will expire in 5 minutes</p>
          <div style="text-align: center;">
            <p>Thank you,</p>
            <p>ProgrammerVIVA Team</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #777; font-size: 12px; margin-top: 20px;">
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      </div>
    </div>
  `;
}

// export const verifyOTP = catchAsyncError(async (req, res, next) => {

//   const { email, otp, phone } = req.body;

//   function validatePhoneNumber(phone) {
//     const phoneRegex = /^\+91\d{10}$/; // To validate an Indian phone number.
//     return phoneRegex.test(phone);
//   }

//   if (!validatePhoneNumber(phone)) {
//     return next(new ErrorHandler("Please enter a valid phone number", 400));
//   }

//   try {
//     const userAllEntries = await User.find({
//       $or: [
//         {
//           email,
//           accountVerified: false,
//         },
//         {
//           phone,
//           accountVerified: false,
//         }
//       ]
//     }).sort({ createdAt: -1 });

//     if (!userAllEntries) {
//       return next(new ErrorHandler("User Not Found", 400));
//     }

//     let user;
//     if (userAllEntries.length > 1) {
//       user = userAllEntries[0];

//       await User.deleteMany({
//         _id: { $ne: user._id },
//         $or: [
//           {
//             email,
//             accountVerified: false,
//           },
//           {
//             phone,
//             accountVerified: false,
//           }
//         ]
//       })
//     } else {
//       user = userAllEntries[0];
//     }

//     if (user.verificationCode !== Number(otp)) {
//       return next(new ErrorHandler('Invalid OTP', 400))
//     }

//     const currentTime = Date.now()
//     const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
//     console.log(currentTime);
//     console.log(verificationCodeExpire);

//     if (currentTime > verificationCodeExpire) {
//       return next(new ErrorHandler('OTP Expired', 400))
//     }

//     user.accountVerified = true;
//     user.verificationCode = "";
//     user.verificationCodeExpire = "";

//     await user.save({ validateModifiedOnly: true });

//     sendToken(user, 200, "Account verified successfully", res)

//   } catch (error) {
//     return next(new ErrorHandler('Internal Server Error.', 500));
//   }
// })

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  // Validate phone number format
  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+91\d{10}$/; // To validate an Indian phone number.
    return phoneRegex.test(phone);
  }

  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Please enter a valid phone number", 400));
  }

  try {
    // Fetch user entries with matching email or phone where account is not verified
    const userAllEntries = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false },
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found", 404));
    }

    let user;
    if (userAllEntries.length > 1) {
      // Get the latest user entry and delete older ones
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { email, accountVerified: false },
          { phone, accountVerified: false },
        ],
      });
    } else {
      user = userAllEntries[0];
    }

    // Validate OTP
    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP expired", 400));
    }

    // Update user data for successful verification
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({ validateModifiedOnly: true });

    // Send success response with token
    sendToken(user, 200, "Account verified successfully", res);
  } catch (error) {
    console.error("Error in verifyOTP function:", error); // Log error for debugging
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});


export const login = catchAsyncError(async (req, res, next) =>{
  const { email, password } = req.body;
  if(!email || !password){
    return next(new ErrorHandler('Please enter email and password', 400))
  }

  const user = await User.findOne({email, accountVerified: true}).select('+password');
  if(!user){
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  const isPasswordMatched = await user.comparePassword(password);
  if(!isPasswordMatched){
    return next(new ErrorHandler('Invalid email or password', 401))
  }
  
  sendToken(user, 200, 'Logged in successfully', res)
  
})

export const logout = catchAsyncError(async (req, res, next) =>{
  res.status(200).cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  }).json({
    success: true,
    message: 'Logged out successfully'
  })
})

export const getUser = catchAsyncError(async (req, res, next) =>{
  const user = req.user; // Using existing user data from auth middleware
  res.status(200).json({
    success: true,
    user
  })
})

export const forgotPassword = catchAsyncError(async(req, res, next)=>{
  const user = await User.findOne({email: req.body.email, accountVerified: true,})
  if(!user){
    return next(new ErrorHandler('User not found', 404))
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({validateBeforeSave: false});
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset${resetToken}`;

  const message = `Your password has been reset. Please go to the following link to reset your password: \n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore this email.`

  try {
    sendEmail({email: user.email, subject: 'Password Recovery', message});
    res.status(200).json({
      success: true,
      message: `Password reset email sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave: false});
    return next(new ErrorHandler(error.message ? error.message:'Email could not be sent', 500))
  }
})

export const resetPassword = catchAsyncError(async(req, res, next)=>{
  const {token} = req.params
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if(!user){
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, 'Password reset successfully', res)
  
})