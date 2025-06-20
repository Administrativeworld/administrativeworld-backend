export const courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Confirmation - Administrative World</title>
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
        background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
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
      
      .enrollment-icon {
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
      
      .enrollment-icon::before {
        content: '🎓';
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
      
      .course-details {
        background: linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%);
        border: 2px solid #c4b5fd;
        border-radius: 12px;
        padding: 30px;
        margin: 30px 0;
      }
      
      .course-title {
        font-size: 18px;
        color: #553c9a;
        font-weight: 700;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .course-title::before {
        content: '📚';
        margin-right: 10px;
        font-size: 16px;
      }
      
      .course-name {
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin: 20px 0;
      }
      
      .course-label {
        font-size: 12px;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      .course-value {
        font-size: 20px;
        color: #2d3748;
        font-weight: 700;
        line-height: 1.4;
      }
      
      .enrollment-date {
        font-size: 14px;
        color: #553c9a;
        margin-top: 15px;
        font-weight: 600;
      }
      
      .next-steps {
        background: #f0fff4;
        border-left: 4px solid #48bb78;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 8px 8px 0;
        text-align: left;
      }
      
      .steps-title {
        font-weight: 700;
        color: #2f855a;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }
      
      .steps-title::before {
        content: '🚀';
        margin-right: 8px;
        font-size: 16px;
      }
      
      .steps-list {
        list-style: none;
        color: #2f855a;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .steps-list li {
        margin: 8px 0;
        padding-left: 25px;
        position: relative;
      }
      
      .steps-list li::before {
        content: counter(step-counter);
        counter-increment: step-counter;
        position: absolute;
        left: 0;
        top: 0;
        background: #48bb78;
        color: white;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
      }
      
      .steps-list {
        counter-reset: step-counter;
      }
      
      .learning-benefits {
        background: #fff8e1;
        border: 1px solid #ffcc02;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
      }
      
      .benefits-title {
        color: #f57c00;
        font-weight: 700;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .benefits-title::before {
        content: '✨';
        margin-right: 8px;
      }
      
      .benefits-text {
        color: #ef6c00;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .cta-section {
        margin: 40px 0;
      }
      
      .cta-button {
        display: inline-block;
        padding: 15px 30px;
        background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
        color: #ffffff;
        text-decoration: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(159, 122, 234, 0.3);
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(159, 122, 234, 0.4);
      }
      
      .secondary-cta {
        display: inline-block;
        padding: 12px 25px;
        background: transparent;
        color: #805ad5;
        text-decoration: none;
        border: 2px solid #805ad5;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        margin-left: 15px;
        transition: all 0.3s ease;
      }
      
      .secondary-cta:hover {
        background: #805ad5;
        color: white;
        transform: translateY(-1px);
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
        color: #9f7aea;
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
        background: #9f7aea;
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
          display: block;
          margin-bottom: 15px;
        }
        
        .secondary-cta {
          margin-left: 0;
          display: block;
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
        
        .course-name {
          background: #2d3748;
          border-color: #4a5568;
        }
        
        .course-value {
          color: #e2e8f0;
        }
        
        .course-details {
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
        <h1 class="header-title">Enrollment Confirmed!</h1>
        <div class="enrollment-icon"></div>
      </div>
      
      <div class="content">
        <h2 class="welcome-text">Welcome aboard, ${name}! 🎉</h2>
        <p class="subtitle">
          You've successfully enrolled in your course. Your learning journey starts now!
        </p>
        
        <div class="course-details">
          <div class="course-title">Course Enrollment Details</div>
          
          <div class="course-name">
            <div class="course-label">You're now enrolled in</div>
            <div class="course-value">${courseName}</div>
          </div>
          
          <div class="enrollment-date">
            Enrolled on: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
          </div>
        </div>
        
        <div class="next-steps">
          <div class="steps-title">Your Next Steps</div>
          <ol class="steps-list">
            <li>Access your learning dashboard using the button below</li>
            <li>Explore the course materials and syllabus</li>
            <li>Join the course community and connect with peers</li>
            <li>Start with the first module at your own pace</li>
            <li>Track your progress and celebrate milestones</li>
          </ol>
        </div>
        
        <div class="learning-benefits">
          <div class="benefits-title">What You'll Get</div>
          <div class="benefits-text">
            Access to comprehensive course materials, interactive exercises, peer discussions, instructor support, and a certificate of completion upon finishing the course.
          </div>
        </div>
        
        <div class="cta-section">
          <a href="https://administrativeworld.live/home/user" class="cta-button">Go to Dashboard</a>
          <a href="#" class="secondary-cta">Course Preview</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          Need help getting started or have questions about your course? Contact our learning support team at 
          <a href="mailto:support@administrativeworld.com" class="footer-link">support@administrativeworld.com</a>
        </p>
        <p class="footer-text">
          We're here to ensure you have the best learning experience possible!
        </p>
        <p class="footer-text" style="margin-top: 15px;">
          © 2025 Administrative World. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;
};