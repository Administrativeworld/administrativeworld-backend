const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account - Administrative World</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333333;
      padding: 20px;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #FFD60A 0%, #FF8500 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.05"/><circle cx="10" cy="90" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    }
    
    .logo {
      max-width: 180px;
      height: auto;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    .header-title {
      color: #000000;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      position: relative;
      z-index: 1;
    }
    
    .content {
      padding: 50px 40px;
      text-align: center;
    }
    
    .welcome-text {
      font-size: 18px;
      color: #4a5568;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .otp-section {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
      border: 2px dashed #e2e8f0;
    }
    
    .otp-label {
      font-size: 14px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      color: #2d3748;
      font-family: 'Courier New', monospace;
      letter-spacing: 8px;
      margin: 10px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .otp-validity {
      font-size: 14px;
      color: #e53e3e;
      font-weight: 600;
      margin-top: 15px;
    }
    
    .instructions {
      background: #f0fff4;
      border-left: 4px solid #48bb78;
      padding: 20px;
      margin: 30px 0;
      border-radius: 0 8px 8px 0;
      text-align: left;
    }
    
    .instructions-title {
      font-weight: 700;
      color: #2f855a;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .instructions-title::before {
      content: '✓';
      margin-right: 8px;
      font-size: 16px;
    }
    
    .instructions-text {
      color: #2f855a;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .security-notice {
      background: #fff5f5;
      border: 1px solid #fed7d7;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      text-align: left;
    }
    
    .security-title {
      color: #c53030;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .security-title::before {
      content: '🔒';
      margin-right: 8px;
    }
    
    .security-text {
      color: #742a2a;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .footer {
      background: #f7fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-text {
      color: #718096;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .footer-link {
      color: #4299e1;
      text-decoration: none;
      font-weight: 600;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    .social-links {
      margin-top: 20px;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      width: 40px;
      height: 40px;
      background: #e2e8f0;
      border-radius: 50%;
      line-height: 40px;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-links a:hover {
      background: #4299e1;
      color: white;
      transform: translateY(-2px);
    }
    
    /* Mobile responsiveness */
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .otp-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
      
      .footer {
        padding: 20px;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-wrapper {
        background: #1a202c;
        color: #e2e8f0;
      }
      
      .welcome-text {
        color: #a0aec0;
      }
      
      .otp-section {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        border-color: #4a5568;
      }
      
      .otp-code {
        color: #e2e8f0;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <img class="logo" 
           src="https://res.cloudinary.com/tuhaniaji342cloud/image/upload/v1740144719/chatty_avatars/amgo5bzkpsuvm28g4wh3.png" 
           alt="Administrative World Logo">
      <h1 class="header-title">Account Verification</h1>
    </div>
    
    <div class="content">
      <p class="welcome-text">
        Welcome to <strong>Administrative World</strong>! 🎉<br>
        We're excited to have you on board. To complete your registration and secure your account, please verify your email address using the code below.
      </p>
      
      <div class="otp-section">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-validity">⏰ Valid for 5 minutes only</div>
      </div>
      
      <div class="instructions">
        <div class="instructions-title">How to use this code:</div>
        <div class="instructions-text">
          Copy the verification code above and paste it into the verification field on our website. This will activate your account and give you full access to all Administrative World features.
        </div>
      </div>
      
      <div class="security-notice">
        <div class="security-title">Security Notice</div>
        <div class="security-text">
          If you didn't create an account with Administrative World, please ignore this email. This code will expire automatically and no account will be created. For security reasons, never share this code with anyone.
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        Need help? Contact our support team at 
        <a href="mailto:support@administrativeworld.com" class="footer-link">support@administrativeworld.com</a>
      </p>
      <p class="footer-text" style="margin-top: 15px;">
        © 2025 Administrative World. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
};

export default otpTemplate;