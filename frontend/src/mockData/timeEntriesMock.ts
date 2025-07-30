// Mock data for time entries
export interface TimeEntry {
  id: string;
  date: string;
  clockInTime: string;
  status: 'late' | 'on-time';
}

export const timeEntriesMock: TimeEntry[] = [
  {
    id: "1",
    date: "Tuesday, July 23, 2025",
    clockInTime: "05:30:00 PM",
    status: "late"
  },
  {
    id: "2",
    date: "Monday, July 22, 2025",
    clockInTime: "05:00:00 PM",
    status: "on-time"
  },
  {
    id: "3",
    date: "Tuesday, July 16, 2025",
    clockInTime: "05:30:00 PM",
    status: "late"
  },
  {
    id: "4",
    date: "Tuesday, July 09, 2025",
    clockInTime: "05:30:00 PM",
    status: "late"
  },
  {
    id: "5",
    date: "Tuesday, July 02, 2025",
    clockInTime: "05:30:00 PM",
    status: "late"
  },
  {
    id: "6",
    date: "Tuesday, June 25, 2025",
    clockInTime: "05:30:00 PM",
    status: "late"
  }
];

// Notification data
export interface NotificationData {
  message: string;
  type: 'warning' | 'info';
}

export const notificationMock: NotificationData = {
  message: "You have been late many days recently, please be on time next time.",
  type: "warning"
}; 