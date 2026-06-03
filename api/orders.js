const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: "kheops-livraisons",
    private_key_id: "491d32d57df29d1b23b7a24432f7049904d717f1",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvNf05v0igleK9\nYM5YAQCbeKajOHOnexQ70hCWitNYuX1dIrFt7THtBNA39nF3VMe5RBs1dflxTud0\nzlJXol7lKify2L3QG9XyH9ULqUF/yXzU0W+u+odQF283NtwLMchSBK/AmOqAxYIv\nrEPe6s8XPIjp6jfOS4a+uC2HTqECzYpYyjW6e7QxqkDUTNMltKW6hC3qMKC9OWHq\nolDqGvSlG/oQI7LO3+6EQ+Fo4/D0pcMN+jigjSsJHs+o+w3AUCqfYHP9vpw/yOEQ\nt/7IJQzHyY8I0wdIgDnXijAF/uyx9Mff5ctDCBh0K+9EMUnL7L1CDs2v/sGLkmZH\nPcon8U9jAgMBAAECggEAE00Twa5IPmR0j18gLAKkQfw3Ayj/WJZO4s4fxK2zXYVF\ngaKGQDFOfCk5FMkhs78Tp12Qz8FYwrop9iyaVowM/xq3PuHQeyHt3hfSnM++5uhX\nx4vwzSpNCK4kMsVo1RTdV+erQsC1qIzZbA4ChgaA3LLu9DG4hxG73LumTE8Fnqy+\nDUJLut6XP8KUUOJXpFZMke1kGivpt6dqpQc9ODGrYA2aSQuwPEddz1Ov0kqc4Vs/\nbPfSEvY3mj4tZWXQr6QJxYzFpUwAkYq4+pji0tHDXaRsToDcY8RPVCRAuRnkimkV\nfmJugMf9GNdhjAh8ko6rHXaQwhFnHbF05qwpBBLxZQKBgQDhkBGAKU+O5Sq+5Owu\nlZTiR89EIXN4Mffy4NWjTNO7bie/GGr5YneJVnwNoP+CPUujnWTP8OM+ApbPBtKO\nZwVx1d5cwg34MpOxSf+Y5SDIsXjladJ7NCX6T0gp3a+uN53bZhTGWE0/QWJT4pOp\ndxgcgEw0sMIzi4jbUJBY67zNtQKBgQDG2oua6dPdcgU0eZxfmwesCWk5TMWaB6AH\ndoXEoUV3PkJsn5sI47CkDzbvNaRQyhsHw01M7dl1A6GigOPBlrexKQRPFFeo8YVy\n0aD/XbQaaGlPCtiotWKGSx9wJrEpFcWdMIGuuZnbj/5f6zKNcpceB9tyaY5jhCgo\npcG37uMXtwKBgF1wvh82fdO3UZ7k3IZrxtJ6Zv1VUi1PneSKiVXtxKSXfHWoWuBW\njyhgoGFQ+aftVoE/+Xw+0RRmJC09KUp+mP3QWB5a8UiJQy+ldPHUsWESS//Vd7E8\nKCNqZn2ZbWaheY5i2mZUPCPhJSeU7BC+2kksSOVm9/w8aIRZ+oIrnfolAoGBAKfb\n8CDy5Y93IoGrbp8d5RoKT7K45c0iRqpGGKFlaZhBDB1ZlaupWIEE/uBqrawtDyg8\natJXrUsjp5vfpWLTcXixIRwIFf9c8cN8xaULWm84WD0K8N1pUCQA4ibv4njGEiyg\nt7fgoMpBAP/DMMdKRdpp04r/I91JwASf96jmlPh9AoGAK1q3dC/LIhflvf47mMvx\n0DEj7udjW2MWXjOg59BJWgkI+sfFSlMtwNExcJ2/VXX/7WtLnNOhGOQrSKc69KLf\nxwt1oMchnEzfrXQUtwYXaWTGBDF58f4yxGJtLncy3SzwNFyzmQmJ5nycu0A80uPI\nNKoeXhSxi7AQaZfjxzX+rKk=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@kheops-livraisons.iam.gserviceaccount.com",
    client_id: "101437418029990729093",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    universe_domain: "googleapis.com"
  };

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
};const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: "kheops-livraisons",
    private_key_id: "491d32d57df29d1b23b7a24432f7049904d717f1",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvNf05v0igleK9\nYM5YAQCbeKajOHOnexQ70hCWitNYuX1dIrFt7THtBNA39nF3VMe5RBs1dflxTud0\nzlJXol7lKify2L3QG9XyH9ULqUF/yXzU0W+u+odQF283NtwLMchSBK/AmOqAxYIv\nrEPe6s8XPIjp6jfOS4a+uC2HTqECzYpYyjW6e7QxqkDUTNMltKW6hC3qMKC9OWHq\nolDqGvSlG/oQI7LO3+6EQ+Fo4/D0pcMN+jigjSsJHs+o+w3AUCqfYHP9vpw/yOEQ\nt/7IJQzHyY8I0wdIgDnXijAF/uyx9Mff5ctDCBh0K+9EMUnL7L1CDs2v/sGLkmZH\nPcon8U9jAgMBAAECggEAE00Twa5IPmR0j18gLAKkQfw3Ayj/WJZO4s4fxK2zXYVF\ngaKGQDFOfCk5FMkhs78Tp12Qz8FYwrop9iyaVowM/xq3PuHQeyHt3hfSnM++5uhX\nx4vwzSpNCK4kMsVo1RTdV+erQsC1qIzZbA4ChgaA3LLu9DG4hxG73LumTE8Fnqy+\nDUJLut6XP8KUUOJXpFZMke1kGivpt6dqpQc9ODGrYA2aSQuwPEddz1Ov0kqc4Vs/\nbPfSEvY3mj4tZWXQr6QJxYzFpUwAkYq4+pji0tHDXaRsToDcY8RPVCRAuRnkimkV\nfmJugMf9GNdhjAh8ko6rHXaQwhFnHbF05qwpBBLxZQKBgQDhkBGAKU+O5Sq+5Owu\nlZTiR89EIXN4Mffy4NWjTNO7bie/GGr5YneJVnwNoP+CPUujnWTP8OM+ApbPBtKO\nZwVx1d5cwg34MpOxSf+Y5SDIsXjladJ7NCX6T0gp3a+uN53bZhTGWE0/QWJT4pOp\ndxgcgEw0sMIzi4jbUJBY67zNtQKBgQDG2oua6dPdcgU0eZxfmwesCWk5TMWaB6AH\ndoXEoUV3PkJsn5sI47CkDzbvNaRQyhsHw01M7dl1A6GigOPBlrexKQRPFFeo8YVy\n0aD/XbQaaGlPCtiotWKGSx9wJrEpFcWdMIGuuZnbj/5f6zKNcpceB9tyaY5jhCgo\npcG37uMXtwKBgF1wvh82fdO3UZ7k3IZrxtJ6Zv1VUi1PneSKiVXtxKSXfHWoWuBW\njyhgoGFQ+aftVoE/+Xw+0RRmJC09KUp+mP3QWB5a8UiJQy+ldPHUsWESS//Vd7E8\nKCNqZn2ZbWaheY5i2mZUPCPhJSeU7BC+2kksSOVm9/w8aIRZ+oIrnfolAoGBAKfb\n8CDy5Y93IoGrbp8d5RoKT7K45c0iRqpGGKFlaZhBDB1ZlaupWIEE/uBqrawtDyg8\natJXrUsjp5vfpWLTcXixIRwIFf9c8cN8xaULWm84WD0K8N1pUCQA4ibv4njGEiyg\nt7fgoMpBAP/DMMdKRdpp04r/I91JwASf96jmlPh9AoGAK1q3dC/LIhflvf47mMvx\n0DEj7udjW2MWXjOg59BJWgkI+sfFSlMtwNExcJ2/VXX/7WtLnNOhGOQrSKc69KLf\nxwt1oMchnEzfrXQUtwYXaWTGBDF58f4yxGJtLncy3SzwNFyzmQmJ5nycu0A80uPI\nNKoeXhSxi7AQaZfjxzX+rKk=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@kheops-livraisons.iam.gserviceaccount.com",
    client_id: "101437418029990729093",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    universe_domain: "googleapis.com"
  };

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