require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server connection FAILED:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    console.log(`Attempting to send email to: ${to}`);

    const info = await transporter.sendMail({
      from: `"Bank Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("✅ Message sent successfully!");
    console.log("Message ID: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

async function sendRegistrationEmail(userEmail, name) {
  console.log(`📨 sendRegistrationEmail called for: ${userEmail}`);

  const subject = "Welcome to Bank Ledger 🚀";

  const text = `Hi ${name},

Welcome to Bank Ledger!

We're thrilled to have you join us. Your account has been successfully created, and you're now ready to manage your finances with ease and confidence.

If you have any questions or need assistance, feel free to reach out anytime.

Warm regards,  
The Bank Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Welcome to Bank Ledger, ${name}! 🎉</h2>
        
        <p>We're excited to have you on board.</p>
        
        <p>Your account has been successfully created, and you can now start managing your transactions, tracking your finances, and staying in control effortlessly.</p>
        
        <p style="margin-top: 20px;">
            If you ever need help, our support team is always here for you.
        </p>

        <hr style="margin: 25px 0;" />

        <p style="font-size: 14px; color: #777;">
            Best regards,<br/>
            <strong>The Bank Ledger Team</strong>
        </p>
    </div>
    `;

  try {
    await sendEmail(userEmail, subject, text, html);
    console.log(`✅ Email sent successfully to ${userEmail}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${userEmail}:`, err.message);
  }
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "💸 Transaction Successful – Funds Transferred";

  const text = `
Hi ${name},

We wanted to inform you that a transaction has been successfully processed from your account.

Transaction Details:
- Amount Transferred: $${amount}
- Recipient Account: ${toAccount}

If you did not authorize this transaction, please contact our support team immediately.

Thank you for using Bank Ledger.

Best regards,  
Bank Ledger Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">💸 Transaction Successful</h2>
    
    <p>Hi <strong>${name}</strong>,</p>
    
    <p>Your transaction has been successfully processed. Here are the details:</p>
    
    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
      <p><strong>Amount Transferred:</strong> $${amount}</p>
      <p><strong>Recipient Account:</strong> ${toAccount}</p>
    </div>

    <p style="margin-top: 20px;">
      If you did not authorize this transaction, please contact our support team immediately.
    </p>

    <p>Thank you for choosing <strong>Bank Ledger</strong>.</p>

    <p style="margin-top: 30px;">Best regards,<br/>Bank Ledger Team</p>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailure(userEmail, name, amount, toAccount) {
  const subject = "⚠️ Transaction Failed – Action Required";

  const text = `
Hi ${name},

We regret to inform you that your recent transaction could not be completed.

Transaction Details:
- Attempted Amount: $${amount}
- Recipient Account: ${toAccount}

This may have occurred due to insufficient balance, incorrect account details, or a temporary system issue.

Please review your details and try again. If the issue persists, contact our support team.

Thank you for using Bank Ledger.

Best regards,  
Bank Ledger Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #E53935;">⚠️ Transaction Failed</h2>
    
    <p>Hi <strong>${name}</strong>,</p>
    
    <p>We regret to inform you that your recent transaction could not be completed.</p>
    
    <div style="background: #f8d7da; padding: 15px; border-radius: 8px;">
      <p><strong>Attempted Amount:</strong> $${amount}</p>
      <p><strong>Recipient Account:</strong> ${toAccount}</p>
    </div>

    <p style="margin-top: 20px;">
      This may have occurred due to insufficient balance, incorrect account details, or a temporary system issue.
    </p>

    <p>Please review your details and try again. If the issue persists, contact our support team.</p>

    <p style="margin-top: 30px;">Best regards,<br/>Bank Ledger Team</p>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailure,
};


