import { contactUsEmail } from "../mail/templates/contactFormRes.js";
import { contactFormToAdmin } from "../mail/templates/contactFormToAdmin.js";
import mailSender from "../utils/MailSender.js";
import Contactus from "../models/Contactus.js";

export async function contactUsController(req, res) {
  const { email, fullname, message, phoneNo, subject } = req.body;

  try {
    // Save to DB
    await Contactus.create({
      email,
      fullname,
      message,
      phoneNo,
      subject,
    });

    // Send confirmation email
    await mailSender(
      email,
      "Your data has been received",
      contactUsEmail(email, fullname, message, phoneNo, subject)
    );
    let myemail = 'contactadworld01@gmail.com';
    // Send form data to admin
    await mailSender(
      myemail,
      "New Contact Form Submission",
      contactFormToAdmin(email, fullname, message, phoneNo, subject)
    );

    return res.status(200).json({
      success: true,
      message: "Message submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the message.",
    });
  }
}
