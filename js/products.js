// JMB Handcrafted Cards - Product Data

let products = [];

// Main categories
const mainCategories = [
  { id: 'birthday', name: 'Birthday' },
  { id: 'congratulations', name: 'Congratulations' },
  { id: 'holiday', name: 'Holiday' },
  { id: 'thank-you', name: 'Thank You' },
  { id: 'thinking-of-you', name: 'Thinking of You' }
];

// Holiday subcategories
const holidaySubcategories = [
  { id: 'valentines-day', name: "Valentine's Day" },
  { id: 'easter', name: 'Easter' },
  { id: 'mothers-day', name: "Mother's Day" },
  { id: 'fathers-day', name: "Father's Day" },
  { id: 'fourth-of-july', name: '4th of July' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'thanksgiving', name: 'Thanksgiving' },
  { id: 'christmas', name: 'Christmas' },
  { id: 'hanukkah', name: 'Hanukkah' },
  { id: 'new-years', name: "New Year's" }
];

// Load products from JSON file
async function loadProducts() {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();
    products = data.products.map((p, index) => ({
      ...p,
      id: index + 1,
      inventory: p.inventory != null ? p.inventory : 0
    }));
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Get all unique categories from products
function getCategories() {
  return [...new Set(products.map(p => p.category))];
}

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

// Get products by subcategory
function getProductsBySubcategory(subcategory) {
  if (!subcategory || subcategory === 'all') {
    return products.filter(p => p.category === 'holiday');
  }
  return products.filter(p => p.subcategory === subcategory);
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
  const found = mainCategories.find(c => c.id === category);
  if (found) return found.name;

  const foundSub = holidaySubcategories.find(c => c.id === category);
  if (foundSub) return foundSub.name;

  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
