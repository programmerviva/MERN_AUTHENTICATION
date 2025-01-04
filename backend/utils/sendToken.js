// export const sendToken = (user, statusCode, message, res)=>{
//     const token = user.generateToken();
//     res
//       .status(statusCode)
//       .cookie("token", token, {
//         expires: new Date(
//           Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//       })
//       .json({
//         success: true,
//         user,
//         message,
//         token,
//       });   
// }

export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();

    // Parse COOKIE_EXPIRE from environment variable
    let cookieExpireTime;
    if (process.env.COOKIE_EXPIRE) {
        const match = process.env.COOKIE_EXPIRE.match(/^(\d+)([dhms])$/);
        if (match) {
            const value = parseInt(match[1], 10);
            const unit = match[2];
            switch (unit) {
                case 'd':
                    cookieExpireTime = value * 24 * 60 * 60 * 1000;
                    break;
                case 'h':
                    cookieExpireTime = value * 60 * 60 * 1000;
                    break;
                case 'm':
                    cookieExpireTime = value * 60 * 1000;
                    break;
                case 's':
                    cookieExpireTime = value * 1000;
                    break;
                default:
                    cookieExpireTime = 5 * 24 * 60 * 60 * 1000; // Default to 5 days
            }
        } else {
            cookieExpireTime = 5 * 24 * 60 * 60 * 1000; // Default if parsing fails
        }
    } else {
        cookieExpireTime = 5 * 24 * 60 * 60 * 1000; // Default to 5 days
    }

    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(Date.now() + cookieExpireTime),
        httpOnly: true,
      })
      .json({
        success: true,
        user,
        message,
        token,
      });
};

 