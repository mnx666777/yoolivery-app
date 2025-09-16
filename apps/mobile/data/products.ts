export type Product = {
  id: string;
  name: string;
  brand: string;
  category: 'Beer' | 'Wine' | 'Whisky' | 'Rum' | 'Vodka' | 'Brandy';
  volumeMl: number;
  priceINR: number;
  image: any; // require asset or remote uri object
  abv?: number; // alcohol by volume percent
  origin?: string;
  rating?: number; // 0-5
  description?: string;
};

export const products: Product[] = [
  {
    id: 'beer-kingfisher-650',
    name: 'Kingfisher Strong 650ml',
    brand: 'Kingfisher',
    category: 'Beer',
    volumeMl: 650,
    priceINR: 190,
    image: require('../assets/icon.png'),
    origin: 'India',
    rating: 4.2,
    description: 'Crisp Indian lager with a strong profile. Great with spicy snacks.',
  },
  {
    id: 'whisky-mc-750',
    name: "McDowell's No.1 750ml",
    brand: "McDowell's",
    category: 'Whisky',
    volumeMl: 750,
    priceINR: 680,
    image: require('../assets/icon.png'),
    origin: 'India',
    rating: 4.0,
    description: 'Smooth and balanced Indian whisky with hints of caramel and oak.',
  },
  {
    id: 'rum-oldmonk-750',
    name: 'Old Monk 750ml',
    brand: 'Old Monk',
    category: 'Rum',
    volumeMl: 750,
    priceINR: 560,
    image: require('../assets/icon.png'),
    origin: 'India',
    rating: 4.5,
    description: 'Iconic dark rum with rich vanilla notes. A North-East favorite.',
  },
  // Local/Regional picks
  {
    id: 'beer-dry-imphal-500',
    name: 'Imphal Dry Lager 500ml',
    brand: 'Imphal Breweries',
    category: 'Beer',
    volumeMl: 500,
    priceINR: 180,
    image: require('../assets/icon.png'),
    origin: 'Manipur',
    rating: 4.1,
    description: 'Clean, refreshing lager inspired by the valley climate of Manipur.',
  },
  {
    id: 'brandy-hills-750',
    name: 'Hills Brandy 750ml',
    brand: 'Hills Distillers',
    category: 'Brandy',
    volumeMl: 750,
    priceINR: 640,
    image: require('../assets/icon.png'),
    origin: 'North-East India',
    rating: 4.0,
    description: 'Warm brandy with fruity aromas, popular in the hills during winters.',
  },
];


