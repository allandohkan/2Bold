import http from 'http';
import https from 'https';

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
  
  const options = {
    hostname: targetHost,
    port: 80,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetHost
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  });

  if (req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
} 