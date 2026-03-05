export const SIZE_OPTIONS = [
  { value: 'small', label: 'Small', sub: 'up to 10kg' },
  { value: 'medium', label: 'Medium', sub: '10–25kg' },
  { value: 'large', label: 'Large', sub: '25kg+' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: '♂ Male', icon: 'male' },
  { value: 'female', label: '♀ Female', icon: 'female' },
  { value: 'unknown', label: '? Unknown', icon: null },
] as const;

export const COLOR_OPTIONS = [
  { value: 'black', label: 'Black', dot: '#1a1a1a' },
  { value: 'brown', label: 'Brown', dot: '#7c4a1e' },
  { value: 'white', label: 'White', dot: '#f0f0f0', border: true },
  { value: 'golden', label: 'Golden', dot: '#d4a520' },
  { value: 'gray', label: 'Gray', dot: '#9ca3af' },
  { value: 'multi', label: 'Multi', dot: null },
] as const;

export const BREED_OPTIONS = [
  'Akita', 'Australian Shepherd', 'Basenji', 'Beagle', 'Bernese Mountain Dog',
  'Bichon Frise', 'Border Collie', 'Boxer', 'Bulldog', 'Cavalier King Charles Spaniel',
  'Chihuahua', 'Chow Chow', 'Cocker Spaniel', 'Corgi', 'Dachshund',
  'Dalmatian', 'Doberman', 'French Bulldog', 'German Shepherd', 'Golden Retriever',
  'Great Dane', 'Greyhound', 'Havanese', 'Husky', 'Jack Russell Terrier',
  'Labrador', 'Maltese', 'Miniature Schnauzer', 'Pomeranian', 'Poodle',
  'Pug', 'Rottweiler', 'Samoyed', 'Shiba Inu', 'Shih Tzu',
  'Springer Spaniel', 'Staffordshire Bull Terrier', 'Vizsla', 'Weimaraner', 'Yorkshire Terrier',
  'Mixed', 'Unknown',
];