import { hashSync } from 'bcrypt-ts-edge'

const sampleData = {
  users: [
    {
      name: 'Idris',
      email: 'kulubiidris@gmail.com',
      password: hashSync('123456', 10),
      role: 'admin',
    },
    {
      name: 'Jane',
      email: 'jane@example.com',
      password: hashSync('123456', 10),
      role: 'user',
    },
  ],
  products: [
    
    
    {
      name: "MEN'S LACOSTE SPORT FRENCH CAPSULE TRACKSUIT PANTS",
      slug: 'mens-lacoste-sport-french-capsule-tracksuit-pants',
      category: 'Track Pants',
      images: ['/assets/images/p4-1.jpeg', '/assets/images/p4-2.jpeg'],
      price: '125.95',
      brand: 'Lacoste',
      rating: '3.6',
      numReviews: 5,
      stock: 10,
      description:
        'A tricolour design brings a distinctive edge to these lightweight tracksuit pants made of diamond taffeta. ',
    },
  ],
}

export default sampleData
