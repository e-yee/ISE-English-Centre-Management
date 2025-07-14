// Mock data for class list based on Figma design and database schema
export interface ClassData {
  id: string;
  className: string;
  room: string;
  time: string;
  startDate: string;
  endDate: string;
  status: 'Today' | 'Tomorrow' | 'Coming soon' | 'Expired' | string;
  statusColor: 'today' | 'tomorrow' | 'coming-soon' | 'expired' | 'custom';
}

export const classListMockData: ClassData[] = [
  {
    id: 'CL001',
    className: '1.Class 1A',
    room: 'I72',
    time: '17:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Today',
    statusColor: 'today'
  },
  {
    id: 'CL002',
    className: '2.Class 2B',
    room: 'I72',
    time: '19:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Today',
    statusColor: 'today'
  },
  {
    id: 'CL003',
    className: '3.Class 3C',
    room: 'I102',
    time: '17:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Today',
    statusColor: 'today'
  },
  {
    id: 'CL004',
    className: '4.Class 4D',
    room: 'I7A',
    time: '17:00:00',
    startDate: '28/06/2025',
    endDate: '28/08/2025',
    status: 'Coming soon',
    statusColor: 'coming-soon'
  },
  {
    id: 'CL005',
    className: '5.Class 5E',
    room: 'I22',
    time: '19:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Today',
    statusColor: 'today'
  },
  {
    id: 'CL006',
    className: '6.Class 6S',
    room: 'I72',
    time: '17:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Tomorrow',
    statusColor: 'tomorrow'
  },
  {
    id: 'CL007',
    className: '7.Class 7S',
    room: 'I72',
    time: '17:00:00',
    startDate: '20/06/2025',
    endDate: '20/08/2025',
    status: 'Future',
    statusColor: 'custom'
  },
  {
    id: 'CL008',
    className: '8.Class 8B',
    room: 'I92',
    time: '09:00:00',
    startDate: '20/04/2025',
    endDate: '20/06/2025',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL009',
    className: '9.Class 9H',
    room: 'I72',
    time: '17:00:00',
    startDate: '22/04/2025',
    endDate: '22/05/2025',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL010',
    className: '10.Class 9K',
    room: 'I62',
    time: '19:00:00',
    startDate: '20/05/2025',
    endDate: '20/06/2025',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL011',
    className: '11.Class 9E',
    room: 'I14',
    time: '17:00:00',
    startDate: '22/03/2025',
    endDate: '24/05/2025',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL012',
    className: '12.Class 7D',
    room: 'I72',
    time: '17:00:00',
    startDate: '10/01/2025',
    endDate: '10/03/2025',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL013',
    className: '13.Class 7F',
    room: 'I72',
    time: '17:00:00',
    startDate: '20/10/2024',
    endDate: '20/12/2024',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL014',
    className: '14.Class 8J',
    room: 'I72',
    time: '17:00:00',
    startDate: '10/06/2024',
    endDate: '10/08/2024',
    status: 'Expired',
    statusColor: 'expired'
  },
  {
    id: 'CL015',
    className: '15.Class 6A',
    room: 'I72',
    time: '17:00:00',
    startDate: '20/03/2024',
    endDate: '20/05/2024',
    status: 'Expired',
    statusColor: 'expired'
  }
];
