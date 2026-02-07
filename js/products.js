// JMB Handcrafted Cards - Product Data

const products = [
  {
    id: 1,
    name: "Birthday Wishes",
    category: "birthday",
    price: 8.99,
    image: "images/birthday-wishes.jpg",
    description: "Hand-painted watercolor birthday card with floral design",
    featured: true
  },
  {
    id: 2,
    name: "Celebration Balloons",
    category: "birthday",
    price: 7.99,
    image: "images/celebration-balloons.jpg",
    description: "Colorful balloon design with gold foil accents",
    featured: false
  },
  {
    id: 3,
    name: "Heartfelt Thanks",
    category: "thank-you",
    price: 6.99,
    image: "images/heartfelt-thanks.jpg",
    description: "Elegant thank you card with hand-lettered calligraphy",
    featured: true
  },
  {
    id: 4,
    name: "Grateful Heart",
    category: "thank-you",
    price: 7.49,
    image: "images/grateful-heart.jpg",
    description: "Pressed flower design with delicate paper texture",
    featured: false
  },
  {
    id: 5,
    name: "Winter Wonderland",
    category: "holiday",
    price: 9.99,
    image: "images/winter-wonderland.jpg",
    description: "Snowy scene with hand-cut paper layers",
    featured: true
  },
  {
    id: 6,
    name: "Holiday Joy",
    category: "holiday",
    price: 8.49,
    image: "images/holiday-joy.jpg",
    description: "Festive holly and berries with metallic details",
    featured: false
  },
  {
    id: 7,
    name: "Season's Greetings",
    category: "holiday",
    price: 8.99,
    image: "images/seasons-greetings.jpg",
    description: "Classic holiday design with embossed snowflakes",
    featured: false
  },
  {
    id: 8,
    name: "Love & Comfort",
    category: "sympathy",
    price: 7.99,
    image: "images/love-comfort.jpg",
    description: "Gentle watercolor design for difficult times",
    featured: false
  },
  {
    id: 9,
    name: "Peaceful Thoughts",
    category: "sympathy",
    price: 7.99,
    image: "images/peaceful-thoughts.jpg",
    description: "Serene landscape with soft pastel tones",
    featured: false
  },
  {
    id: 10,
    name: "New Beginnings",
    category: "congratulations",
    price: 8.49,
    image: "images/new-beginnings.jpg",
    description: "Celebrate achievements with elegant gold accents",
    featured: true
  },
  {
    id: 11,
    name: "Way to Go!",
    category: "congratulations",
    price: 7.99,
    image: "images/way-to-go.jpg",
    description: "Fun confetti design for any celebration",
    featured: false
  },
  {
    id: 12,
    name: "Thinking of You",
    category: "just-because",
    price: 6.99,
    image: "images/thinking-of-you.jpg",
    description: "Simple yet heartfelt botanical illustration",
    featured: false
  },
  {
    id: 13,
    name: "Hello Sunshine",
    category: "just-because",
    price: 6.49,
    image: "images/hello-sunshine.jpg",
    description: "Bright and cheerful sunflower design",
    featured: false
  },
  {
    id: 14,
    name: "Baby Welcome",
    category: "baby",
    price: 8.99,
    image: "images/baby-welcome.jpg",
    description: "Sweet woodland animals for new arrivals",
    featured: false
  },
  {
    id: 15,
    name: "Little One",
    category: "baby",
    price: 8.49,
    image: "images/little-one.jpg",
    description: "Soft pastel design with hand-drawn stars",
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
