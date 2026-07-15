import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@eventhub.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'user@eventhub.com',
    password: 'user123',
    role: 'user',
  },
];

const sampleEvents = [
  {
    title: 'India Tech Summit & Hackathon 2026',
    description: "Bengaluru's biggest developer gathering. Dive into AI advancements, Web3 projects, and pitch ideas to top Indian venture capitalists. Food and swag included.",
    date: new Date('2026-10-12'),
    time: '09:00 AM - 06:00 PM',
    location: 'KTPO Exhibition Centre, Whitefield, Bengaluru',
    category: 'Tech',
    price: 499,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    capacity: 350,
    availableSeats: 350,
  },
  {
    title: 'Arijit Singh Soulful Melodies Tour',
    description: 'Experience an unforgettable musical symphony with the king of romance. Enjoy live renditions of his iconic romantic hits and popular Bollywood tracks.',
    date: new Date('2026-11-20'),
    time: '06:00 PM - 10:00 PM',
    location: 'Salt Lake Stadium, Kolkata',
    category: 'Music',
    price: 999,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    capacity: 2500,
    availableSeats: 2500,
  },
  {
    title: 'IPL Cricket Finals - Outdoor Live Screening',
    description: 'Watch the ultimate cricket clash on a massive 40ft LED screen! Live dhol, food trucks, face painting, and an electric stadium-like atmosphere.',
    date: new Date('2026-09-05'),
    time: '07:00 PM - 11:30 PM',
    location: 'Jio World Drive Arena, BKC, Mumbai',
    category: 'Sports',
    price: 199,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    capacity: 800,
    availableSeats: 800,
  },
  {
    title: 'Zakir Khan Live - Tathastu Tour',
    description: 'The beloved "Sakht Launda" is back with a heart-warming, nostalgic, and hilarious set. Bring your friends and family for an evening of pure laughter.',
    date: new Date('2026-08-15'),
    time: '07:30 PM - 09:30 PM',
    location: 'Sirifort Auditorium, New Delhi',
    category: 'Comedy',
    price: 600,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=800&q=80',
    capacity: 450,
    availableSeats: 450,
  },
  {
    title: 'Jaipur Blue Pottery Masterclass',
    description: 'Discover the heritage art of Jaipur blue pottery. Learn traditional molding, painting, and glazing techniques directly from master artisans.',
    date: new Date('2026-09-28'),
    time: '11:00 AM - 03:00 PM',
    location: 'Artistic Craft Hub, Amer Road, Jaipur',
    category: 'Workshop',
    price: 250,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    capacity: 40,
    availableSeats: 40,
  },
  {
    title: 'Sunburn Electro Arena Festival',
    description: 'Dance to the beats of world-renowned and top Indian DJs. Experience visual laser displays, fire dancers, and multiple stages by the beach.',
    date: new Date('2026-12-28'),
    time: '03:00 PM - 11:30 PM',
    location: 'Vagator Beach Arena, North Goa',
    category: 'Music',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    capacity: 1500,
    availableSeats: 1500,
  },
  {
    title: 'Pro Kabaddi Clash League Finals',
    description: 'Catch the thrilling finale of the Kabaddi League. Witness high-intensity action, tackles, and raids live as the top teams clash for the trophy.',
    date: new Date('2026-08-30'),
    time: '08:00 PM - 10:00 PM',
    location: 'Shree Shiv Chhatrapati Sports Complex, Pune',
    category: 'Sports',
    price: 350,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    capacity: 600,
    availableSeats: 600,
  },
  {
    title: 'Anubhav Singh Bassi - Bas Kar Bassi Standup',
    description: 'Witness Bassi tell raw, relatable, and hilarious stories about his college life, jobs, and friendships. An evening full of punchlines!',
    date: new Date('2026-09-18'),
    time: '06:00 PM - 08:00 PM',
    location: 'Kamani Auditorium, Mandi House, New Delhi',
    category: 'Comedy',
    price: 500,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=80',
    capacity: 500,
    availableSeats: 500,
  },
  {
    title: 'Mithai Making & Indian Sweets Workshop',
    description: 'Learn the secrets of making classic Indian sweets like Kaju Katli, Gulab Jamun, and Rabdi from sweet-makers with generations of experience.',
    date: new Date('2026-10-04'),
    time: '10:00 AM - 02:00 PM',
    location: 'Rasoi Masterchef Studio, Ahmedabad',
    category: 'Workshop',
    price: 150,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    capacity: 25,
    availableSeats: 25,
  },
  {
    title: 'National Coding Hackathon 2026',
    description: 'A 24-hour coding sprint for college students. Build innovative web/app solutions to solve local community issues. Cash prizes up to 1,00,000 INR.',
    date: new Date('2026-10-25'),
    time: '08:00 AM - Next Day 08:00 AM',
    location: 'IIT Delhi Seminar Hall, New Delhi',
    category: 'Tech',
    price: 0,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    capacity: 150,
    availableSeats: 150,
  }
];

const importData = async () => {
  try {
    // Clear all existing documents
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    // Insert new users
    const createdUsers = await User.create(sampleUsers);
    
    // Find the admin user
    const adminUser = createdUsers.find(user => user.role === 'admin');

    // Link events to the admin creator
    const eventsWithCreator = sampleEvents.map(event => {
      return { ...event, creator: adminUser._id };
    });

    // Insert events
    await Event.insertMany(eventsWithCreator);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all collections
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    console.log('Data Destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check argument flag
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
