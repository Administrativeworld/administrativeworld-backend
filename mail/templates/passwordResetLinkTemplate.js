const passwordResetLinkTemplate = (resetLink, userEmail) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Administrative World</title>
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
      background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%);
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
      color: #ffffff;
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
    
    .user-email {
      background: #f7fafc;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-weight: 600;
      color: #2d3748;
      border-left: 4px solid #4299e1;
    }
    
    .reset-button-section {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 12px;
      padding: 40px 30px;
      margin: 30px 0;
      border: 2px dashed #e2e8f0;
    }
    
    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 18px 40px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
      border: none;
      cursor: pointer;
    }
    
    .reset-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(66, 153, 225, 0.6);
      background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
    }
    
    .reset-button:active {
      transform: translateY(0);
    }
    
    .link-validity {
      font-size: 14px;
      color: #e53e3e;
      font-weight: 600;
      margin-top: 20px;
    }
    
    .alternative-link {
      background: #f0f4f8;
      border: 1px solid #cbd5e0;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      text-align: left;
    }
    
    .alternative-title {
      color: #2d3748;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .alternative-title::before {
      content: '🔗';
      margin-right: 8px;
    }
    
    .alternative-text {
      color: #4a5568;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    
    .copy-link {
      background: #edf2f7;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #2d3748;
      word-break: break-all;
      line-height: 1.4;
      margin-top: 10px;
    }
    
    .instructions {
      background: #fef5e7;
      border-left: 4px solid #ed8936;
      padding: 20px;
      margin: 30px 0;
      border-radius: 0 8px 8px 0;
      text-align: left;
    }
    
    .instructions-title {
      font-weight: 700;
      color: #c05621;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .instructions-title::before {
      content: '🔑';
      margin-right: 8px;
      font-size: 16px;
    }
    
    .instructions-text {
      color: #c05621;
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
      content: '⚠️';
      margin-right: 8px;
    }
    
    .security-text {
      color: #742a2a;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .not-you-section {
      background: #f0f4f8;
      border: 1px solid #cbd5e0;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
      text-align: left;
    }
    
    .not-you-title {
      color: #2d3748;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .not-you-title::before {
      content: '❓';
      margin-right: 8px;
    }
    
    .not-you-text {
      color: #4a5568;
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
      
      .reset-button-section {
        padding: 30px 20px;
      }
      
      .reset-button {
        padding: 16px 30px;
        font-size: 14px;
      }
      
      .footer {
        padding: 20px;
      }
      
      .copy-link {
        font-size: 11px;
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
      
      .reset-button-section {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        border-color: #4a5568;
      }
      
      .user-email {
        background: #2d3748;
        color: #e2e8f0;
      }
      
      .copy-link {
        background: #2d3748;
        color: #e2e8f0;
        border-color: #4a5568;
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
      <h1 class="header-title">Password Reset Request</h1>
    </div>
    
    <div class="content">
      <p class="welcome-text">
        Hello! 👋<br>
        We received a request to reset your password for your <strong>Administrative World</strong> account. Click the button below to create a new password.
      </p>
      
      ${userEmail ? `<div class="user-email">
        Account: ${userEmail}
      </div>` : ''}
      
      <div class="reset-button-section">
        <a href="${resetLink}" class="reset-button">
          Reset My Password
        </a>
        <div class="link-validity">🔒 This link expires in 1 hour for your security</div>
      </div>
      
      <div class="alternative-link">
        <div class="alternative-title">Button not working?</div>
        <div class="alternative-text">
          If the button above doesn't work, you can copy and paste this link into your browser:
        </div>
        <div class="copy-link">${resetLink}</div>
      </div>
      
      <div class="instructions">
        <div class="instructions-title">How to reset your password:</div>
        <div class="instructions-text">
          1. Click the "Reset My Password" button above<br>
          2. You'll be redirected to a secure password reset page<br>
          3. Enter your new secure password<br>
          4. Confirm your new password and save changes
        </div>
      </div>
      
      <div class="security-notice">
        <div class="security-title">Important Security Information</div>
        <div class="security-text">
          This link expires in 1 hour for your security. Never share this link with anyone - Administrative World staff will never ask for your password reset links. If you suspect any suspicious activity, contact our security team immediately.
        </div>
      </div>
      
      <div class="not-you-section">
        <div class="not-you-title">Didn't request this?</div>
        <div class="not-you-text">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged, and this reset link will expire automatically. However, we recommend checking your account security if you receive multiple unexpected emails.
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

export default passwordResetLinkTemplate;