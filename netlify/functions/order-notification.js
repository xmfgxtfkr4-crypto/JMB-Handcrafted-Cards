const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const order = JSON.parse(event.body);

    // Validate required fields
    if (!order.items || !order.total || !order.customerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required order information' })
      };
    }

    // Create email transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Format order items for email
    const itemsList = order.items.map(item =>
      `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    // Create email content
    const emailContent = `
New Order Received!
==================

Order Date: ${new Date().toLocaleString()}
PayPal Transaction ID: ${order.transactionId || 'N/A'}

Customer Information
--------------------
Email: ${order.customerEmail}
Name: ${order.customerName || 'Not provided'}

Order Details
-------------
${itemsList}

--------------------
Total: $${order.total}

---
This is an automated notification from JMB Handcrafted Cards.
    `.trim();

    // HTML version for better formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #7c9885; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f5f5f5; }
    .order-item { padding: 10px 0; border-bottom: 1px solid #ddd; }
    .total { font-size: 1.2em; font-weight: bold; padding: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Received!</h1>
    </div>
    <div class="content">
      <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>PayPal Transaction ID:</strong> ${order.transactionId || 'N/A'}</p>

      <h2>Customer Information</h2>
      <p><strong>Email:</strong> ${order.customerEmail}</p>
      <p><strong>Name:</strong> ${order.customerName || 'Not provided'}</p>

      <h2>Order Details</h2>
      ${order.items.map(item => `
        <div class="order-item">
          <strong>${item.name}</strong><br>
          Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}
        </div>
      `).join('')}

      <div class="total">
        Total: $${order.total}
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from JMB Handcrafted Cards.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email
    await transporter.sendMail({
      from: `"JMB Cards Orders" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Order - $${order.total} from ${order.customerEmail}`,
      text: emailContent,
      html: htmlContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Order notification sent' })
    };

  } catch (error) {
    console.error('Error sending order notification:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};
