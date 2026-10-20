export const occupancyTrend = [
  { date: "09 out", observation: 72, emergency: 67, pediatrics: 50, exact: 71, legacy: 74 },
  { date: "10 out", observation: 78, emergency: 83, pediatrics: 50, exact: 78, legacy: 80 },
  { date: "11 out", observation: 83, emergency: 100, pediatrics: 100, exact: 86, legacy: 88 },
  { date: "12 out", observation: 76, emergency: 83, pediatrics: 50, exact: 76, legacy: 79 },
  { date: "13 out", observation: 88, emergency: 100, pediatrics: 50, exact: 87, legacy: 91 },
  { date: "14 out", observation: 81, emergency: 83, pediatrics: 100, exact: 82, legacy: 85 },
  { date: "15 out", observation: 70, emergency: 67, pediatrics: 50, exact: 69, legacy: 72 },
  { date: "16 out", observation: 79, emergency: 83, pediatrics: 50, exact: 79, legacy: 82 },
  { date: "17 out", observation: 92, emergency: 100, pediatrics: 100, exact: 93, legacy: 96 },
  { date: "18 out", observation: 86, emergency: 83, pediatrics: 50, exact: 84, legacy: 88 },
  { date: "19 out", observation: 88, emergency: 100, pediatrics: 50, exact: 89, legacy: 92 },
  { date: "20 out", observation: 83, emergency: 83, pediatrics: 100, exact: 84, legacy: 87 },
];

export const currentOccupancy = [
  { name: "Ocupados", value: 27, color: "#2388c4" },
  { name: "Disponíveis", value: 5, color: "#dceaf1" },
];

export const observationBySpecialty = [
  { specialty: "Clínica médica", under24: 8, over24: 4 },
  { specialty: "Ortopedia", under24: 3, over24: 2 },
  { specialty: "Cirurgia", under24: 2, over24: 1 },
  { specialty: "Psiquiatria", under24: 1, over24: 2 },
  { specialty: "Outras", under24: 3, over24: 0 },
];

export const emergencyStay = [
  { name: "Até 24 horas", value: 4, color: "#42a779" },
  { name: "Acima de 24 horas", value: 1, color: "#e39b4d" },
];

export const transfersBySpecialty = [
  { specialty: "Clínica médica", transfers: 12, averageHours: 3.8 },
  { specialty: "Ortopedia", transfers: 7, averageHours: 4.6 },
  { specialty: "Cirurgia", transfers: 5, averageHours: 3.1 },
  { specialty: "Psiquiatria", transfers: 4, averageHours: 7.2 },
  { specialty: "Pediatria", transfers: 3, averageHours: 2.4 },
];

export const transferDestinations = [
  { destination: "Hospital regional", value: 11, color: "#163c68" },
  { destination: "Santa Casa", value: 8, color: "#2388c4" },
  { destination: "Complexo hospitalar", value: 6, color: "#57b6d8" },
  { destination: "Outros", value: 6, color: "#9fcfe3" },
];

export const regulationTimes = [
  { date: "14 out", removal: 2.8, zeroBed: 4.9 },
  { date: "15 out", removal: 2.3, zeroBed: 4.4 },
  { date: "16 out", removal: 2.6, zeroBed: 5.2 },
  { date: "17 out", removal: 3.1, zeroBed: 6.3 },
  { date: "18 out", removal: 2.5, zeroBed: 4.7 },
  { date: "19 out", removal: 2.1, zeroBed: 4.2 },
  { date: "20 out", removal: 2.3, zeroBed: 4.5 },
];

export const externalCts = [
  { week: "Sem 1", requested: 7, performed: 6 },
  { week: "Sem 2", requested: 10, performed: 9 },
  { week: "Sem 3", requested: 8, performed: 8 },
  { week: "Sem 4", requested: 12, performed: 10 },
];

export const patientBedDays = [
  { date: "14 out", bedDays: 28, patientDays: 23 },
  { date: "15 out", bedDays: 29, patientDays: 25 },
  { date: "16 out", bedDays: 30, patientDays: 24 },
  { date: "17 out", bedDays: 31, patientDays: 29 },
  { date: "18 out", bedDays: 30, patientDays: 27 },
  { date: "19 out", bedDays: 32, patientDays: 29 },
  { date: "20 out", bedDays: 32, patientDays: 27 },
];

export const turnoverBySector = [
  { sector: "Observação", turnover: 2.6, stay: 0.8 },
  { sector: "Emergência", turnover: 3.8, stay: 0.5 },
  { sector: "Pediatria", turnover: 2.1, stay: 0.7 },
];

export const exitsBreakdown = [
  { name: "Alta", value: 42, color: "#42a779" },
  { name: "Transferência", value: 18, color: "#2388c4" },
  { name: "Evasão", value: 5, color: "#e39b4d" },
  { name: "Óbito", value: 2, color: "#be6660" },
];

export const averageStayTrend = [
  { date: "14 out", hours: 9.4, over24: 5 },
  { date: "15 out", hours: 8.8, over24: 4 },
  { date: "16 out", hours: 9.1, over24: 6 },
  { date: "17 out", hours: 10.6, over24: 8 },
  { date: "18 out", hours: 9.7, over24: 7 },
  { date: "19 out", hours: 8.9, over24: 5 },
  { date: "20 out", hours: 8.7, over24: 4 },
];
