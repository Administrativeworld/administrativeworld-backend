export const answerCheckedEmail = ({ name, questionText, exerciseTitle, checkDate }) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Answer Checked Notification</title>
    <style>
      body {
        background: #f6f9fc;
        font-family: Arial, sans-serif;
        padding: 0;
        margin: 0;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      }

      .header {
        background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
        color: white;
        text-align: center;
        padding: 30px 20px;
      }

      .header h1 {
        font-size: 22px;
        margin-bottom: 10px;
      }

      .header p {
        margin: 0;
        font-size: 14px;
      }

      .content {
        padding: 30px;
        color: #2d3748;
      }

      .content h2 {
        font-size: 20px;
        margin-bottom: 10px;
      }

      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .card {
        background: #f0fff4;
        border-left: 4px solid #38a169;
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 6px;
      }

      .footer {
        text-align: center;
        font-size: 12px;
        color: #a0aec0;
        padding: 20px;
        background: #edf2f7;
      }

      .btn {
        display: inline-block;
        margin-top: 20px;
        background: #38a169;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: bold;
      }

      .btn:hover {
        background: #2f855a;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Your Answer Has Been Reviewed</h1>
        <p>Administrative World</p>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>
          We're happy to let you know that your submitted answer has been checked and reviewed by our team.
        </p>

        <div class="card">
          <p><strong>📘 Exercise:</strong> ${exerciseTitle}</p>
          <p><strong>❓ Question:</strong> ${questionText}</p>
          <p><strong>🕒 Checked on:</strong> ${checkDate}</p>
        </div>

        <p>You can log in now to see the feedback or next steps.</p>

        <a class="btn" href="https://administrativeworld.live/home/user">Go to Dashboard</a>
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Administrative World. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
};
