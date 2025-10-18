// Mock users data
export const users = [
  {
    id: '1',
    name: 'Vamsi',
    email: 'vamsi@example.com',
    password: '123456',
    role: 'client',
    phone: '9876543210',
    address: 'Hyderabad, India'
  },
  {
    id: '2',
    name: 'Farmer John',
    email: 'john@farm.com',
    password: '123456',
    role: 'farmer',
    phone: '9876543211',
    address: 'Farm Valley, India',
    farmName: 'Green Valley Farm'
  }
];

// Mock products data
export const products = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 40,
    quantity: 50,
    unit: 'kg',
    farmName: 'Green Valley Farm',
    farmAddress: 'Farm Valley, India',
    farmPhone: '9876543211',
    farmer: '2'
  },
  {
    id: '2',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 60,
    quantity: 30,
    unit: 'kg',
    farmName: 'Green Valley Farm',
    farmAddress: 'Farm Valley, India',
    farmPhone: '9876543211',
    farmer: '2'
  }
];

// Mock orders data
export const orders = [];