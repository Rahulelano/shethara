import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER || "shetharafashion@gmail.com";
const GMAIL_PASS = process.env.GMAIL_PASS || "apxb hdlv vevs adiu";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export async function sendOrderConfirmation(order: any) {
  try {
    const itemsHtml = order.items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong> ${item.color ? `(${item.color})` : ""}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #182628; padding: 30px; text-align: center;">
          <h1 style="color: #65CCB8; margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: 2px;">SHETHARA FASHION</h1>
          <p style="color: #ffffff; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Order Confirmation</p>
        </div>
        
        <div style="padding: 30px; color: #182628;">
          <h2 style="margin-top: 0; color: #3B945E;">Hello, ${order.customer.firstName} ${order.customer.lastName}!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">
            Thank you for shopping with Shethara Fashion! We have received your order <strong>#${order.orderId}</strong> and are preparing it with utmost care and luxury.
          </p>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; font-size: 16px; color: #182628; border-bottom: 2px solid #3B945E; padding-bottom: 8px;">Delivery Summary</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Phone:</strong> ${order.customer.phone}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Current Status:</strong> <span style="color: #3B945E; font-weight: bold;">${order.status}</span></p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #475569; text-align: left;">
                <th style="padding: 12px;">Item Description</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total Amount:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #3B945E; font-size: 16px;">₹${order.total.toLocaleString("en-IN")}</td>
              </tr>
            </tfoot>
          </table>

          <p style="font-size: 14px; color: #718096; margin-top: 30px;">
            If you have any questions or require private styling assistance, simply reply to this email or visit our boutique in Choolaimedu, Chennai.
          </p>
          
          <div style="margin-top: 35px; border-top: 1px solid #e2e8f0; pt-4; text-align: center; font-size: 12px; color: #a0aec0;">
            <p style="margin: 10px 0;">Shethara Fashion · No.16/1, Pari Street 2nd Cross, Choolaimedu, Chennai 600094</p>
            <p style="margin: 0;">Call/WhatsApp: +91 88078 63026</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Shethara Fashion" <${GMAIL_USER}>`,
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderId} — Shethara Fashion`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MailService] Order confirmation email sent to ${order.customer.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[MailService] Error sending order confirmation email:`, error);
    return false;
  }
}

export async function sendAdminAlert(subject: string, htmlContent: string) {
  try {
    const mailOptions = {
      from: `"Shethara System Alert" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `[Admin Notification] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #3B945E;">Shethara Fashion Alert</h2>
          <div>${htmlContent}</div>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">System auto-generated notification</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MailService] Admin alert sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[MailService] Error sending admin alert:`, error);
    return false;
  }
}

export async function sendReplyToCustomer(to: string, subject: string, htmlMessage: string) {
  try {
    const mailOptions = {
      from: `"Shethara Fashion Boutique" <${GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #182628; padding: 20px; text-align: center;">
            <h2 style="color: #65CCB8; margin: 0; font-family: 'Playfair Display', serif;">SHETHARA FASHION</h2>
          </div>
          <div style="padding: 25px; color: #182628; font-size: 15px; line-height: 1.6;">
            ${htmlMessage}
            <br /><br />
            <p style="margin: 0; font-weight: 600; color: #3B945E;">Warm regards,</p>
            <p style="margin: 2px 0 0; color: #4a5568;">Shethara Fashion Team</p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            No.16/1, Pari Street 2nd Cross, Choolaimedu, Chennai 600094 · +91 88078 63026
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MailService] Reply email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[MailService] Error sending customer reply email:`, error);
    return false;
  }
}
