import { AvailabilitySlot, Category, City, Country, OperatorProfile, Subcategory, Treatment, User } from '@/models/types';

export const countries: Country[] = [
  { code: 'IT', name: 'Italia' },
  { code: 'ES', name: 'Spagna' }
];

export const cities: City[] = [
  { id: 'lecce', name: 'Lecce', countryCode: 'IT' },
  { id: 'brindisi', name: 'Brindisi', countryCode: 'IT' },
  { id: 'bari', name: 'Bari', countryCode: 'IT' }
];

export const categories: Category[] = [
  {
    id: 'beauty',
    name: 'Bellezza',
    description: 'Trattamenti per mani, viso e altro.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'massage',
    name: 'Massaggi',
    description: 'Relax, recupera e rigenera a casa.',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'hair',
    name: 'Capelli & Make-up',
    description: 'Styling, trucco e grooming.',
    image: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'physio',
    name: 'Fisioterapia & Osteopatia',
    description: 'Terapie mirate per recupero e mobilita.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'pregnancy',
    name: 'Gravidanza & Neomamme',
    description: 'Cura delicata e sicura per ogni trimestre.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60'
  }
];

export const subcategories: Subcategory[] = [
  { id: 'massage', categoryId: 'massage', name: 'Massaggi' },
  { id: 'physio', categoryId: 'physio', name: 'Sessioni terapeutiche' },
  { id: 'pregnancy', categoryId: 'pregnancy', name: 'Gravidanza & Neomamme' },
  { id: 'beauty-hands', categoryId: 'beauty', name: 'Mani' },
  { id: 'beauty-feet', categoryId: 'beauty', name: 'Piedi' },
  { id: 'beauty-combo', categoryId: 'beauty', name: 'Combo Mani & Piedi' },
  { id: 'beauty-wax', categoryId: 'beauty', name: 'Ceretta' },
  { id: 'beauty-eyes', categoryId: 'beauty', name: 'Ciglia & Sopracciglia' },
  { id: 'beauty-eyes-combo', categoryId: 'beauty', name: 'Combo Ciglia & Sopracciglia' },
  { id: 'beauty-facial', categoryId: 'beauty', name: 'Trattamenti viso' },
  { id: 'hair-hair', categoryId: 'hair', name: 'Capelli' },
  { id: 'hair-makeup', categoryId: 'hair', name: 'Make-up' },
  { id: 'hair-barber', categoryId: 'hair', name: 'Barbiere' },
  { id: 'hair-combo', categoryId: 'hair', name: 'Combo Capelli & Make-up' }
];

export const treatments: Treatment[] = [
  {
    id: 't-mani-classic',
    subcategoryId: 'beauty-hands',
    name: 'Manicure Classica',
    description: 'Cuticole, limatura e finitura idratante.',
    durationMinutes: 45,
    price: 28
  },
  {
    id: 't-gel-mani',
    subcategoryId: 'beauty-hands',
    name: 'Manicure Gel',
    description: 'Gel a lunga durata con finitura lucida.',
    durationMinutes: 60,
    price: 38
  },
  {
    id: 't-pedi-classic',
    subcategoryId: 'beauty-feet',
    name: 'Pedicure Classica',
    description: 'Pediluvio, esfoliazione e smalto.',
    durationMinutes: 50,
    price: 34
  },
  {
    id: 't-wax-full',
    subcategoryId: 'beauty-wax',
    name: 'Ceretta Corpo Completa',
    description: 'Ceretta delicata con trattamento lenitivo.',
    durationMinutes: 75,
    price: 62
  },
  {
    id: 't-facial-glow',
    subcategoryId: 'beauty-facial',
    name: 'Trattamento Viso Glow',
    description: 'Detersione profonda, esfoliazione e maschera idratante.',
    durationMinutes: 55,
    price: 48
  },
  {
    id: 't-massage-relax',
    subcategoryId: 'massage',
    name: 'Massaggio Relax',
    description: 'Massaggio lento e rilassante per sciogliere le tensioni.',
    durationMinutes: 60,
    price: 70
  },
  {
    id: 't-massage-sport',
    subcategoryId: 'massage',
    name: 'Massaggio Sportivo',
    description: 'Recupero mirato con trattamento profondo.',
    durationMinutes: 75,
    price: 85
  },
  {
    id: 't-hair-style',
    subcategoryId: 'hair-hair',
    name: 'Piega Signature',
    description: 'Volume, finitura liscia e styling.',
    durationMinutes: 45,
    price: 40
  },
  {
    id: 't-hair-cut',
    subcategoryId: 'hair-hair',
    name: 'Taglio & Styling',
    description: 'Consulenza, taglio e styling.',
    durationMinutes: 60,
    price: 52
  },
  {
    id: 't-makeup-evening',
    subcategoryId: 'hair-makeup',
    name: 'Make-up Sera',
    description: 'Smokey eyes, incarnato luminoso e lunga tenuta.',
    durationMinutes: 50,
    price: 60
  },
  {
    id: 't-barber-classic',
    subcategoryId: 'hair-barber',
    name: 'Barbiere Classico',
    description: 'Taglio, rifinitura e panno caldo.',
    durationMinutes: 40,
    price: 32
  },
  {
    id: 't-physio-restore',
    subcategoryId: 'physio',
    name: 'Recupero Mobilita',
    description: 'Valutazione e terapia manuale per la mobilita.',
    durationMinutes: 60,
    price: 90
  },
  {
    id: 't-osteo-core',
    subcategoryId: 'physio',
    name: 'Seduta di Osteopatia',
    description: 'Terapia manuale per allineamento ed equilibrio.',
    durationMinutes: 60,
    price: 95
  },
  {
    id: 't-pregnancy-massage',
    subcategoryId: 'pregnancy',
    name: 'Massaggio in Gravidanza',
    description: 'Massaggio delicato pensato per il comfort.',
    durationMinutes: 55,
    price: 75
  },
  {
    id: 't-postnatal-reset',
    subcategoryId: 'pregnancy',
    name: 'Recupero Post Parto',
    description: 'Cura mirata al recupero per le neomamme.',
    durationMinutes: 60,
    price: 80
  }
];

