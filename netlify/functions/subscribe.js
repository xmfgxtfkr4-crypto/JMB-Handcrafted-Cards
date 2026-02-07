const https = require('https');

function mailerliteRequest(path, method, body, apiToken) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'connect.mailerlite.com',
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    }, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseData) });
        } catch {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiToken = process.env.MAILERLITE_API_TOKEN;
  if (!apiToken) {
    console.error('MAILERLITE_API_TOKEN not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const { email } = JSON.parse(event.body);
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
    }

    // Find the JMB Cards group
    const groupsRes = await mailerliteRequest('/groups?filter[name]=JMB%20Cards', 'GET', null, apiToken);
    let groupId = null;
    if (groupsRes.data?.data?.length > 0) {
      groupId = groupsRes.data.data[0].id;
    }

    // Subscribe the email
    const subscriberBody = { email };
    if (groupId) {
      subscriberBody.groups = [groupId];
    }

    const subRes = await mailerliteRequest('/subscribers', 'POST', subscriberBody, apiToken);

    if (subRes.status === 200 || subRes.status === 201) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      console.error('Mailerlite error:', JSON.stringify(subRes.data));
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

  } catch (error) {
    console.error('Subscribe error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to subscribe' }) };
  }
};
