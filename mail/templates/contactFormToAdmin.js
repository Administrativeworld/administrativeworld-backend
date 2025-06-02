export const contactFormToAdmin = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  const fullName = `${firstname || "N/A"} ${lastname || ""}`.trim();
  const formattedPhone = countrycode && phoneNo ? `${countrycode} ${phoneNo}` : phoneNo || "Not provided";

  return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>New Contact Form Submission</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #000;
          }
          .body {
              font-size: 16px;
              margin-bottom: 20px;
              text-align: left;
          }
          .highlight {
              font-weight: bold;
          }
          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="https://studynotion-edtech-project.vercel.app">
              <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
          </a>
          <div class="message">New Contact Form Submission</div>
          <div class="body">
              <p>You have received a new message via the contact form. Here are the details:</p>
              <p><span class="highlight">Full Name:</span> ${fullName}</p>
              <p><span class="highlight">Email:</span> ${email || "Not provided"}</p>
              <p><span class="highlight">Phone Number:</span> ${formattedPhone}</p>
              <p><span class="highlight">Message:${message}</span></p>
              <p>${message || "No message provided"}</p>
          </div>
          <div class="support">This is an automated notification. Please do not reply to this email.</div>
      </div>
  </body>
  </html>`;
};
