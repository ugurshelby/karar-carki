import { Venue } from './types';

export const INITIAL_DATA: Venue[] = [
  // Tunalı
  { id: 'tunali-bosco', name: 'Bosco', district: 'Tunalı', category: 'tatlı', tags: ['Tatlı'] },
  { id: 'tunali-bilardo', name: 'Bilardo', district: 'Tunalı', category: 'kafe', tags: ['Kafe'] },
  { id: 'tunali-if', name: 'IF Sokak', district: 'Tunalı', category: 'bar', tags: ['Kafe', 'Bar'] },
  { id: 'tunali-mojo', name: 'Mojo', district: 'Tunalı', category: 'tatlı', tags: ['Tatlı', 'Kafe'] },
  // Kızılay
  { id: 'kizilay-kajun', name: 'Kajun', district: 'Kızılay', category: 'yemek', tags: ['Restoran', 'Tavuk'] },
  { id: 'kizilay-saracoglu', name: 'Saraçoğlu', district: 'Kızılay', category: 'kafe', tags: ['Kafe'] },
  { id: 'kizilay-mcdonalds', name: 'McDonalds', district: 'Kızılay', category: 'yemek', tags: ['Restoran'] },
  { id: 'kizilay-neofoods', name: 'NeoFoods', district: 'Kızılay', category: 'tatlı', tags: ['Tatlı'] },
  { id: 'kizilay-verte', name: 'Verte', district: 'Kızılay', category: 'kafe', tags: ['Kafe'] },
  { id: 'kizilay-kocatepe', name: 'Kocatepe', district: 'Kızılay', category: 'kafe', tags: ['Kafe'] },
  { id: 'kizilay-bilardo', name: 'Bilardo', district: 'Kızılay', category: 'kafe', tags: ['Kafe'] },
  { id: 'kizilay-mackbear', name: 'Mackbear', district: 'Kızılay', category: 'kafe', tags: ['Kafe'] },
  // Bahçeli
  { id: 'bahceli-bigos', name: 'Bigos', district: 'Bahçeli', category: 'yemek', tags: ['Restoran', 'Tavuk'] },
  { id: 'bahceli-mcdonalds', name: 'McDonalds', district: 'Bahçeli', category: 'yemek', tags: ['Restoran'] },
  { id: 'bahceli-italiancut', name: 'ItalianCut', district: 'Bahçeli', category: 'yemek', tags: ['Pizza'] },
  { id: 'bahceli-hippo', name: 'Hippo', district: 'Bahçeli', category: 'yemek', tags: ['Taco'] },
  { id: 'bahceli-boston', name: 'Boston', district: 'Bahçeli', category: 'tatlı', tags: ['Tatlı'] },
  { id: 'bahceli-uyanik', name: 'Uyanık Kütüphane', district: 'Bahçeli', category: 'kafe', tags: ['Ders', 'Kafe'] },
  // Beşevler
  { id: 'besevler-barley', name: 'Barley Mash', district: 'Beşevler', category: 'yemek', tags: ['Restoran'] },
  { id: 'besevler-coffy', name: 'Coffy', district: 'Beşevler', category: 'kafe', tags: ['Kafe'] },
  { id: 'besevler-starbucks', name: 'Starbucks', district: 'Beşevler', category: 'kafe', tags: ['Kafe'] },
  { id: 'besevler-kajun', name: 'Kajun', district: 'Beşevler', category: 'yemek', tags: ['Restoran'] },
  // Kentpark-Cepa
  { id: 'kentpark-bigchefs', name: 'Big Chefs', district: 'Kentpark-Cepa', category: 'yemek', tags: ['Restoran'] },
  { id: 'kentpark-happymoons', name: 'Happy Moons', district: 'Kentpark-Cepa', category: 'yemek', tags: ['Restoran'] },
  { id: 'kentpark-mcdonalds', name: 'McDonalds', district: 'Kentpark-Cepa', category: 'yemek', tags: ['Restoran'] },
  { id: 'kentpark-iskender', name: 'İskender', district: 'Kentpark-Cepa', category: 'yemek', tags: ['Restoran'] },
  { id: 'kentpark-kahvedunyasi', name: 'Kahve Dünyası', district: 'Kentpark-Cepa', category: 'kafe', tags: ['Kafe'] },
  { id: 'kentpark-100burger', name: '100 Burger', district: 'Kentpark-Cepa', category: 'yemek', tags: ['Restoran'] },
  // Söğütözü
  { id: 'sogutozu-mcdonalds', name: 'McDonalds', district: 'Söğütözü', category: 'yemek', tags: ['Restoran'] },
  { id: 'sogutozu-arabica', name: 'Arabica', district: 'Söğütözü', category: 'kafe', tags: ['Kafe'] },
  { id: 'sogutozu-starbucks', name: 'Starbucks', district: 'Söğütözü', category: 'kafe', tags: ['Kafe'] },
  { id: 'sogutozu-nextlevel', name: 'Next Level', district: 'Söğütözü', category: 'yemek', tags: ['AVM'] },
  { id: 'sogutozu-beatup', name: 'Beat Up', district: 'Söğütözü', category: 'yemek', tags: ['Restoran'] },
  // Beştepe
  { id: 'bestep-mackbear', name: 'Mackbear', district: 'Beştepe', category: 'kafe', tags: ['Ders', 'Kafe'] },
  { id: 'bestep-kocatepe', name: 'Kocatepe', district: 'Beştepe', category: 'kafe', tags: ['Ders', 'Kafe'] },
  // Koru
  { id: 'koru-ochi', name: 'Ochi', district: 'Koru', category: 'yemek', tags: ['Restoran'] },
  { id: 'koru-if', name: 'IF Sokak', district: 'Koru', category: 'yemek', tags: ['Restoran'] },
  { id: 'koru-arabica', name: 'Arabica', district: 'Koru', category: 'kafe', tags: ['Kafe'] },
  { id: 'koru-arcadium', name: 'Arcadium', district: 'Koru', category: 'kafe', tags: ['AVM'] },
  { id: 'koru-gordion', name: 'Gordion', district: 'Koru', category: 'kafe', tags: ['AVM'] },
  // Emek
  { id: 'emek-park', name: 'Park', district: 'Emek', category: 'yemek', tags: ['Açık Alan'] },
  { id: 'emek-uyanik', name: 'Uyanık Kütüphane', district: 'Emek', category: 'kafe', tags: ['Ders', 'Kafe'] },
];

export const DISTRICTS = [
  'Tunalı',
  'Kızılay',
  'Bahçeli',
  'Beşevler',
  'Kentpark-Cepa',
  'Söğütözü',
  'Beştepe',
  'Koru',
  'Emek',
];
