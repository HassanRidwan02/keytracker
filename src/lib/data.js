// Static configuration + realistic sample data for the Lab Key Tracker.

export const LABS = [
  { id: "CYS", name: "CYS Lab" },
  { id: "SEN", name: "SEN Lab" },
  { id: "AI", name: "AI Lab" },
  { id: "DS", name: "DS Lab" },
];

export const KEYS_PER_LAB = 6;

export const labName = (labId) => LABS.find((l) => l.id === labId)?.name ?? labId;

// 4 labs x 6 keys = 24 physical keys, labelled e.g. "AI-02".
export const ALL_KEYS = LABS.flatMap((lab) =>
  Array.from({ length: KEYS_PER_LAB }, (_, i) => ({
    number: `${lab.id}-${String(i + 1).padStart(2, "0")}`,
    labId: lab.id,
  }))
);

export const TOTAL_KEYS = ALL_KEYS.length;

// Build an ISO timestamp for "N days ago at HH:MM" (local time).
function at(daysAgo, hours, minutes) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// A record is one checkout. `returnedAt === null` means the key is still out.
export function buildSeedRecords() {
  return [
    // --- Currently checked out (5) ---
    {
      id: "seed-1",
      name: "Amina Yusuf",
      personId: "MAT/2022/0841",
      department: "Computer Science",
      purpose: "Practical session setup",
      labId: "AI",
      keyNumber: "AI-02",
      collectedAt: at(0, 9, 12),
      returnedAt: null,
    },
    {
      id: "seed-2",
      name: "Daniel Okafor",
      personId: "SEN/2021/0367",
      department: "Software Engineering",
      purpose: "Final-year project demo preparation",
      labId: "SEN",
      keyNumber: "SEN-04",
      collectedAt: at(0, 8, 46),
      returnedAt: null,
    },
    {
      id: "seed-3",
      name: "Dr. Chinedu Eze",
      personId: "STAFF/ICT/117",
      department: "ICT Faculty",
      purpose: "Lecture demonstration equipment",
      labId: "CYS",
      keyNumber: "CYS-01",
      collectedAt: at(0, 8, 10),
      returnedAt: null,
    },
    {
      id: "seed-4",
      name: "Blessing Adeyemi",
      personId: "DS/2023/0198",
      department: "Data Science",
      purpose: "Dissertation data analysis",
      labId: "DS",
      keyNumber: "DS-03",
      collectedAt: at(1, 16, 32),
      returnedAt: null,
    },
    {
      id: "seed-5",
      name: "Fatima Bello",
      personId: "CYS/2022/0455",
      department: "Cyber Security",
      purpose: "Network security lab revision",
      labId: "CYS",
      keyNumber: "CYS-05",
      collectedAt: at(0, 9, 40),
      returnedAt: null,
    },
    // --- Already returned ---
    {
      id: "seed-6",
      name: "Ibrahim Musa",
      personId: "CYS/2021/0712",
      department: "Cyber Security",
      purpose: "Penetration testing practical",
      labId: "CYS",
      keyNumber: "CYS-03",
      collectedAt: at(0, 8, 30),
      returnedAt: at(0, 10, 4),
    },
    {
      id: "seed-7",
      name: "Kemi Ojo",
      personId: "DS/2022/0264",
      department: "Data Science",
      purpose: "Machine learning assignment",
      labId: "DS",
      keyNumber: "DS-01",
      collectedAt: at(1, 14, 5),
      returnedAt: at(1, 17, 20),
    },
    {
      id: "seed-8",
      name: "Tunde Bakare",
      personId: "SEN/2022/0519",
      department: "Software Engineering",
      purpose: "Group project meeting",
      labId: "SEN",
      keyNumber: "SEN-02",
      collectedAt: at(1, 10, 15),
      returnedAt: at(1, 13, 40),
    },
  ];
}
