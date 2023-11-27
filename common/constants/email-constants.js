const emailVerification = (name, code) => {
  return `
  <h1>Subject: Don Honorio Ventura State University Email Verification Code</h1>

  <h2>Dear ${name}</h2>,

  <p>Thank you for registering with Don Honorio Ventura State University! To complete the verification process and ensure the security of your account, please use the following verification code:</p>

  <h2>Verification Code: ${code}</h2>

  <p>Please enter this code on the verification page to confirm your email address and activate your account. If you did not register for an account with Don Honorio Ventura State University, please disregard this email.</p>

  <p>If you have any questions or need assistance, please contact our support team at chatsistant@gmail.com.</p>

  <p>Thank you for choosing Don Honorio Ventura State University.</p>

  <p>Best regards,</p>

  <h2>Don Honorio Ventura State University</h2>
  <h2>chatsistant@gmail.com</h2>`;
};

const forgotPasswordVerification = (name, code) => {
  return `
  <h1>Subject: Don Honorio Ventura State University Password Reset</h1>

  <p>Dear ${name},</p>

  <p>We received a request to reset the password associated with your Don Honorio Ventura State University account. To proceed with the password reset, please use the following verification code:</p>

  <h2>Verification Code: ${code}</h2>

  <p>Please enter this code on the password reset page to verify your identity and set a new password for your account. If you did not request a password reset, please disregard this email.</p>

  <p>If you encounter any issues or have concerns, feel free to contact our support team at chatsistant@gmail.com.</p>

  <p>Thank you for your cooperation.</p>

  <p>Best regards,</p>

  <h2>Don Honorio Ventura State University</h2>
  <h2>chatsistant@gmail.com</h2>
  `;
};

const emailInquiry = (name, question, answer) => {
  return `
    <h1>Hello, ${name}! This is admission at Don Honorio Ventura State University</h1>
    
    <h2>Your Question: ${question}</h2>
    
    <h2>Answer: ${answer}</h2>

    <p>If you have any further questions or need additional information, please feel free to reach out to us. We are here to assist you throughout the admission process.</p>

    <p>Thank you for considering Don Honorio Ventura State University.</p>

    <p>Best regards,</p>
            
    <p>Don Honorio Ventura State University</p>
    
    <p>chatsistant@gmail.com</p>`;
};

module.exports = {
  emailInquiry,
  emailVerification,
  forgotPasswordVerification,
};
