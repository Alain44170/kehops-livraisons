const admin = require('firebase-admin');
const serviceAccount = require('./kheops-livraisons-firebase-adminsdk-fbsvc-491d32d57d.json');

if (!admin.apps.length) {
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
      const validStatuses = ['pending', 'accepted', 'enroute', 'delivered', 'cancelled'];
      if (!orderId || !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'orderId ou status invalide' });
      }
      await db.ref(`orders/${orderId}`).update({ status, updatedAt: Date.now() });
      const labels = {
        accepted: '✅ Votre commande a été prise en charge par Khéops !',
        enroute:  '🛵 Votre commande est en route !',
        delivered:'🎉 Votre commande a été livrée. Bonne dégustation !',
        cancelled:'❌ Commande annulée. Contactez le 06 02 01 90 88.',
      };
      return res.status(200).json({ success: true, orderId, status, message: labels[status] || 'Statut mis à jour' });
    }

    if (req.method === 'GET') {
      const { status, orderId } = req.query;
      if (orderId) {
        const snap = await db.ref(`orders/${orderId}`).once('value');
        if (!snap.exists()) return res.status(404).json({ error: 'Commande introuvable' });
        return res.status(200).json(snap.val());
      }
      const snap = await db.ref('orders').orderByChild('createdAt').once('value');
      const orders = [];
      snap.forEach(child => {
        const order = child.val();
        if (!status || order.status === status) orders.push(order);
      });
      orders.reverse();
      return res.status(200).json(orders);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};