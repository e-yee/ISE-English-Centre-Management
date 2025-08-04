export interface Student {
  id: string;
  name: string;
  scores: { Q1: number; Q2: number; Q3: number; Q4: number; Q5: number };
  notes: string;
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

// Mock data by class ID
export const scoringData: Record<string, ClassData> = {
  "1": {
    id: "1",
    name: "Class 1A",
    students: [
      {
        id: "STD001",
        name: "Max Verstappen",
        scores: { Q1: 85, Q2: 92, Q3: 78, Q4: 88, Q5: 90 },
        notes: "Excellent participation in class discussions. Shows strong analytical skills.",
      },
      {
        id: "STD002",
        name: "Lewis Hamilton",
        scores: { Q1: 90, Q2: 87, Q3: 94, Q4: 91, Q5: 89 },
        notes: "Consistent performer. Great teamwork skills.",
      },
      {
        id: "STD003",
        name: "Charles Leclerc",
        scores: { Q1: 82, Q2: 85, Q3: 88, Q4: 86, Q5: 84 },
        notes: "Shows improvement over time. Needs more confidence in presentations.",
      },
      {
        id: "STD004",
        name: "George Russell",
        scores: { Q1: 88, Q2: 90, Q3: 85, Q4: 92, Q5: 87 },
        notes: "Detail-oriented student. Excellent written work quality.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },
    ],
  },
  "class-1b": {
    id: "class-1b",
    name: "Class 1B",
    students: [
      {
        id: "STD005",
        name: "Lando Norris",
        scores: { Q1: 92, Q2: 88, Q3: 91, Q4: 89, Q5: 93 },
        notes: "Outstanding performance across all quarters. Natural leader.",
      },
      {
        id: "STD006",
        name: "Carlos Sainz",
        scores: { Q1: 87, Q2: 89, Q3: 86, Q4: 90, Q5: 88 },
        notes: "Strong technical skills. Excellent problem-solving abilities.",
      },

    ],
  },
  "class-2a": {
    id: "class-2a",
    name: "Class 2A",
    students: [
      {
        id: "STD007",
        name: "Fernando Alonso",
        scores: { Q1: 94, Q2: 96, Q3: 93, Q4: 95, Q5: 97 },
        notes: "Exceptional student. Demonstrates advanced understanding of concepts.",
      },
      {
        id: "STD008",
        name: "Esteban Ocon",
        scores: { Q1: 83, Q2: 86, Q3: 85, Q4: 87, Q5: 84 },
        notes: "Good progress. Needs more practice with complex topics.",
      },
    ],
  },
};

// Helper function to get class data by ID
export const getClassData = (classId: string): ClassData | null => {
  return scoringData[classId] || null;
};

// Helper function to get all class IDs
export const getAllClassIds = (): string[] => {
  return Object.keys(scoringData);
}; 