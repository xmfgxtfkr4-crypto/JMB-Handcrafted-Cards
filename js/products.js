// JMB Handcrafted Cards - Product Data

const products = [
  {
    id: 1,
    name: "Quite a Catch",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2114.jpeg",
    description: "Baseball-themed Valentine with embossed details - \"You're quite a catch, valentine!\"",
    featured: true
  },
  {
    id: 2,
    name: "You've Got Game",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2115.jpeg",
    description: "Basketball-themed Valentine with wood court detail - \"You've got game, valentine!\"",
    featured: true
  },
  {
    id: 3,
    name: "Touchdown",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2116.jpeg",
    description: "Football-themed Valentine with textured leather footballs - \"You're a touchdown in my playbook!\"",
    featured: true
  },
  {
    id: 4,
    name: "Above Par",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2117.jpeg",
    description: "Golf-themed Valentine with putting green design - \"You are above par, valentine!\"",
    featured: true
  },
  {
    id: 5,
    name: "Perfect 10",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2118.jpeg",
    description: "Gymnastics-themed Valentine with elegant silhouettes - \"You are a perfect 10!\"",
    featured: false
  },
  {
    id: 6,
    name: "Berry Sweet (Pink)",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2133.jpeg",
    description: "Strawberry hearts Valentine with pink stripes and stamp edge detail",
    featured: false
  },
  {
    id: 7,
    name: "Berry Sweet (Gingham)",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2142.jpeg",
    description: "Strawberry hearts Valentine with classic gingham and polka dot pattern",
    featured: false
  },
  {
    id: 8,
    name: "From One Fruit to Another",
    category: "valentine",
    price: 5.00,
    image: "images/IMG_2146.jpeg",
    description: "Elegant botanical fruit arrangement with watercolor style - \"From one fruit to another\"",
    featured: false
  }
];

// Get all unique categories
const categories = [...new Set(products.map(p => p.category))];

// Get featured products
function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

// Get products by category
function getProductsByCategory(category) {
  if (!category || category === 'all') {
    return products;
  }
  return products.filter(p => p.category === category);
}

// Get product by ID
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

// Format price
function formatPrice(price) {
  return '$' + price.toFixed(2);
}

// Format category name for display
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
