export const passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Update Confirmation - Administrative World</title>
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
        background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
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
      
      .security-icon {
        width: 60px;
        height: 60px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px auto 0;
        position: relative;
        z-index: 1;
      }
      
      .security-icon::before {
        content: '🔒';
        font-size: 24px;
      }
      
      .content {
        padding: 50px 40px;
        text-align: center;
      }
      
      .welcome-text {
        font-size: 20px;
        color: #2d3748;
        margin-bottom: 15px;
        line-height: 1.6;
        font-weight: 600;
      }
      
      .subtitle {
        font-size: 16px;
        color: #4a5568;
        margin-bottom: 40px;
        line-height: 1.6;
      }
      
      .update-confirmation {
        background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
        border: 2px solid #90cdf4;
        border-radius: 12px;
        padding: 30px;
        margin: 30px 0;
      }
      
      .confirmation-title {
        font-size: 18px;
        color: #2c5282;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .confirmation-title::before {
        content: '✅';
        margin-right: 10px;
        font-size: 16px;
      }
      
      .account-info {
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin: 20px 0;
      }
      
      .account-label {
        font-size: 12px;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .account-value {
        font-size: 16px;
        color: #2d3748;
        font-weight: 700;
        font-family: 'Courier New', monospace;
      }
      
      .timestamp {
        font-size: 14px;
        color: #4a5568;
        margin-top: 15px;
      }
      
      .security-alert {
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
      }
      
      .alert-title {
        color: #c53030;
        font-weight: 700;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .alert-title::before {
        content: '⚠️';
        margin-right: 8px;
      }
      
      .alert-text {
        color: #742a2a;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .security-tips {
        background: #f0fff4;
        border-left: 4px solid #48bb78;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 8px 8px 0;
        text-align: left;
      }
      
      .tips-title {
        font-weight: 700;
        color: #2f855a;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .tips-title::before {
        content: '💡';
        margin-right: 8px;
        font-size: 16px;
      }
      
      .tips-text {
        color: #2f855a;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .tips-list {
        list-style: none;
        margin-top: 10px;
      }
      
      .tips-list li {
        margin: 5px 0;
        padding-left: 20px;
        position: relative;
      }
      
      .tips-list li::before {
        content: '•';
        color: #2f855a;
        position: absolute;
        left: 0;
        font-weight: bold;
      }
      
      .cta-section {
        margin: 40px 0;
      }
      
      .cta-button {
        display: inline-block;
        padding: 15px 30px;
        background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
        color: #ffffff;
        text-decoration: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
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
        margin-bottom: 15px;
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
        
        .footer {
          padding: 20px;
        }
        
        .cta-button {
          padding: 12px 25px;
          font-size: 14px;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .email-wrapper {
          background: #1a202c;
          color: #e2e8f0;
        }
        
        .welcome-text, .subtitle {
          color: #e2e8f0;
        }
        
        .account-info {
          background: #2d3748;
          border-color: #4a5568;
        }
        
        .account-value {
          color: #e2e8f0;
        }
        
        .update-confirmation {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
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
        <h1 class="header-title">Password Updated</h1>
        <div class="security-icon"></div>
      </div>
      
      <div class="content">
        <h2 class="welcome-text">Hi ${name}! 👋</h2>
        <p class="subtitle">
          Your password has been successfully updated. Your account security has been enhanced.
        </p>
        
        <div class="update-confirmation">
          <div class="confirmation-title">Password Change Confirmed</div>
          
          <div class="account-info">
            <div class="account-label">Account Email</div>
            <div class="account-value">${email}</div>
          </div>
          
          <div class="timestamp">
            Updated on: ${new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    })}
          </div>
        </div>
        
        <div class="security-alert">
          <div class="alert-title">Didn't make this change?</div>
          <div class="alert-text">
            If you did not request this password change, please contact our security team immediately. Your account may have been compromised, and we'll help you secure it right away.
          </div>
        </div>
        
        <div class="security-tips">
          <div class="tips-title">Keep Your Account Secure</div>
          <div class="tips-text">
            Here are some tips to maintain strong account security:
          </div>
          <ul class="tips-list">
            <li>Use a unique password that you don't use elsewhere</li>
            <li>Enable two-factor authentication if available</li>
            <li>Never share your login credentials with anyone</li>
            <li>Log out from shared or public computers</li>
          </ul>
        </div>
        
        <div class="cta-section">
          <a href="#" class="cta-button">Access Your Account</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          If you have any security concerns or need assistance, contact our support team at 
          <a href="mailto:support@administrativeworld.com" class="footer-link">support@administrativeworld.com</a>
        </p>
        <p class="footer-text">
          Our security team is available 24/7 to help protect your account.
        </p>
        <p class="footer-text" style="margin-top: 15px;">
          © 2025 Administrative World. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;
};