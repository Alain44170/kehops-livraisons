/* ============================================================
   data.js — Données centralisées Khéops Livraisons
   Pour ajouter un restaurant ou modifier un menu :
   → modifiez uniquement ce fichier
   ============================================================ */

const KHEOPS_CONFIG = {
  // Clé Stripe — remplacer par la vraie clé quand Kbis reçu
  // Mode TEST : pk_test_... (aucun vrai paiement)
  // Mode PROD : pk_live_... (vrais paiements)
  stripePublicKey: 'pk_live_51TeCxFLtSJXN2AaiLfJ760aDJF39YT5BXS1oyeDnQ8ZrReKlSPJP0rhoSPoxXG3Hr00PgI8gKwdf1uZNhGezG7HU00AmJfdx4A',

  // Frais de livraison
  deliveryFee: 5.90,         // Tarif normal
  deliveryFeeFirstOrder: 4.50, // Tarif première commande

  // EmailJS — déjà configuré
  emailjs: {
    serviceId:  'service_sxo3uwm',
    templateId: 'template_6w6vi39',
    publicKey:  'NuHxu96_U_IxWB1TO',
  }
};

/* ============================================================
   RESTAURANTS
   ============================================================ */
const RESTAURANTS = [

  /* ── LA CASA BELLA ───────────────────────────── */
  {
    id: 'casa-bella',
    name: 'La Casa Bella',
    type: 'Restaurant · Pizzeria',
    address: 'Nozay (44)',
    phone: null,
    logo: 'logo_casa_bella.png',
    logoDark: true,
    hours: 'Midi 12h-14h (mer-sam) · Soir 19h-22h (jeu-dim) · Fermé lun-mar',
    color: '#1a0505',

    // ── HORAIRES DE COMMANDE ──
    // Commandes acceptées 1h avant ouverture, fermées 1h avant fermeture
    // Midi mer-sam : commandes de 11h00 à 13h00
    // Soir jeu-dim : commandes de 18h00 à 21h00
   orderSlots: [],
    orderClosedMessage: 'Les commandes pour La Casa Bella sont acceptées de 11h00 à 13h00 (midi, mercredi au samedi) et de 18h00 à 21h00 (soir, jeudi au dimanche). Le restaurant est fermé le lundi et le mardi.',
    categories: [
      {
        id: 'pizzettas',
        name: 'Pizzettas (22 cm)',
        icon: 'fa-pizza-slice',
        items: [
          {id:'cb-pz1',  name:'Spirou (enfant)',   desc:'Sauce tomate, jambon, mozzarella',                                                           price:7.20},
          {id:'cb-pz2',  name:'Parisienne',         desc:'Tomate, jambon, mozzarella',                                                                price:7.90},
          {id:'cb-pz3',  name:'Tarentella',         desc:'Tomate, mozzarella, jambon, champignons, œuf',                                              price:9.60},
          {id:'cb-pz4',  name:'Capricia',           desc:'Tomate, mozzarella, lardons, champignons, oignons, chèvre',                                 price:9.60},
          {id:'cb-pz5',  name:'Bretonne',           desc:'Tomate, mozzarella, saucisses au Muscadet',                                                 price:9.60},
          {id:'cb-pz6',  name:'Calzone',            desc:'Tomate, mozzarella, jambon blanc, champignons, œuf (chausson)',                             price:11.50},
          {id:'cb-pz7',  name:'Raclette',           desc:'Tomate, mozzarella, pommes de terre, lardons, oignons, raclette',                           price:11.50},
          {id:'cb-pz8',  name:'Pizza du Chef',      desc:'Tomate, mozzarella, andouillette, oignons, chèvre',                                         price:11.50},
          {id:'cb-pz9',  name:'Campagnarde',        desc:'Tomate, mozzarella, lardons, gésiers, chèvre, roquette, magret fumé',                       price:12.20},
          {id:'cb-pz10', name:'Corsica',            desc:'Tomate, mozzarella, champignons, œuf, coppa',                                               price:11.50},
          {id:'cb-pz11', name:'Américaine',         desc:'Tomate, mozzarella, viande hachée, oignons, œuf, crème fraîche',                            price:10.90},
          {id:'cb-pz12', name:'Vénitienne',         desc:'Tomate, mozzarella, champignons, chorizo, olives',                                          price:10.90},
          {id:'cb-pz13', name:'Tex-Mex',            desc:'Tomate, mozzarella, poulet épicé, poivrons, tomates fraîches',                              price:12.20},
          {id:'cb-pz14', name:'Savoyarde',          desc:'Tomate, mozzarella, lardons, oignons, pommes de terre, reblochon',                          price:12.20},
          {id:'cb-pz15', name:'Tournesol',          desc:'Tomate, mozzarella, champignons, oignons, poivrons, tomates, olives',                       price:11.90},
          {id:'cb-pz16', name:'4 Fromages',         desc:'Tomate, mozzarella, reblochon, chèvre, gorgonzola',                                         price:12.20},
          {id:'cb-pz17', name:'Saumon',             desc:'Tomate, mozzarella, champignons, saumon fumé, crème citronnée',                             price:12.20},
          {id:'cb-pz18', name:'Casa Bella',         desc:'Tomate, mozzarella, fondue de poireaux, champignons, Saint-Jacques, crème citron',           price:12.70},
          {id:'cb-pz19', name:'Hawaïenne',          desc:'Tomate, mozzarella, poulet épicé, ananas',                                                  price:11.10},
          {id:'cb-pz20', name:'Sachauf',            desc:'Tomate, mozzarella, chorizo, poivrons, merguez',                                            price:11.70},
          {id:'cb-pz21', name:'Royale Kébab',       desc:'Tomate, mozzarella, viande à kebab, poivrons, oignons, olives',                             price:12.20},
          {id:'cb-pz22', name:'Niçoise',            desc:'Tomate, mozzarella, thon, anchois, poivrons, olives',                                       price:11.90},
          {id:'cb-pz23', name:'Norvégienne',        desc:'Crème fraîche, mozzarella, champignons, saumon fumé',                                       price:12.20},
          {id:'cb-pz24', name:'Alsacienne',         desc:'Crème fraîche, mozzarella, lardons, champignons, oignons, olives, œuf',                     price:12.20},
          {id:'cb-pz25', name:'Fromagère',          desc:'Crème fraîche, mozzarella, reblochon, chèvre, roquefort',                                   price:12.20},
          {id:'cb-pz26', name:'Délire de Maya',     desc:'Crème fraîche, mozzarella, pommes golden, tomates, chèvre, miel',                           price:12.20},
          {id:'cb-pz27', name:'Indienne',           desc:'Crème au curry, mozzarella, poulet épicé, poivrons, merguez',                               price:11.60},
          {id:'cb-pz28', name:'Dijonnaise',         desc:'Crème moutarde, mozzarella, viande hachée, pommes de terre, oignons, reblochon',            price:11.90},
        ]
      },
      {
        id: 'pizzas',
        name: 'Pizzas (31 cm)',
        icon: 'fa-pizza-slice',
        items: [
          {id:'cb-p1',  name:'Spirou (enfant)',   desc:'Sauce tomate, jambon, mozzarella',                                                            price:9.90},
          {id:'cb-p2',  name:'Parisienne',         desc:'Tomate, jambon, mozzarella',                                                                 price:11.60},
          {id:'cb-p3',  name:'Tarentella',         desc:'Tomate, mozzarella, jambon, champignons, œuf',                                               price:13.50},
          {id:'cb-p4',  name:'Capricia',           desc:'Tomate, mozzarella, lardons, champignons, oignons, chèvre',                                  price:13.50},
          {id:'cb-p5',  name:'Bretonne',           desc:'Tomate, mozzarella, saucisses au Muscadet',                                                  price:13.50},
          {id:'cb-p6',  name:'Calzone',            desc:'Tomate, mozzarella, jambon blanc, champignons, œuf (chausson)',                              price:14.20},
          {id:'cb-p7',  name:'Raclette',           desc:'Tomate, mozzarella, pommes de terre, lardons, oignons, raclette',                            price:14.20},
          {id:'cb-p8',  name:'Pizza du Chef',      desc:'Tomate, mozzarella, andouillette, oignons, chèvre',                                          price:14.20},
          {id:'cb-p9',  name:'Campagnarde',        desc:'Tomate, mozzarella, lardons, gésiers, chèvre, roquette, magret fumé',                        price:15.50},
          {id:'cb-p10', name:'Corsica',            desc:'Tomate, mozzarella, champignons, œuf, coppa',                                                price:14.20},
          {id:'cb-p11', name:'Américaine',         desc:'Tomate, mozzarella, viande hachée, oignons, œuf, crème fraîche',                             price:12.90},
          {id:'cb-p12', name:'Vénitienne',         desc:'Tomate, mozzarella, champignons, chorizo, olives',                                           price:12.90},
          {id:'cb-p13', name:'Tex-Mex',            desc:'Tomate, mozzarella, poulet épicé, poivrons, tomates fraîches',                               price:14.20},
          {id:'cb-p14', name:'Savoyarde',          desc:'Tomate, mozzarella, lardons, oignons, pommes de terre, reblochon',                           price:14.20},
          {id:'cb-p15', name:'Tournesol',          desc:'Tomate, mozzarella, champignons, oignons, poivrons, tomates, olives',                        price:13.90},
          {id:'cb-p16', name:'4 Fromages',         desc:'Tomate, mozzarella, reblochon, chèvre, gorgonzola',                                          price:14.20},
          {id:'cb-p17', name:'Saumon',             desc:'Tomate, mozzarella, champignons, saumon fumé, crème citronnée',                              price:14.20},
          {id:'cb-p18', name:'Casa Bella',         desc:'Tomate, mozzarella, fondue de poireaux, champignons, Saint-Jacques, crème citron',            price:14.70},
          {id:'cb-p19', name:'Hawaïenne',          desc:'Tomate, mozzarella, poulet épicé, ananas',                                                   price:13.10},
          {id:'cb-p20', name:'Sachauf',            desc:'Tomate, mozzarella, chorizo, poivrons, merguez',                                             price:13.70},
          {id:'cb-p21', name:'Royale Kébab',       desc:'Tomate, mozzarella, viande à kebab, poivrons, oignons, olives',                              price:14.20},
          {id:'cb-p22', name:'Niçoise',            desc:'Tomate, mozzarella, thon, anchois, poivrons, olives',                                        price:13.90},
          {id:'cb-p23', name:'Norvégienne',        desc:'Crème fraîche, mozzarella, champignons, saumon fumé',                                        price:14.20},
          {id:'cb-p24', name:'Alsacienne',         desc:'Crème fraîche, mozzarella, lardons, champignons, oignons, olives, œuf',                      price:14.20},
          {id:'cb-p25', name:'Fromagère',          desc:'Crème fraîche, mozzarella, reblochon, chèvre, roquefort',                                    price:14.20},
          {id:'cb-p26', name:'Délire de Maya',     desc:'Crème fraîche, mozzarella, pommes golden, tomates, chèvre, miel',                            price:14.20},
          {id:'cb-p27', name:'Indienne',           desc:'Crème au curry, mozzarella, poulet épicé, poivrons, merguez',                                price:13.60},
          {id:'cb-p28', name:'Dijonnaise',         desc:'Crème moutarde, mozzarella, viande hachée, pommes de terre, oignons, reblochon',             price:13.90},
        ]
      },
      {
        id: 'linguines',
        name: 'Linguines maison',
        icon: 'fa-utensils',
        items: [
          {id:'cb-l1', name:'Bolognaise',    desc:'Sauce tomate, viande hachée, mozzarella',  price:11.00},
          {id:'cb-l2', name:'Carbonara',     desc:'Crème, lardons fumés, jaune d\'œuf',        price:11.00},
          {id:'cb-l3', name:'Saumon Fumé',   desc:'Crème, saumon fumé',                        price:12.00},
          {id:'cb-l4', name:'Gorgonzola',    desc:'Crème, gorgonzola',                         price:12.00},
        ]
      },
      {
        id: 'salades',
        name: 'Salades',
        icon: 'fa-leaf',
        items: [
          {id:'cb-s1', name:'Salade verte et tomates',    desc:'',                                                                                              price:3.50},
          {id:'cb-s2', name:'Poulet mariné',              desc:'Salade verte, poulet mariné, ananas, tomates, oignons frits',                                   price:10.00},
          {id:'cb-s3', name:'Thon mariné',                desc:'Salade verte, thon mariné, poivrons, olives, oignons, tomates, sésame, crème citron',           price:10.00},
          {id:'cb-s4', name:'Italienne',                  desc:'Salade verte, jambon de pays, mozzarella billes, tomates confites, roquette, pesto',            price:11.00},
          {id:'cb-s5', name:'Terre et Mer',               desc:'Salade verte, saumon fumé et magrets de canard fumés maison',                                   price:11.00},
        ]
      },
      {
        id: 'hamburgers',
        name: 'Hamburgers (avec frites)',
        icon: 'fa-burger',
        items: [
          {id:'cb-h1', name:'Le Classique',      desc:'Pain, steak haché, bacon, fromage, salade, tomate, oignons, sauce pitta',                               price:13.50},
          {id:'cb-h2', name:'Squid-Ink Burger',  desc:'Pain à l\'encre de seiche, steak haché, chorizo, chèvre, salade, tomates, oignons, sauce pitta',        price:13.50},
          {id:'cb-h3', name:'Végétarien',        desc:'Pain, steak végétal, salade, tomate, oignons, cheddar, sauce pitta',                                    price:13.50},
        ]
      },
    ]
  },

  /* ── LES 3 MARCHANDS — RETIRÉ (préfère les commandes par téléphone : 02 40 79 28 47)
  // Pour réactiver : décommenter ce bloc
  /*
{
    id: 'les-3-marchands',
    name: 'Les 3 Marchands',
    type: 'Restaurant traditionnel',
    address: '1 route d\'Abbaretz, Nozay (44)',
    phone: '02 40 79 28 47',
    logo: 'logo3_marchants.png',
    logoDark: true,
    hours: 'Ouvert tous les midis 7j/7',
    color: '#0d0d0d',
    menuChangesWeekly: true,
    orderHours: {
      open:  { h: 9,  m: 0  },   // Ouverture commandes : 9h00
      close: { h: 10, m: 30 },   // Fermeture commandes : 10h30
      message: 'Les commandes pour Les 3 Marchands sont acceptées uniquement entre 9h00 et 10h30. Au-delà, le restaurant est en plein service et ne peut plus prendre de nouvelles commandes.'
    },
    facebookUrl: 'https://www.facebook.com/Les-Trois-Marchands-Restaurant-104628921250442',
    categories: [
      {
        id: 'entrees',
        name: 'Entrées',
        icon: 'fa-leaf',
        items: [
          {id:'tm-e1', name:'Salade du chef',          desc:'Selon arrivage du marché',           price:8.50},
          {id:'tm-e2', name:'Velouté du jour',         desc:'Soupe maison selon saison',           price:7.00},
          {id:'tm-e3', name:'Terrine maison',          desc:'Terrine artisanale du chef',          price:8.00},
        ]
      },
      {
        id: 'plats',
        name: 'Plats du jour',
        icon: 'fa-utensils',
        menuNote: '⚠️ Le menu change chaque semaine. Consultez leur Facebook pour le menu actuel.',
        items: [
          {id:'tm-p1', name:'Croustillant de bar',       desc:'Bar au parfum de curry — spécialité de la maison',        price:16.50},
          {id:'tm-p2', name:'Tajine d\'agneau',          desc:'Aux épices raz-el-hanout',                                 price:15.50},
          {id:'tm-p3', name:'Nems de cabillaud',         desc:'À la sauce thaï',                                          price:14.00},
          {id:'tm-p4', name:'Filet de bœuf',             desc:'Au whisky, sauce maison',                                  price:18.00},
          {id:'tm-p5', name:'Sandre beurre blanc',       desc:'Poisson de Loire, beurre blanc nantais',                   price:16.00},
          {id:'tm-p6', name:'Couscous maison',           desc:'Selon la tradition',                                        price:14.00},
        ]
      },
      {
        id: 'desserts',
        name: 'Desserts',
        icon: 'fa-cake-candles',
        items: [
          {id:'tm-d1', name:'Mi-cuit au chocolat noir',   desc:'Cœur fondant, glace vanille',   price:7.00},
          {id:'tm-d2', name:'Délice poire au caramel',    desc:'Spécialité maison',              price:7.00},
          {id:'tm-d3', name:'Dessert du chef',            desc:'Selon l\'inspiration du jour',  price:7.00},
        ]
      },
    ]
  },

*/

    /* ── ET PÂTES & VOUS ─────────────────────────── */
  {
    id: 'pates-et-vous',
    name: 'Et Pâtes & Vous',
    type: 'Pâtes fraîches maison',
    address: 'Nozay (44)',
    phone: null,
    logo: 'https://etpatesetvous.com/wp-content/uploads/2020/11/cropped-19657234_1964331553844365_3904454414963968489_n-270x270.jpg',
    logoDark: true,
    hours: 'Midi 11h45-14h · Soir lun & ven 18h45-21h30',
    color: '#1a1a0a',

    // ── HORAIRES DE COMMANDE ──
    // Commandes acceptées 1h avant ouverture, fermées 1h avant fermeture
    orderSlots: [], // TEMP — ouvert 24h/24 pour tests
    orderClosedMessage: 'Les commandes pour Et Pâtes & Vous sont acceptées de 10h45 à 13h00 (midi) et de 17h45 à 20h30 (soir). En dehors de ces créneaux, le restaurant ne peut plus prendre de nouvelles commandes.',

    categories: [
      {
        id: 'sauces-semaine',
        name: '🌟 Sauces de la semaine (26-30 mai)',
        icon: 'fa-star',
        menuNote: 'Sauces spéciales cette semaine — changent chaque lundi',
        items: [
          {id:'pv-s1', name:'La Carbo',        desc:'Lardons fumés, oignons, ail, parmesan, crème',                                    price:0},
          {id:'pv-s2', name:'La Thon coco',    desc:'Thon, crème de coco, piment doux, ail, citron vert, crème',                       price:0},
          {id:'pv-s3', name:'La Tomate farcie',desc:'Farce à saucisse, oignons, persil, ail, pulpe de tomates',                        price:0},
          {id:'pv-s4', name:'La Champi',       desc:'Champignons de Paris, carottes, oignons, ail, moutarde en grains, vin blanc, persil, crème', price:0},
        ]
      },
      {
        id: 'pates-carte',
        name: 'Pâtes fraîches — À la carte',
        icon: 'fa-utensils',
        items: [
          {id:'pv-c1', name:'Kid',     desc:'Pâtes fraîches, sauce au choix — pour les enfants',  price:5.50},
          {id:'pv-c2', name:'Classic', desc:'Pâtes fraîches, sauce au choix — taille standard',   price:6.50},
          {id:'pv-c3', name:'Big',     desc:'Pâtes fraîches, sauce au choix — grande portion',    price:8.00},
        ]
      },
      {
        id: 'pates-formule',
        name: 'Pâtes fraîches — Formule (+ boisson ou dessert)',
        icon: 'fa-star',
        items: [
          {id:'pv-f1', name:'Kid Formule',     desc:'Kid + boisson ou dessert',     price:7.80},
          {id:'pv-f2', name:'Classic Formule', desc:'Classic + boisson ou dessert', price:9.50},
          {id:'pv-f3', name:'Big Formule',     desc:'Big + boisson ou dessert',     price:11.50},
        ]
      },
      {
        id: 'desserts',
        name: 'Desserts de la semaine',
        icon: 'fa-cake-candles',
        items: [
          {id:'pv-d1', name:'Peanut square', desc:'Gâteau au beurre de cacahuète', price:0},
          {id:'pv-d2', name:'Cheese cake',   desc:'Cheese cake maison',            price:0},
        ]
      },
    ],
    saucesNote: '🧂 Sauces toujours disponibles : Basic (dés de jambon, crème, emmental). Précisez votre sauce choisie dans les instructions de commande.'
  },

  /* ── AUX DOUCEURS ÉTOILÉES ───────────────────── */
  {
    id: 'douceurs-etoilees',
    name: 'Aux Douceurs Étoilées',
    type: 'Pâtisserie artisanale',
    address: '50 route de Rennes, Nozay (44)',
    phone: null,
    logo: null,
    logoEmoji: '⭐',
    logoDark: false,
    hours: 'Mar-Sam 9h-18h',
    color: '#3d1f0a',

    orderSlots: [
      { open: { h:9, m:0 }, close: { h:17, m:0 }, days:[1,2,3,4,5,6], label: 'journée' },
    ],
    orderClosedMessage: 'La pâtisserie est ouverte du mardi au samedi de 9h à 18h. Les commandes sont acceptées pendant ces horaires.',

    categories: [
      {
        id: 'mignardises',
        name: '🍬 Mignardises',
        icon: 'fa-candy-cane',
        menuNote: 'Bouchées artisanales — à partir de 1,00 €',
        items: [
          {id:'de-m1',  name:'Les Madeleines Vanille',          desc:'Madeleine maison à la vanille',                    price:1.00},
          {id:'de-m2',  name:'Les Nougats',                     desc:'Nougats artisanaux',                               price:1.20},
          {id:'de-m3',  name:'Les Pâtes de Fruits',             desc:'Pâtes de fruits maison',                           price:1.20},
          {id:'de-m4',  name:'Les Tartelettes',                 desc:'Tartelettes — parfum au choix',                    price:1.50},
          {id:'de-m5',  name:'Les Muffins',                     desc:'Muffins moelleux — parfum au choix',               price:1.50},
          {id:'de-m6',  name:'Les Cakes au Citron',             desc:'Petits cakes au citron',                           price:1.50},
          {id:'de-m7',  name:'Les Minis Pavlovas',              desc:'Pavlovas aux fruits de saison',                    price:1.50},
          {id:'de-m8',  name:"L'Instant Fraise & Basilic",      desc:'Bouchée fraise, basilic',                          price:1.50},
          {id:'de-m9',  name:'Le Vanille Coulant Caramel',      desc:'Bouchée vanille, cœur caramel',                    price:1.50},
          {id:'de-m10', name:'La Pavlova aux Fruits de Saison', desc:'Pavlova individuelle',                             price:1.50},
          {id:'de-m11', name:'Le Velour Chocolaté Praliné',     desc:'Bouchée chocolat, praliné',                        price:1.50},
          {id:'de-m12', name:'La Fleur Citronnée Meringuée',    desc:'Bouchée citron, meringue',                         price:1.50},
        ]
      },
      {
        id: 'patisseries',
        name: '🎂 Pâtisseries Traditionnelles',
        icon: 'fa-cake-candles',
        menuNote: 'Prix de départ — plusieurs tailles disponibles, précisez votre choix dans les instructions',
        items: [
          {id:'de-p1', name:'Le Gâteau Nantais',            desc:'Spécialité nantaise — précisez la taille souhaitée',        price:3.00},
          {id:'de-p2', name:'Le Flan Pâtissier au Praliné', desc:'Flan maison au praliné — précisez la taille souhaitée',     price:3.00},
          {id:'de-p3', name:'La Tarte aux Fraises',         desc:'Tarte aux fraises fraîches — précisez la taille souhaitée', price:3.50},
          {id:'de-p4', name:'Le Millefeuille',              desc:'Millefeuille traditionnel — précisez la taille souhaitée',  price:3.50},
          {id:'de-p5', name:'La Tarte Citron Meringuée',    desc:'Tarte citron meringuée — précisez la taille souhaitée',     price:3.00},
          {id:'de-p6', name:'La Tropézienne',               desc:'Tarte tropézienne — précisez la taille souhaitée',          price:3.00},
        ]
      },
      {
        id: 'paniers',
        name: '🧺 Paniers Garnis',
        icon: 'fa-basket-shopping',
        menuNote: 'Idée cadeau gourmand',
        items: [
          {id:'de-pg1', name:'Le Gourmand', desc:'Panier garni — assortiment de pâtisseries et douceurs maison', price:30.00},
        ]
      },
    ],
    saucesNote: '⭐ Pour les pâtisseries avec variantes de taille, précisez votre choix dans les instructions de commande. Les prix affichés sont les prix de départ.'
  },

];
