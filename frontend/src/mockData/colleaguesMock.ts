// Mock data for colleagues
export interface Course {
  id: string;
  name: string;
  time: string;
}

export interface Colleague {
  id: string;
  name: string;
  email: string;
  avatar: string; // path to local SVG/PNG or placeholder
  phone: string;
  nickname: string;
  achievements: string;
  philosophy: string;
  courses: Course[];
}

export const colleaguesMock: Colleague[] = [
  {
    id: '1',
    name: 'Max Verstappen',
    email: 'max.verstappen@example.com',
    phone: '123-456-7890',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Mad Max',
    achievements: '3x Formula 1 World Champion.',
    philosophy: 'Never give up, always push to the limit.',
    courses: [
      { id: 'C01', name: 'Introduction to Racing', time: 'Mon 10:00 AM' },
      { id: 'C02', name: 'Advanced Driving Techniques', time: 'Wed 2:00 PM' },
      { id: 'C03', name: 'Data Analysis in Motorsport', time: 'Fri 9:00 AM' },
    ]
  },
  {
    id: '2',
    name: 'Nguyen Minh Khoi',
    email: 'nmkhoi231@clc.fitus.edu.vn',
    phone: '098-765-4321',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Khoi',
    achievements: 'Lead Developer on Hammer & Grammar project.',
    philosophy: 'Code is like humor. When you have to explain it, it\'s bad.',
    courses: [
      { id: 'C04', name: 'Software Engineering', time: 'Tue 1:00 PM' },
      { id: 'C05', name: 'Database Systems', time: 'Thu 11:00 AM' },
    ]
  },
  {
    id: '3',
    name: 'Lando Norris',
    email: 'lando.norris@example.com',
    phone: '555-444-3333',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Lando',
    achievements: 'Multiple F1 Podium Finisher.',
    philosophy: 'It\'s not about the car, it\'s about the driver.',
    courses: [
      { id: 'C06', name: 'Karting Fundamentals', time: 'Mon 3:00 PM' },
      { id: 'C07', name: 'Media Training for Athletes', time: 'Wed 11:00 AM' },
    ]
  },
  {
    id: '4',
    name: 'Charles Leclerc',
    email: 'charles.leclerc@example.com',
    phone: '111-222-3333',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Il Predestinato',
    achievements: 'Multiple F1 Race Winner.',
    philosophy: 'I am stupid. I am stupid.',
    courses: [
      { id: 'C08', name: 'Advanced Tyre Management', time: 'Tue 3:00 PM' },
      { id: 'C09', name: 'Qualifying Strategy', time: 'Thu 1:00 PM' },
    ]
  },
  {
    id: '5',
    name: 'Lewis Hamilton',
    email: 'lewis.hamilton@example.com',
    phone: '777-888-9999',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Sir Lewis',
    achievements: '7x Formula 1 World Champion.',
    philosophy: 'Still I Rise.',
    courses: [
      { id: 'C10', name: 'Racing Ethics and Sportsmanship', time: 'Fri 11:00 AM' }
    ]
  },
  {
    id: '6',
    name: 'George Russell',
    email: 'george.russell@example.com',
    phone: '636-363-6363',
    avatar: '/src/assets/header/avatar.svg',
    nickname: 'Mr. Saturday',
    achievements: 'F2 Champion, F1 Race Winner.',
    philosophy: 'Consistency is key.',
    courses: [
      { id: 'C11', name: 'Presentation Skills', time: 'Wed 4:00 PM' }
    ]
  },
];