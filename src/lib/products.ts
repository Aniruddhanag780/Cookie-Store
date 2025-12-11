import { PlaceHolderImages } from './placeholder-images';
import type { Product } from './types';

const getProductData = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === `product-${id}`);
  if (!image) {
    // This provides a fallback, but in a real app, you'd want to handle this more robustly
    return {
      image: 'https://placehold.co/600x800',
      imageHint: 'placeholder',
    };
  }
  return { image: image.imageUrl, imageHint: image.imageHint };
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Chrono-Gauntlet',
    slug: 'chrono-gauntlet',
    description: 'A sleek gauntlet that looks like it manipulates time.',
    longDescription:
      'Forged from aerospace-grade alloy and inlaid with dormant chronometer crystals, the Chrono-Gauntlet is the pinnacle of aesthetic techwear. Its articulated design ensures a comfortable fit while projecting an aura of advanced capability. Note: Does not actually manipulate time.',
    price: 299.99,
    category: 'Accessories',
    ...getProductData('1'),
  },
  {
    id: '2',
    name: 'Aether-Weave Hoodie',
    slug: 'aether-weave-hoodie',
    description: 'Lightweight hoodie with an iridescent, ethereal sheen.',
    longDescription:
      'Woven from proprietary Aether-fibre, this hoodie captures and refracts ambient light, creating a subtle, shifting color spectrum. The fabric is impossibly light yet provides excellent insulation, making it the perfect all-season statement piece for the urban explorer.',
    price: 450.0,
    category: 'Apparel',
    ...getProductData('2'),
  },
  {
    id: '3',
    name: 'Quantum Visor',
    slug: 'quantum-visor',
    description: 'A heads-up display for the fashion-forward.',
    longDescription:
      'The Quantum Visor features a polarized, poly-carbonate lens with an inactive micro-LED array that creates a stunning visual effect. It offers UV4A protection and an unparalleled futuristic look. The onboard processor is for aesthetic purposes only.',
    price: 380.5,
    category: 'Accessories',
    ...getProductData('3'),
  },
  {
    id: '4',
    name: 'Kinetic Boost Boots',
    slug: 'kinetic-boost-boots',
    description: 'High-top boots with energy-channeling patterns.',
    longDescription:
      'Designed for the streets of tomorrow, these boots feature a high-traction sole and cushioned interior. The exterior is marked with non-functional but visually striking energy conduits, giving the impression of stored kinetic power ready to be unleashed.',
    price: 620.0,
    category: 'Footwear',
    ...getProductData('4'),
  },
  {
    id: '5',
    name: 'Neural Interface Band',
    slug: 'neural-interface-band',
    description: 'Sleek, minimalist tech-inspired headband.',
    longDescription:
      'A simple yet elegant accessory, the Neural Interface Band is crafted from soft-touch silicone and features a single, polished chrome accent. It evokes the imagery of brain-computer interfaces, making it a subtle nod to a high-tech future.',
    price: 150.0,
    category: 'Accessories',
    ...getProductData('5'),
  },
  {
    id: '6',
    name: 'Singularity Jacket',
    slug: 'singularity-jacket',
    description: 'A jacket that is the center of any outfit.',
    longDescription:
      'The Singularity Jacket is defined by its sharp, asymmetrical cut and high collar. Made from a durable, water-resistant synthetic blend, it combines practicality with a commanding presence. Multiple concealed pockets offer utility without sacrificing its sleek silhouette.',
    price: 899.99,
    category: 'Apparel',
    ...getProductData('6'),
  },
  {
    id: '7',
    name: 'Data-Stream Leggings',
    slug: 'data-stream-leggings',
    description: 'Form-fitting leggings with bio-luminescent patterns.',
    longDescription:
      'These leggings are made from a high-performance stretch fabric, providing support and flexibility. Embedded within the material are bio-luminescent threads that pulse with a soft, ambient light, mimicking the flow of data.',
    price: 250.0,
    category: 'Apparel',
    ...getProductData('7'),
  },
  {
    id: '8',
    name: 'Gravity-Shift Sneakers',
    slug: 'gravity-shift-sneakers',
    description: 'Sneakers that look like they defy gravity.',
    longDescription:
      'With a cantilevered heel and ultra-lightweight construction, the Gravity-Shift Sneakers offer a unique profile and supreme comfort. The modular sole components provide a deconstructed, technical aesthetic that is sure to turn heads.',
    price: 550.0,
    category: 'Footwear',
    ...getProductData('8'),
  },
  {
    id: '9',
    name: 'Echo-Shell Pack',
    slug: 'echo-shell-pack',
    description: 'A minimalist backpack with a rigid, protective shell.',
    longDescription:
      'The Echo-Shell Pack is designed for the modern digital nomad. Its hard-shell exterior protects your devices, while the ergonomic, padded interior keeps everything organized. The minimalist design has no external pockets, ensuring a clean and secure profile.',
    price: 320.0,
    category: 'Bags',
    ...getProductData('9'),
  },
  {
    id: '10',
    name: 'Vortex Trench Coat',
    slug: 'vortex-trench-coat',
    description: 'A flowing, dramatic coat for a grand entrance.',
    longDescription:
      'The Vortex Trench Coat is all about drama and flow. Made from a lightweight, wind-resistant fabric, its oversized lapels and extended length create a powerful silhouette. The magnetic clasp system provides a satisfyingly clean closure.',
    price: 950.0,
    category: 'Apparel',
    ...getProductData('10'),
  },
  {
    id: '11',
    name: 'Hologram Utility Belt',
    slug: 'hologram-utility-belt',
    description: 'A belt with pouches and a holographic buckle.',
    longDescription:
      'Function meets future fashion. This utility belt features detachable pouches and a central buckle with a multi-layered, holographic display effect. It’s the ultimate accessory for carrying your essentials while maintaining a cyberpunk edge.',
    price: 180.0,
    category: 'Accessories',
    ...getProductData('11'),
  },
  {
    id: '12',
    name: 'Stealth-Fabric T-Shirt',
    slug: 'stealth-fabric-t-shirt',
    description: 'A comfortable t-shirt with radar-absorbent properties (not really).',
    longDescription:
      'The foundation of any techwear wardrobe. This t-shirt is made from a premium, moisture-wicking bamboo-cotton blend. Its unique panelled construction and subtle, tonal branding make it far more than a basic tee.',
    price: 120.0,
    category: 'Apparel',
    ...getProductData('12'),
  },
  {
    id: '13',
    name: 'Lemon Meringue Tarts',
    slug: 'lemon-meringue-tarts',
    description: 'Zesty lemon curd in a buttery shell, topped with toasted meringue.',
    longDescription:
      'A perfect balance of sweet and tart. Our lemon meringue tarts feature a crisp, buttery pastry shell filled with a zesty and vibrant lemon curd, all crowned with a fluffy, toasted Italian meringue. A classic dessert, perfected.',
    price: 8.50,
    category: 'Pastries',
    ...getProductData('13'),
  },
];

export const categories = [
  ...new Set(products.map((product) => product.category)),
];
