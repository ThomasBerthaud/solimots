// English comments per project rule.
import type { ImageBankCategory, WordBankCategory } from './types'

export const WORD_BANK: WordBankCategory[] = [
  {
    id: 'cat_fruits',
    label: 'Fruits',
    words: ['Pomme', 'Banane', 'Fraise', 'Orange', 'Poire', 'Mangue', 'Raisin', 'Citron'],
  },
  {
    id: 'cat_vegetables',
    label: 'Légumes',
    words: ['Carotte', 'Tomate', 'Poivron', 'Courgette', 'Aubergine', 'Brocoli', 'Concombre', 'Épinard'],
  },
  {
    id: 'cat_dairy',
    label: 'Produits laitiers',
    words: ['Lait', 'Beurre', 'Fromage', 'Yaourt', 'Crème', 'Kéfir', 'Mozzarella', 'Comté'],
  },
  {
    id: 'cat_spices',
    label: 'Épices',
    words: ['Poivre', 'Cumin', 'Paprika', 'Curcuma', 'Cannelle', 'Gingembre', 'Safran', 'Muscade'],
  },
  {
    id: 'cat_mammals',
    label: 'Mammifères',
    words: ['Lion', 'Dauphin', 'Cheval', 'Ours', 'Chien', 'Chat', 'Singe', 'Loup'],
  },
  {
    id: 'cat_birds',
    label: 'Oiseaux',
    words: ['Aigle', 'Pigeon', 'Moineau', 'Hibou', 'Canard', 'Cygne', 'Corbeau', 'Perroquet'],
  },
  {
    id: 'cat_fish',
    label: 'Poissons',
    words: ['Saumon', 'Thon', 'Truite', 'Sardine', 'Bar', 'Carpe', 'Maquereau', 'Requin'],
  },
  {
    id: 'cat_insects',
    label: 'Insectes',
    words: ['Abeille', 'Fourmi', 'Coccinelle', 'Papillon', 'Moustique', 'Libellule', 'Sauterelle', 'Scarabée'],
  },
  {
    id: 'cat_transport',
    label: 'Transports',
    words: ['Avion', 'Train', 'Métro', 'Vélo', 'Voiture', 'Bateau', 'Bus', 'Tram'],
  },
  {
    id: 'cat_places',
    label: 'Lieux de voyage',
    words: ['Hôtel', 'Aéroport', 'Gare', 'Musée', 'Plage', 'Montagne', 'Port', 'Temple'],
  },
  {
    id: 'cat_items',
    label: 'Objets de voyage',
    words: ['Valise', 'Passeport', 'Carte', 'Billet', 'Appareil', 'Guide', 'Chargeur', 'Boussole'],
  },
  {
    id: 'cat_actions',
    label: 'Activités',
    words: ['Réservation', 'Exploration', 'Marche', 'Visite', 'Photo', 'Baignade', 'Dégustation', 'Randonnée'],
  },
  {
    id: 'cat_sports_ball',
    label: 'Sports de ballon',
    words: ['Football', 'Basketball', 'Handball', 'Volleyball', 'Rugby', 'Baseball', 'Futsal', 'Water-polo'],
  },
  {
    id: 'cat_sports_racket',
    label: 'Sports de raquette',
    words: ['Tennis', 'Badminton', 'Squash', 'Padel', 'Ping-pong', 'Racquetball', 'Pelote', 'Frontenis'],
  },
  {
    id: 'cat_sports_martial',
    label: 'Sports de combat',
    words: ['Judo', 'Karaté', 'Boxe', 'Taekwondo', 'Aïkido', 'Lutte', 'Escrime', 'Krav-maga'],
  },
  {
    id: 'cat_sports_outdoor',
    label: 'Sports de plein air',
    words: ['Course', 'Trail', 'Randonnée', 'Escalade', 'VTT', 'Ski', 'Surf', 'Voile'],
  },
  {
    id: 'cat_sports_water',
    label: 'Sports aquatiques',
    words: ['Natation', 'Plongée', 'Canoë', 'Kayak', 'Aviron', 'Kitesurf', 'Paddle', 'Snorkeling'],
  },
  {
    id: 'cat_nature_trees',
    label: 'Arbres',
    words: ['Chêne', 'Hêtre', 'Pin', 'Sapin', 'Bouleau', 'Érable', 'Olivier', 'Tilleul'],
  },
  {
    id: 'cat_nature_flowers',
    label: 'Fleurs',
    words: ['Rose', 'Tulipe', 'Marguerite', 'Coquelicot', 'Lys', 'Orchidée', 'Lavande', 'Tournesol'],
  },
  {
    id: 'cat_nature_landscapes',
    label: 'Paysages',
    words: ['Forêt', 'Désert', 'Lac', 'Rivière', 'Cascade', 'Vallée', 'Falaise', 'Glacier'],
  },
  {
    id: 'cat_nature_weather',
    label: 'Météo',
    words: ['Pluie', 'Vent', 'Brouillard', 'Orage', 'Neige', 'Canicule', 'Gel', 'Arc-en-ciel'],
  },
  {
    id: 'cat_nature_animals_wild',
    label: 'Animaux sauvages',
    words: ['Renard', 'Cerf', 'Sanglier', 'Lynx', 'Hérisson', 'Blaireau', 'Chamois', 'Loutre'],
  },
  {
    id: 'cat_tech_devices',
    label: 'Appareils',
    words: ['Smartphone', 'Tablette', 'Ordinateur', 'Casque', 'Montre', 'Console', 'Imprimante', 'Routeur'],
  },
  {
    id: 'cat_tech_internet',
    label: 'Internet',
    words: ['Wi‑Fi', 'Navigateur', 'Serveur', 'Cloud', 'Email', 'Streaming', 'Cookie', 'Lien'],
  },
  {
    id: 'cat_tech_security',
    label: 'Sécurité',
    words: [
      'Identifiant',
      'Chiffrement',
      'Protection',
      'Antivirus',
      'Phishing',
      'Sauvegarde',
      'Certificat',
      'VPN',
    ],
  },
  {
    id: 'cat_tech_programming',
    label: 'Programmation',
    words: ['Code', 'Bug', 'Algorithme', 'Variable', 'Fonction', 'Compilation', 'Dépôt', 'Débogage'],
  },
  {
    id: 'cat_tech_data',
    label: 'Données',
    words: ['Tableau', 'Requête', 'Index', 'Archive', 'JSON', 'API', 'Cache', 'Pipeline'],
  },
  {
    id: 'cat_art_music',
    label: 'Musique',
    words: ['Mélodie', 'Rythme', 'Chanson', 'Symphonie', 'Concert', 'Chœur', 'Tempo', 'Accord'],
  },
  {
    id: 'cat_art_instruments',
    label: 'Instruments',
    words: ['Piano', 'Guitare', 'Violon', 'Batterie', 'Flûte', 'Saxophone', 'Trompette', 'Harpe'],
  },
  {
    id: 'cat_art_painting',
    label: 'Peinture',
    words: ['Toile', 'Pinceau', 'Palette', 'Aquarelle', 'Huile', 'Croquis', 'Couleur', 'Vernis'],
  },
  {
    id: 'cat_art_cinema',
    label: 'Cinéma',
    words: ['Film', 'Scénario', 'Acteur', 'Réalisateur', 'Caméra', 'Montage', 'Cinéaste', 'Festival'],
  },
  {
    id: 'cat_art_literature',
    label: 'Littérature',
    words: ['Roman', 'Poème', 'Conte', 'Auteur', 'Chapitre', 'Personnage', 'Intrigue', 'Bibliothèque'],
  },
  {
    id: 'cat_history_eras',
    label: 'Époques',
    words: [
      'Antiquité',
      'Médiéval',
      'Renaissance',
      'Lumières',
      'Révolution',
      'Empire',
      'Modernité',
      'Contemporain',
    ],
  },
  {
    id: 'cat_history_places',
    label: 'Monuments',
    words: ['Château', 'Citadelle', 'Forteresse', 'Cathédrale', 'Temple', 'Amphithéâtre', 'Palais', 'Abbaye'],
  },
  {
    id: 'cat_history_figures',
    label: 'Personnages',
    words: ['Roi', 'Reine', 'Empereur', 'Explorateur', 'Philosophe', 'Général', 'Artisan', 'Chroniqueur'],
  },
  {
    id: 'cat_history_inventions',
    label: 'Inventions',
    words: ['Imprimerie', 'Boussole', 'Horloge', 'Vapeur', 'Télégraphe', 'Photographie', 'Aviation', 'Radio'],
  },
  {
    id: 'cat_history_events',
    label: 'Événements',
    words: ['Traité', 'Bataille', 'Siège', 'Alliance', 'Couronnement', 'Réforme', 'Exposition', 'Découverte'],
  },
  {
    id: 'cat_science_space',
    label: 'Espace',
    words: ['Planète', 'Étoile', 'Galaxie', 'Comète', 'Astéroïde', 'Orbite', 'Satellite', 'Télescope'],
  },
  {
    id: 'cat_science_biology',
    label: 'Biologie',
    words: ['Cellule', 'ADN', 'Enzyme', 'Bactérie', 'Virus', 'Organe', 'Tissu', 'Évolution'],
  },
  {
    id: 'cat_science_chemistry',
    label: 'Chimie',
    words: ['Atome', 'Molécule', 'Réaction', 'Acide', 'Base', 'Solution', 'Catalyseur', 'Électrode'],
  },
  {
    id: 'cat_science_physics',
    label: 'Physique',
    words: ['Force', 'Énergie', 'Masse', 'Vitesse', 'Gravité', 'Inertie', 'Lumière', 'Magnétisme'],
  },
  {
    id: 'cat_science_math',
    label: 'Mathématiques',
    words: ['Somme', 'Fraction', 'Équation', 'Géométrie', 'Théorème', 'Vecteur', 'Probabilité', 'Statistique'],
  },
  {
    id: 'cat_emotions_positive',
    label: 'Émotions positives',
    words: ['Joie', 'Fierté', 'Sérénité', 'Soulagement', 'Enthousiasme', 'Gratitude', 'Confiance', 'Émerveillement'],
  },
  {
    id: 'cat_emotions_negative',
    label: 'Émotions difficiles',
    words: ['Colère', 'Tristesse', 'Peur', 'Honte', 'Frustration', 'Jalousie', 'Anxiété', 'Déception'],
  },
  {
    id: 'cat_emotions_body',
    label: 'Sensations',
    words: ['Faim', 'Soif', 'Fatigue', 'Douleur', 'Tension', 'Frisson', 'Vertige', 'Démangeaison'],
  },
  {
    id: 'cat_emotions_social',
    label: 'Relations',
    words: ['Amitié', 'Amour', 'Respect', 'Conflit', 'Complicité', 'Soutien', 'Rancune', 'Empathie'],
  },
  {
    id: 'cat_emotions_moods',
    label: 'Humeurs',
    words: ['Optimisme', 'Morosité', 'Irritabilité', 'Calme', 'Nervosité', 'Motivation', 'Apathie', 'Gaieté'],
  },
  {
    id: 'cat_jobs_health',
    label: 'Santé',
    words: [
      'Médecin',
      'Infirmier',
      'Pharmacien',
      'Dentiste',
      'Obstétricien',
      'Radiologue',
      'Vétérinaire',
      'Psychologue',
    ],
  },
  {
    id: 'cat_jobs_education',
    label: 'Éducation',
    words: [
      'Professeur',
      'Instituteur',
      'Formateur',
      'Éducateur',
      'Bibliothécaire',
      'Surveillant',
      'Tuteur',
      'Conférencier',
    ],
  },
  {
    id: 'cat_jobs_craft',
    label: 'Artisanat',
    words: ['Boulanger', 'Menuisier', 'Plombier', 'Électricien', 'Peintre', 'Coiffeur', 'Couturier', 'Forgeron'],
  },
  {
    id: 'cat_jobs_tech',
    label: 'Métiers tech',
    words: [
      'Développeur',
      'Designer',
      'Sysadmin',
      'Analyste',
      'Testeur',
      'Manager',
      'DevOps',
      'Support',
    ],
  },
  {
    id: 'cat_jobs_services',
    label: 'Services',
    words: [
      'Serveur',
      'Cuisinier',
      'Chauffeur',
      'Hôtelier',
      'Hôte',
      'Livreur',
      'Vigile',
      'Caissier',
    ],
  },
]

