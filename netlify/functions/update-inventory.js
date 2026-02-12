const https = require('https');

function githubRequest(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'JMB-Handcrafted-Cards'
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

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    console.error('GITHUB_TOKEN or GITHUB_REPO not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const { items } = JSON.parse(event.body);
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Items array is required' }) };
    }

    // Fetch current products.json from GitHub
    const filePath = '/repos/' + repo + '/contents/data/products.json';
    const fileRes = await githubRequest(filePath, 'GET', null, token);

    if (fileRes.status !== 200) {
      console.error('Failed to fetch products.json:', fileRes.status);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch products' }) };
    }

    const sha = fileRes.data.sha;
    const content = Buffer.from(fileRes.data.content, 'base64').toString('utf8');
    const productsData = JSON.parse(content);

    // Decrement inventory for purchased items
    items.forEach(purchasedItem => {
      const product = productsData.products.find(
        p => p.name === purchasedItem.name || p.image === purchasedItem.image
      );
      if (product && product.inventory != null) {
        product.inventory = Math.max(0, product.inventory - (purchasedItem.quantity || 1));
      }
    });

    // Commit updated products.json back to GitHub
    const updatedContent = Buffer.from(JSON.stringify(productsData, null, 2) + '\n').toString('base64');
    const updateRes = await githubRequest(filePath, 'PUT', {
      message: 'Update inventory after purchase',
      content: updatedContent,
      sha: sha
    }, token);

    if (updateRes.status === 200 || updateRes.status === 201) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      console.error('Failed to update products.json:', updateRes.status, JSON.stringify(updateRes.data));
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update inventory' }) };
    }

  } catch (error) {
    console.error('Inventory update error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update inventory' }) };
  }
};
