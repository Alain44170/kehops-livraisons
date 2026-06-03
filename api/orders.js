const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kheops-livraisons-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).end();
  }
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  try {
    if (req.method === 'POST') {
      const { clientName, clientPhone, clientAddress, restaurant, items, total, deliveryFee } = req.body;
      if (!clientName || !clientPhone || !clientAddress) {
        return res.status(400).json({ error: 'Champs obligatoires manquants' });
      }
      const orderId = 'CMD-' + Date.now();
      const orderData = {
        id: orderId, clientName, clientPhone, clientAddress,
        restaurant: restaurant || 'Non spécifié',
        items: items || [], total: total || 0,
        deliveryFee: deliveryFee || 4.50,
        status: 'pending', createdAt: Date.now(), updatedAt: Date.now(),
      };
      await db.ref(`orders/${orderId}`).set(orderData);
      return res.status(201).json({ success: true, orderId, order: orderData });
    }

    if (req.method === 'PATCH') {
      const { orderId, status } = req.body;
      const validStatuses = ['pending', 'accepted', 'enroute