export const IMAGE_CATEGORIES: ImageBankCategory[] = [
  {
    id: 'img_fruits',
    label: 'Fruits',
    images: ['🍎', '🍌', '🍓', '🍊', '🍐', '🥭', '🍇', '🍋'],
  },
  {
    id: 'img_vegetables',
    label: 'Légumes',
    images: ['🥕', '🍅', '🫑', '🥒', '🍆', '🥦', '🌽', '🥬'],
  },
  {
    id: 'img_animals',
    label: 'Animaux',
    images: ['🦁', '🐬', '🐴', '🐻', '🐶', '🐱', '🐵', '🐺'],
  },
  {
    id: 'img_birds',
    label: 'Oiseaux',
    images: ['🦅', '🐦', '🕊️', '🦉', '🦆', '🦢', '🦜', '🐓'],
  },
  {
    id: 'img_weather',
    label: 'Météo',
    images: ['☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '🌈', '🌪️'],
  },
  {
    id: 'img_sports',
    label: 'Sports',
    images: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸'],
  },
  {
    id: 'img_transport',
    label: 'Transports',
    images: ['✈️', '🚂', '🚇', '🚲', '🚗', '🚢', '🚌', '🚕'],
  },
  {
    id: 'img_food',
    label: 'Nourriture',
    images: ['🍕', '🍔', '🌮', '🍜', '🍱', '🥗', '🍰', '🍦'],
  },
  {
    id: 'img_nature',
    label: 'Nature',
    images: ['🌲', '🌳', '🌴', '🌵', '🌺', '🌻', '🌹', '🌷'],
  },
  {
    id: 'img_space',
    label: 'Espace',
    images: ['🌍', '🌙', '⭐', '☄️', '🪐', '🚀', '🛸', '🌌'],
  },
  {
    id: 'img_music',
    label: 'Musique',
    images: ['🎸', '🎹', '🎺', '🎷', '🥁', '🎻', '🎤', '🎧'],
  },
  {
    id: 'img_tools',
    label: 'Outils',
    images: ['🔨', '🔧', '🪛', '⚒️', '🪚', '⛏️', '🔩', '⚙️'],
  },
  {
    id: 'img_home',
    label: 'Maison',
    images: ['🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏢', '🏰', '🏛️'],
  },
  {
    id: 'img_ocean',
    label: 'Océan',
    images: ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑', '🦀', '🦞'],
  },
  {
    id: 'img_clothing',
    label: 'Vêtements',
    images: ['👕', '👔', '👗', '👖', '👞', '👟', '👢', '🧥'],
  },
]