export const users: User[] = [
  {
    id: 'user-1',
    firstName: 'Arianna',
    lastName: 'Rossi',
    name: 'Arianna Rossi',
    email: 'arianna@example.com',
    role: 'user',
    country: 'IT',
    cityId: 'bari',
    addresses: [
      {
        id: 'addr-1',
        street: 'Via Sparano',
        number: '45',
        zip: '70121',
        city: 'Bari',
        notes: 'Suonare 3B, secondo piano'
      }
    ]
  },
  {
    id: 'op-1',
    firstName: 'Noemi',
    lastName: 'Ciani',
    name: 'Noemi Ciani',
    email: 'noemi@example.com',
    role: 'operator',
    country: 'IT',
    cityId: 'lecce',
    addresses: []
  }
  ,
  {
    id: 'op-2',
    firstName: 'Giulia',
    lastName: 'Serra',
    name: 'Giulia Serra',
    email: 'giulia@example.com',
    role: 'operator',
    country: 'IT',
    cityId: 'bari',
    addresses: []
  },
  {
    id: 'op-3',
    firstName: 'Elena',
    lastName: 'Ricci',
    name: 'Elena Ricci',
    email: 'elena@example.com',
    role: 'operator',
    country: 'IT',
    cityId: 'brindisi',
    addresses: []
  }
];

export const operatorProfiles: OperatorProfile[] = [
  {
    id: 'operator-1',
    userId: 'op-1',
    cityId: 'lecce',
    firstName: 'Noemi',
    lastName: 'Ciani',
    offeredTreatmentIds: ['t-hair-style', 't-hair-cut', 't-makeup-evening', 't-barber-classic'],
    categories: ['hair'],
    rating: 4.8,
    verified: true,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 'operator-2',
    userId: 'op-2',
    cityId: 'bari',
    firstName: 'Giulia',
    lastName: 'Serra',
    offeredTreatmentIds: ['t-massage-relax', 't-massage-sport', 't-physio-restore', 't-osteo-core'],
    categories: ['massage', 'physio'],
    rating: 4.9,
    verified: true,
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 'operator-3',
    userId: 'op-3',
    cityId: 'brindisi',
    firstName: 'Elena',
    lastName: 'Ricci',
    offeredTreatmentIds: ['t-mani-classic', 't-gel-mani', 't-pedi-classic', 't-pregnancy-massage', 't-postnatal-reset'],
    categories: ['beauty', 'pregnancy'],
    rating: 4.6,
    verified: false,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=60'
  }
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const dayISO = (date: Date) => date.toISOString().slice(0, 10);

export const availability: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    operatorId: 'operator-1',
    day: dayISO(today),
    start: '09:00',
    end: '13:00'
  },
  {
    id: 'slot-2',
    operatorId: 'operator-1',
    day: dayISO(today),
    start: '14:00',
    end: '18:00'
  },
  {
    id: 'slot-3',
    operatorId: 'operator-2',
    day: dayISO(tomorrow),
    start: '10:00',
    end: '19:00'
  }
];
