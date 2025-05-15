import Delivery from "../models/DeliveryModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail", // e.g., "gmail"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email template function
const generateEmailTemplate = (delivery) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Delivery Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #e4e4e4;
          border-radius: 5px;
        }
        .header {
          background-color: #4a6ee0;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
        .info-section {
          margin: 20px 0;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Delivery Confirmation</h1>
        </div>
        
        <p>Hello ${delivery.firstName} ${delivery.lastName},</p>
        
        <p>Thank you for your order. We have received your delivery information and are processing your request.</p>
        
        <div class="info-section">
          <h3>Delivery Details:</h3>
          
          <div class="info-item">
            <span class="info-label">Name:</span> ${delivery.firstName} ${delivery.lastName}
          </div>
          
          <div class="info-item">
            <span class="info-label">Email:</span> ${delivery.email}
          </div>
          
          <div class="info-item">
            <span class="info-label">Phone:</span> ${delivery.phone || "Not provided"}
          </div>
          
          <div class="info-item">
            <span class="info-label">Delivery Address:</span><br>
            ${delivery.street}<br>
            ${delivery.city}, ${delivery.state} ${delivery.zipcode}<br>
            ${delivery.country}
          </div>
        </div>
        
        <p>If you need to update any information or have questions about your delivery, please contact our customer service.</p>
        
        <p>Thank you for choosing our service!</p>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send confirmation email
const sendDeliveryConfirmation = async (delivery) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Delivery Service" <noreply@yourcompany.com>',
      to: delivery.email,
      subject: "Your Delivery Information Has Been Received",
      html: generateEmailTemplate(delivery),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// display
const getAllDelivery = async (req, res, next) => {
    let Deliverys;

    try {
        Deliverys = await Delivery.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error while fetching deliveries"});
    }

    if(!Deliverys){
        return res.status(404).json({message:"Delivery not found"});
    }

    return res.status(200).json({ Deliverys });
};

// insert
const addDeliverys = async (req, res, next) => {
    const {firstName, lastName, email, street, city, state, zipcode, country, phone} = req.body;

    if (!email) {
        return res.status(400).json({message: "Email is required for delivery notifications"});
    }

    let deliverys;

    try{
        deliverys = new Delivery({
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone,
            createdAt: new Date()
        });
        
        await deliverys.save();
        
        // Send confirmation email
        const emailSent = await sendDeliveryConfirmation(deliverys);
        
        if (emailSent) {
            console.log(`Confirmation email sent to ${email}`);
        } else {
            console.warn(`Failed to send confirmation email to ${email}`);
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error while adding delivery"});
    }

    if(!deliverys){
        return res.status(404).json({message:"Unable to add delivery"});
    }
    
    return res.status(200).json({ 
        deliverys,
        emailSent: true
    });
};

//get id
const getById = async (req, res, next) => {
    const id = req.params.id;

    let delivery;

    try {
        delivery = await Delivery.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error while fetching delivery"});
    }

    if(!delivery){
        return res.status(404).json({message:"Unable to find delivery"});
    }
    
    return res.status(200).json({ delivery });
};

//update
const updateDelivery = async (req, res, next) => {
    const id = req.params.id;
    const {firstName, lastName, email, street, city, state, zipcode, country, phone} = req.body;

    let deliverys;

    try{
        deliverys = await Delivery.findById(id);
        
        if (!deliverys) {
            return res.status(404).json({message:"Delivery not found"});
        }
        
        // Update fields
        deliverys.firstName = firstName || deliverys.firstName;
        deliverys.lastName = lastName || deliverys.lastName;
        deliverys.email = email || deliverys.email;
        deliverys.street = street || deliverys.street;
        deliverys.city = city || deliverys.city;
        deliverys.state = state || deliverys.state;
        deliverys.zipcode = zipcode || deliverys.zipcode;
        deliverys.country = country || deliverys.country;
        deliverys.phone = phone || deliverys.phone;
        
        await deliverys.save();
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Server error while updating delivery"});
    }
    
    return res.status(200).json({ deliverys });
};

// delete
const deleteDelivery = async (req, res, next) => {
    const id = req.params.id;

    let delivery;

    try {
        delivery = await Delivery.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error while deleting delivery"});
    }
    
    if(!delivery){
        return res.status(404).json({message:"Unable to delete"});
    }
    
    return res.status(200).json({ 
        message: "Delivery deleted successfully",
        delivery 
    });
};

// Resend confirmation email
const resendConfirmationEmail = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const delivery = await Delivery.findById(id);
        
        if (!delivery) {
            return res.status(404).json({message: "Delivery not found"});
        }
        
        const emailSent = await sendDeliveryConfirmation(delivery);
        
        if (emailSent) {
            return res.status(200).json({
                message: "Confirmation email resent successfully",
                emailSent: true
            });
        } else {
            return res.status(500).json({
                message: "Failed to resend confirmation email",
                emailSent: false
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server error while resending email"});
    }
};

export default { 
    getAllDelivery, 
    addDeliverys, 
    getById, 
    updateDelivery, 
    deleteDelivery,
    resendConfirmationEmail
};