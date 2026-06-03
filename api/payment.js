const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { amount, currency = 'eur', restaurantName } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,          // en centimes (ex: 1050 = 10,50€)
        currency,
        description: `Khéops Livraisons — ${restaurantName || 'commande'}`,
        metadata: { source: 'kheops-livraison.fr' },
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.error('Stripe error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
};
