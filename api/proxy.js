import http from 'http';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // URL da API original (HTTP)
  const targetHost = 'k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com';
  const targetPath = req.url.replace('/api/proxy', '');
  
  console.log(`Proxying request to: ${targetHost}${targetPath}`);
  
  const options = {
    hostname: targetHost,
    port: 80,
    path: targetPath,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Vercel-Proxy'
    }
  };

  // Se há body na requisição, vamos lê-lo
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const proxyReq = http.request(options, (proxyRes) => {
      let responseBody = '';
      
      proxyRes.on('data', chunk => {
        responseBody += chunk;
      });
      
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(responseBody);
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    });

    if (body) {
      proxyReq.write(body);
    }
    
    proxyReq.end();
  });
} 