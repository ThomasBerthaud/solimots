import type { ThemeDef } from './types'

// English comments per project rule.
export const WORD_BANK: ThemeDef[] = [
  {
    id: 'theme_food',
    title: 'Cuisine',
    categories: [
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
    ],
  },
  {
    id: 'theme_animals',
    title: 'Animaux',
    categories: [
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
    ],
  },
  {
    id: 'theme_travel',
    title: 'Voyage',
    categories: [
      {
        id: 'cat_transport',
        label: 'Transports',
        words: ['Avion', 'Train', 'Métro', 'Vélo', 'Voiture', 'Bateau', 'Bus', 'Tram'],
      },
      {
        id: 'cat_places',
        label: 'Lieux',
        words: ['Hôtel', 'Aéroport', 'Gare', 'Musée', 'Plage', 'Montagne', 'Port', 'Temple'],
      },
      {
        id: 'cat_items',
        label: 'Objets',
        words: ['Valise', 'Passeport', 'Carte', 'Billet', 'Appareil photo', 'Guide', 'Chargeur', 'Boussole'],
      },
      {
        id: 'cat_actions',
        label: 'Actions',
        words: ['Réserver', 'Explorer', 'Marcher', 'Visiter', 'Photographier', 'Nager', 'Goûter', 'Randonner'],
      },
    ],
  },
]
