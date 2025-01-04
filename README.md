# MERN Authentication Project

This project demonstrates a complete authentication system using the MERN stack (MongoDB, Express, React, Node.js) with OTP verification using Twilio and Nodemailer.

## Project Structure

### Frontend

The frontend is built using React and is structured as follows:

GitHub Copilot
Searching 3 directories for "Create a README.md file for a MERN stack application with authentication, including endpoints and descriptions for each component."…

Here is a README.md file that includes details about the project, its structure, and endpoints:

frontend/ ├── src/ │ ├── components/ │ │ ├── Hero.jsx │ │ ├── Instructor.jsx │ │ ├── Login.jsx │ │ ├── Register.jsx │ │ └── Technologies.jsx │ ├── layout/ │ │ └── Footer.jsx │ ├── pages/ │ │ ├── Auth.jsx │ │ ├── ForgotPassword.jsx │ │ ├── Home.jsx │ │ ├── OtpVerification.jsx │ │ └── ResetPassword.jsx │ ├── styles/ │ │ ├── Auth.css │ │ ├── Footer.css │ │ ├── ForgotPassword.css │ │ ├── Hero.css │ │ ├── Home.css │ │ ├── Instructor.css │ │ ├── OtpVerification.css │ │ ├── ResetPassword.css │ │ └── Technologies.css │ ├── App.jsx │ ├── App.css │ ├── main.jsx │ └── index.html ├── .gitignore ├── package.json └── vite.config.js

### Backend

The backend is built using Node.js and Express and is structured as follows:

backend/ ├── automation/ │ └── removeUnverifiedAccounts.js ├── controllers/ │ └── userController.js ├── database/ │ └── dbConnection.js ├── middlewares/ │ ├── authMiddleware.js │ ├── catchAsyncErrorMiddleware.js │ └── errorMiddleware.js ├── models/ │ └── userModel.js ├── routes/ │ └── userRouter.js ├── utils/ │ ├── sendEmail.js │ └── sendToken.js ├── .env ├── .gitignore ├── app.js ├── package.json └── server.js

## Endpoints

### User Authentication

- **Register User**
  - **URL:** `/api/v1/user/register`
  - **Method:** `POST`
  - **Description:** Registers a new user and sends a verification code via email or phone.
  - **Request Body:**
    ```json
    {
      "name": "Vikas Vaibhav",
      "email": "viva@example.com",
      "phone": "+911234567890",
      "password": "password123",
      "verificationMethod": "email" // or "phone"
    }
    ```

- **Verify OTP**
  - **URL:** `/api/v1/user/otp-verification`
  - **Method:** `POST`
  - **Description:** Verifies the OTP sent to the user's email or phone.
  - **Request Body:**
    ```json
    {
      "email": "viva@example.com",
      "otp": "12345",
      "phone": "+911234567890"
    }
    ```

- **Login User**
  - **URL:** `/api/v1/user/login`
  - **Method:** `POST`
  - **Description:** Logs in a user.
  - **Request Body:**
    ```json
    {
      "email": "viva@example.com",
      "password": "password123"
    }
    ```

- **Logout User**
  - **URL:** `/api/v1/user/logout`
  - **Method:** `GET`
  - **Description:** Logs out the authenticated user.

- **Get User Details**
  - **URL:** `/api/v1/user/me`
  - **Method:** `GET`
  - **Description:** Retrieves the details of the authenticated user.

- **Forgot Password**
  - **URL:** `/api/v1/user/password/forgot`
  - **Method:** `POST`
  - **Description:** Sends a password reset link to the user's email.
  - **Request Body:**
    ```json
    {
      "email": "viva@example.com"
    }
    ```

- **Reset Password**
  - **URL:** `/api/v1/user/password/reset/:token`
  - **Method:** `PUT`
  - **Description:** Resets the user's password using the token sent to their email.
  - **Request Body:**
    ```json
    {
      "password": "newpassword123",
      "confirmPassword": "newpassword123"
    }
    ```

## Creator

This project was created by Vikas Vaibhav.

## License

This project is licensed under the ISC License.
