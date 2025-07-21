import GiPhoto from '../assets/img/home_page/gi.jpg';
import GlovesPhoto from '../assets/img/home_page/gloves.jpg';
import ShirtPhoto from '../assets/img/home_page/shirt.jpg';

export const Items = [
  {
    id: 'gi01',
    item: 'Gi',
    title: 'Elite BJJ Gi – Lightweight & Durable',
    description:
      'Crafted from premium cotton, this Gi offers maximum comfort and mobility. Perfect for Brazilian Jiu-Jitsu training or competitions. Reinforced stitching ensures long-lasting wear.',
    image: GiPhoto,
    sizes: ['A1', 'A2', 'A3', 'A4'],
    colors: ['White', 'Blue', 'Black'],
    price: 120,
  },
  {
    id: 'gloves01',
    item: 'Gloves',
    title: 'Pro MMA Grappling Gloves',
    description:
      'Engineered for both training and sparring. These gloves offer superior wrist support and ventilation for comfort during intense sessions.',
    image: GlovesPhoto,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red'],
    price: 80,
  },
  {
    id: 'shirt01',
    item: 'Rash Guard T-Shirt',
    title: 'Pacific MMA Rash Guard – Compression Fit',
    description:
      'Stay dry and protected during NoGi sessions. This rash guard is designed to reduce friction and wick away sweat while showcasing a sleek Pacific MMA design.',
    image: ShirtPhoto,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    price: 50,
  },
];
