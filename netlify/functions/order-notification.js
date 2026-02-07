const https = require('https');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const order = JSON.parse(event.body);

    if (!order.items || !order.total || !order.customerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required order information' })
      };
    }

    // Format order items as readable text
    const itemsList = order.items.map(item =>
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join(' | ');

    // Submit to Netlify Forms via POST
    const formData = new URLSearchParams({
      'form-name': 'order-notification',
      'transaction-id': order.transactionId || 'N/A',
      'customer-email': order.customerEmail,
      'customer-name': order.customerName || 'Not provided',
      'order-items': itemsList,
      'subtotal': order.subtotal || order.total,
      'shipping': order.shipping || '0.00',
      'total': order.total,
      'mailing-list': order.mailingListOptIn ? 'Yes' : 'No',
      'order-date': new Date().toLocaleString()
    }).toString();

    // Post to the site itself so Netlify picks it up as a form submission
    const siteUrl = process.env.URL || 'https://jmbhandcraftedcards.netlify.app';

    await new Promise((resolve, reject) => {
      const req = https.request(siteUrl + '/order-form.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(formData)
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', resolve);
      });
      req.on('error', reject);
      req.write(formData);
      req.end();
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
