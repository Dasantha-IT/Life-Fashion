import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_NOTIFY_EMAIL,
    pass: process.env.ADMIN_PASSWORD_EMAIL,
  },
});

// verify connection config
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email server ready");
  }
});

export const sendLowStockEmail = async (product) => {
  try {
    const info = await transporter.sendMail({
      from: `"Stock Manager" <${process.env.ADMIN_NOTIFY_EMAIL}>`,
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject: `Low Stock Alert: ${product.name}`,
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Low Stock Alert</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; background-color: #f7f7f7;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="padding: 15px; background-color: #ff5252; color: white; border-radius: 6px 6px 0 0; text-align: center;">
                <h2 style="margin: 0; font-size: 22px;">🚨 Low Stock Alert</h2>
              </div>
              
              <!-- Content -->
              <div style="padding: 25px 20px;">
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 15px 0;">
                  The following product requires immediate attention:
                </p>
                
                <div style="background-color: #f9f9f9; border-left: 4px solid #ff5252; padding: 15px; margin: 20px 0;">
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong>Product:</strong> ${product.name}
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong>Current Quantity:</strong> <span style="color: #ff5252; font-weight: bold;">${
                      product.quantity
                    }</span>
                  </p>
                  <p style="margin: 5px 0; font-size: 16px;">
                    <strong>Status:</strong> Below minimum threshold
                  </p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.5; margin: 25px 0 15px 0;">
                  Please restock this item as soon as possible to avoid stockouts and potential sales loss.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${
                    process.env.DASHBOARD_URL || "#"
                  }" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View Inventory</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; margin-top: 20px;">
                <p style="margin: 5px 0;">This is an automated notification from Life Fashion inventory management system.</p>
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Life Fashion. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
    });

    console.log("Low stock email sent:", info.messageId);
  } catch (error) {
    console.log("Error sending low stock email:", error);
  }
};

export const sendOrderConfirmationEmail = async (user, orderId) => {
  try {
    const info = await transporter.sendMail({
      from: `"Life Fashion" <${process.env.ADMIN_NOTIFY_EMAIL}>`,
      to: user.email,
      subject: `Your Order Confirmation - ${orderId}`,
      html: `
        <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica', Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <!-- Header -->
              <div style="background-color: #4A154B; padding: 25px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 500;">Order Confirmation</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px 25px;">
                <h2 style="color: #333; font-size: 20px; margin-top: 0;">Thank you for your order, <span style="color: #4A154B;">${
                  user.name || "Customer"
                }</span>!</h2>
                
                <p style="font-size: 16px; color: #333; line-height: 1.5;">Your order has been placed successfully and is being processed.</p>
                
                <!-- Order Info Box -->
                <div style="background-color: #f7f7f9; border-left: 4px solid #4A154B; border-radius: 4px; padding: 15px; margin: 25px 0;">
                  <p style="margin: 0; font-size: 16px;"><strong style="color: #4A154B;">Order ID:</strong> ${orderId}</p>
                </div>
                
                <p style="font-size: 16px; color: #333; line-height: 1.5;">We'll notify you when your order is out for delivery.</p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0 20px;">
                  <a href="${
                    process.env.ORDER_LIST_URL || "#"
                  }" style="background-color: #4A154B; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: 500; display: inline-block;">Track Your Order</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f7f7f9; padding: 20px; text-align: center;">
                <p style="font-size: 14px; color: #666; margin: 0;">Life Fashion - Your Style Partner</p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">© 2025 Life Fashion. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
      `,
    });

    console.log("Order confirmation email sent:", info.messageId);
  } catch (error) {
    console.log("Error sending order confirmation email:", error);
  }
};
