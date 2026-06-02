// api/orders.js — Vercel Serverless Function
// Gestion des commandes Khéops Livraisons — Système dispatch temps réel

const admin = require('firebase-admin');

// Initialisation Firebase Admin (une seule fois)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

module.exports = async (req, res) => {
  // Répondre aux preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).end();
  }

  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  try {
    // ── POST /api/orders — Créer une nouvelle commande ──
    if (req.method === 'POST') {
      const { clientName, clientPhone, clientAddress, restaurant, items, total, deliveryFee } = req.body;

      if (!clientName || !clientPhone || !clientAddress) {
        return res.status(400).json({ error: 'Champs obligatoires manquants' });
      }

      const orderId = 'CMD-' + Date.now();
      const orderData = {
        id: orderId,
        clientName,
        clientPhone,
        clientAddress,
        restaurant: restaurant || 'Non spécifié',
        items: items || [],
        total: total || 0,
        deliveryFee: deliveryFee || 4.50,
        status: 'pending',       // pending → accepted → enroute → delivered
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.ref(`orders/${orderId}`).set(orderData);

      return res.status(201).json({ success: true, orderId, order: orderData });
    }

    // ── PATCH /api/orders — Mettre à jour le statut ──
    if (req.method === 'PATCH') {
      const { orderId, status, livreurNote } = req.body;

      const validStatuses = ['pending', 'accepted', 'enroute', 'delivered', 'cancelled'];
      if (!orderId || !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'orderId ou status invalide' });
      }

      const updates = {
        status,
        updatedAt: Date.now(),
      };
      if (livreurNote) updates.livreurNote = livreurNote;

      await db.ref(`orders/${orderId}`).update(updates);

      // Labels lisibles pour les notifications
      const statusLabels = {
        accepted:  '✅ Votre commande a été prise en charge par Khéops !',
        enroute:   '🛵 Votre commande est en route !',
        delivered: '🎉 Votre commande a été livrée. Bonne dégustation !',
        cancelled: '❌ Votre commande a été annulée. Contactez le 06 02 01 90 88.',
      };

      return res.status(200).json({
        success: true,
        orderId,
        status,
        message: statusLabels[status] || 'Statut mis à jour',
      });
    }

    // ── GET /api/orders — Récupérer les commandes (livreur) ──
    if (req.method === 'GET') {
      const { status, orderId } = req.query;

      // Commande spécifique
      if (orderId) {
        const snap = await db.ref(`orders/${orderId}`).once('value');
        if (!snap.exists()) return res.status(404).json({ error: 'Commande introuvable' });
        return res.status(200).json(snap.val());
      }

      // Toutes les commandes (optionnel: filtrer par status)
      const snap = await db.ref('orders').orderByChild('createdAt').once('value');
      const orders = [];
      snap.forEach(child => {
        const order = child.val();
        if (!status || order.status === status) {
          orders.push(order);
        }
      });

      // Plus récentes en premier
      orders.reverse();
      return res.status(200).json(orders);
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });

  } catch (err) {
    console.error('Erreur API orders:', err);
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
