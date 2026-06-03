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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const snapshot = await db.ref('orders').once('value');
    const orders = snapshot.val() ? Object.values(snapshot.val()) : [];
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { clientName, clientPhone, clientAddress, restaurant, items, total, deliveryFee } = req.body;
    const orderId = 'CMD-' + Date.now();
    const orderData = {
      id: orderId, clientName, clientPhone, clientAddress,
      restaurant: restaurant || 'Non specifie',
      items: items || [], total: total || 0,
      deliveryFee: deliveryFee || 4.50,
      status: 'pending', createdAt: Date.now(), updatedAt: Date.now(),
    };
    await db.ref(`orders/${orderId}`).set(orderData);
    return res.status(201).json({ success: true, orderId, order: orderData });
  }

  if (req.method === 'PATCH') {
    const { orderId, status } = req.body;
    const validStatuses = ['pending', 'accepted', 'enroute', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    await db.ref(`orders/${orderId}`).update({ status, updatedAt: Date.now() });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Methode non autorisee' });
};
