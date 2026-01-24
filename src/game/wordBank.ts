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
    words: ['Lion', 'Dauphin', 'Éléphant', 'Ours', 'Chien', 'Chat', 'Singe', 'Loup'],
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
    words: ['Réservation', 'Exploration', 'Marche', 'Visite', 'Selfie', 'Baignade', 'Dégustation', 'Excursion'],
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
    words: ['Wi‑Fi', 'Navigateur', 'Réseau', 'Cloud', 'Email', 'Streaming', 'Cookie', 'Lien'],
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
    words: ['Château', 'Citadelle', 'Forteresse', 'Cathédrale', 'Basilique', 'Amphithéâtre', 'Palais', 'Abbaye'],
  },
  {
    id: 'cat_history_figures',
    label: 'Personnages',
    words: ['Roi', 'Reine', 'Empereur', 'Explorateur', 'Philosophe', 'Général', 'Artisan', 'Chroniqueur'],
  },
  {
    id: 'cat_history_inventions',
    label: 'Inventions',
    words: ['Imprimerie', 'Poudre', 'Horloge', 'Vapeur', 'Télégraphe', 'Photographie', 'Aviation', 'Radio'],
  },
  {
    id: 'cat_history_events',
    label: 'Événements',
    words: ['Traité', 'Guerre', 'Siège', 'Alliance', 'Couronnement', 'Réforme', 'Exposition', 'Découverte'],
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
  {
    id: 'cat_food_meat',
    label: 'Viandes',
    words: ['Poulet', 'Bœuf', 'Porc', 'Agneau', 'Veau', 'Dinde', 'Oie', 'Gibier'],
  },
  {
    id: 'cat_food_desserts',
    label: 'Desserts',
    words: ['Gâteau', 'Tarte', 'Mousse', 'Glace', 'Sorbet', 'Flan', 'Tiramisu', 'Éclair'],
  },
  {
    id: 'cat_food_drinks',
    label: 'Boissons',
    words: ['Café', 'Thé', 'Jus', 'Soda', 'Sirop', 'Tisane', 'Smoothie', 'Chocolat'],
  },
  {
    id: 'cat_food_grains',
    label: 'Céréales',
    words: ['Blé', 'Riz', 'Maïs', 'Avoine', 'Orge', 'Seigle', 'Quinoa', 'Épeautre'],
  },
  {
    id: 'cat_animals_reptiles',
    label: 'Reptiles',
    words: ['Serpent', 'Lézard', 'Tortue', 'Crocodile', 'Caméléon', 'Iguane', 'Gecko', 'Varan'],
  },
  {
    id: 'cat_animals_farm',
    label: 'Animaux de la ferme',
    words: ['Vache', 'Cochon', 'Poule', 'Mouton', 'Chèvre', 'Cheval', 'Âne', 'Lapin'],
  },
  {
    id: 'cat_geography_countries',
    label: 'Pays',
    words: ['France', 'Espagne', 'Italie', 'Allemagne', 'Belgique', 'Suisse', 'Portugal', 'Grèce'],
  },
  {
    id: 'cat_geography_cities',
    label: 'Villes',
    words: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg'],
  },
  {
    id: 'cat_geography_continents',
    label: 'Continents',
    words: ['Europe', 'Asie', 'Afrique', 'Amérique', 'Océanie', 'Antarctique', 'Arctique', 'Pacifique'],
  },
  {
    id: 'cat_home_furniture',
    label: 'Meubles',
    words: ['Table', 'Chaise', 'Canapé', 'Lit', 'Armoire', 'Étagère', 'Bureau', 'Commode'],
  },
  {
    id: 'cat_home_appliances',
    label: 'Électroménager',
    words: ['Frigo', 'Four', 'Lave-linge', 'Aspirateur', 'Micro-ondes', 'Grille-pain', 'Cafetière', 'Mixer'],
  },
  {
    id: 'cat_home_kitchen',
    label: 'Ustensiles',
    words: ['Couteau', 'Fourchette', 'Cuillère', 'Casserole', 'Poêle', 'Passoire', 'Fouet', 'Louche'],
  },
  {
    id: 'cat_home_rooms',
    label: 'Pièces',
    words: ['Salon', 'Cuisine', 'Chambre', 'Salle', 'Vestibule', 'Cave', 'Grenier', 'Garage'],
  },
  {
    id: 'cat_body_parts',
    label: 'Corps',
    words: ['Tête', 'Bras', 'Jambe', 'Main', 'Pied', 'Dos', 'Ventre', 'Épaule'],
  },
  {
    id: 'cat_colors',
    label: 'Couleurs',
    words: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Brun', 'Violet', 'Beige', 'Noir'],
  },
  {
    id: 'cat_time_seasons',
    label: 'Saisons',
    words: ['Printemps', 'Été', 'Automne', 'Hiver', 'Équinoxe', 'Solstice', 'Floraison', 'Vendange'],
  },
  {
    id: 'cat_time_months',
    label: 'Mois',
    words: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
  },
  {
    id: 'cat_school_subjects',
    label: 'Matières',
    words: ['Français', 'Mathématiques', 'Histoire', 'Géographie', 'Sciences', 'Anglais', 'Sport', 'Musique'],
  },
  {
    id: 'cat_school_supplies',
    label: 'Fournitures',
    words: ['Cahier', 'Stylo', 'Crayon', 'Gomme', 'Règle', 'Trousse', 'Cartable', 'Classeur'],
  },
  {
    id: 'cat_clothing_clothes',
    label: 'Vêtements',
    words: ['Pantalon', 'Chemise', 'Robe', 'Jupe', 'Pull', 'Veste', 'Manteau', 'Short'],
  },
  {
    id: 'cat_clothing_shoes',
    label: 'Chaussures',
    words: ['Basket', 'Bottine', 'Sandale', 'Botte', 'Escarpin', 'Mocassin', 'Chausson', 'Tong'],
  },
  {
    id: 'cat_clothing_accessories',
    label: 'Accessoires',
    words: ['Chapeau', 'Écharpe', 'Ceinture', 'Gant', 'Cravate', 'Foulard', 'Bonnet', 'Casquette'],
  },
  {
    id: 'cat_entertainment_games',
    label: 'Jeux',
    words: ['Échecs', 'Cartes', 'Dames', 'Puzzle', 'Dominos', 'Scrabble', 'Monopoly', 'Bataille'],
  },
  {
    id: 'cat_entertainment_hobbies',
    label: 'Loisirs',
    words: ['Lecture', 'Dessin', 'Jardinage', 'Pâtisserie', 'Photo', 'Bricolage', 'Collection', 'Danse'],
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
  {
    id: 'img_desserts',
    label: 'Desserts',
    images: ['🍰', '🎂', '🧁', '🥧', '🍮', '🍩', '🍪', '🍫'],
  },
  {
    id: 'img_drinks',
    label: 'Boissons',
    images: ['☕', '🍵', '🥤', '🧃', '🧋', '🍹', '🍺', '🍷'],
  },
  {
    id: 'img_insects',
    label: 'Insectes',
    images: ['🐝', '🐛', '🐞', '🦋', '🦗', '🪲', '🪳', '🕷️'],
  },
  {
    id: 'img_farm',
    label: 'Ferme',
    images: ['🐄', '🐖', '🐓', '🐑', '🐐', '🐴', '🦆', '🐇'],
  },
  {
    id: 'img_sea_creatures',
    label: 'Créatures marines',
    images: ['🐳', '🐋', '🦭', '🐢', '🦈', '🐙', '🦑', '🦞'],
  },
  {
    id: 'img_school',
    label: 'École',
    images: ['📚', '✏️', '📝', '📖', '🎒', '📐', '✂️', '🖍️'],
  },
  {
    id: 'img_body',
    label: 'Corps',
    images: ['👁️', '👂', '👃', '👄', '🦷', '🦴', '🧠', '❤️'],
  },
  {
    id: 'img_electronics',
    label: 'Électronique',
    images: ['📱', '💻', '⌚', '📷', '🎮', '🖨️', '⌨️', '🖱️'],
  },
  {
    id: 'img_flags',
    label: 'Drapeaux',
    images: ['🇫🇷', '🇪🇸', '🇮🇹', '🇩🇪', '🇬🇧', '🇺🇸', '🇯🇵', '🇨🇳'],
  },
  {
    id: 'img_time',
    label: 'Temps',
    images: ['⏰', '⌚', '⏳', '⏱️', '🕐', '🕑', '🕒', '🕰️'],
  },
  {
    id: 'img_emotions',
    label: 'Émotions',
    images: ['😀', '😢', '😡', '😱', '😴', '🤔', '😍', '😎'],
  },
  {
    id: 'img_activities',
    label: 'Activités',
    images: ['🎨', '🎭', '🎪', '🎬', '🎯', '🎲', '🧩', '🎳'],
  },
  {
    id: 'img_heart',
    label: 'Cœur',
    images: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🧡'],
  },
  {
    id: 'img_shapes',
    label: 'Formes',
    images: ['⭐', '🔴', '🔵', '🟢', '🟡', '🟣', '⬛', '⬜'],
  },
]
