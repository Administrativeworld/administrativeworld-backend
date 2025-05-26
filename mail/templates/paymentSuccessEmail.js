export const paymentSuccessEmail = (name, amount, orderId, paymentId) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation - Administrative World</title>
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
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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
      
      .success-icon {
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
      
      .success-icon::before {
        content: '✓';
        color: #48bb78;
        font-size: 30px;
        font-weight: bold;
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
      
      .payment-details {
        background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
        border: 2px solid #9ae6b4;
        border-radius: 12px;
        padding: 30px;
        margin: 30px 0;
      }
      
      .payment-title {
        font-size: 18px;
        color: #2f855a;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .payment-title::before {
        content: '💰';
        margin-right: 10px;
        font-size: 16px;
      }
      
      .amount-display {
        font-size: 42px;
        font-weight: 800;
        color: #2f855a;
        margin: 20px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .payment-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 30px;
      }
      
      .info-item {
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        text-align: left;
      }
      
      .info-label {
        font-size: 12px;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .info-value {
        font-size: 16px;
        color: #2d3748;
        font-weight: 700;
        font-family: 'Courier New', monospace;
      }
      
      .next-steps {
        background: #fff5f5;
        border-left: 4px solid #fc8181;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 8px 8px 0;
        text-align: left;
      }
      
      .next-steps-title {
        font-weight: 700;
        color: #c53030;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .next-steps-title::before {
        content: '📋';
        margin-right: 8px;
        font-size: 16px;
      }
      
      .next-steps-text {
        color: #742a2a;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .cta-section {
        margin: 40px 0;
      }
      
      .cta-button {
        display: inline-block;
        padding: 15px 30px;
        background: linear-gradient(135deg, #FFD60A 0%, #FF8500 100%);
        color: #000000;
        text-decoration: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 214, 10, 0.3);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 214, 10, 0.4);
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
        background: #48bb78;
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
        
        .amount-display {
          font-size: 32px;
        }
        
        .payment-info {
          grid-template-columns: 1fr;
          gap: 15px;
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
        
        .info-item {
          background: #2d3748;
          border-color: #4a5568;
        }
        
        .info-value {
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
        <h1 class="header-title">Payment Successful!</h1>
        <div class="success-icon"></div>
      </div>
      
      <div class="content">
        <h2 class="welcome-text">Thank you, ${name}! 🎉</h2>
        <p class="subtitle">
          Your payment has been processed successfully. You now have full access to your purchased course content.
        </p>
        
        <div class="payment-details">
          <div class="payment-title">Payment Summary</div>
          <div class="amount-display">₹${amount}</div>
          
          <div class="payment-info">
            <div class="info-item">
              <div class="info-label">Payment ID</div>
              <div class="info-value">${paymentId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Order ID</div>
              <div class="info-value">${orderId}</div>
            </div>
          </div>
        </div>
        
        <div class="next-steps">
          <div class="next-steps-title">What's Next?</div>
          <div class="next-steps-text">
            Your course access has been activated automatically. You can now log in to your account and start learning immediately. If you don't see your course content within 5 minutes, please contact our support team.
          </div>
        </div>
        
        <div class="cta-section">
          <a href="#" class="cta-button">Access Your Course</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          Need help or have questions about your purchase? Contact our support team at 
          <a href="mailto:support@administrativeworld.com" class="footer-link">support@administrativeworld.com</a>
        </p>
        <p class="footer-text">
          We're here to help and typically respond within 24 hours.
        </p>
        <p class="footer-text" style="margin-top: 15px;">
          © 2025 Administrative World. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;
};