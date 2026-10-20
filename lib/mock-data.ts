export const patients = [
  {
    id: "AT-263841",
    name: "Paciente demonstrativo 01",
    initials: "PD",
    bed: "OBS-04",
    sector: "Observação",
    specialty: "Clínica médica",
    diagnosis: "Dor abdominal em investigação",
    admission: "19/10 • 22:14",
    stay: "8h 16min",
    status: "Estável",
  },
  {
    id: "AT-263837",
    name: "Paciente demonstrativo 02",
    initials: "PD",
    bed: "EME-02",
    sector: "Emergência",
    specialty: "Clínica médica",
    diagnosis: "Dispneia aguda",
    admission: "19/10 • 20:51",
    stay: "9h 39min",
    status: "Atenção",
  },
  {
    id: "AT-263829",
    name: "Paciente demonstrativo 03",
    initials: "PD",
    bed: "PED-01",
    sector: "Pediatria",
    specialty: "Pediatria",
    diagnosis: "Síndrome febril",
    admission: "19/10 • 18:07",
    stay: "12h 23min",
    status: "Estável",
  },
  {
    id: "AT-263816",
    name: "Paciente demonstrativo 04",
    initials: "PD",
    bed: "OBS-12",
    sector: "Observação",
    specialty: "Ortopedia",
    diagnosis: "Trauma de membro inferior",
    admission: "19/10 • 15:42",
    stay: "14h 48min",
    status: "Aguardando vaga",
  },
  {
    id: "AT-263802",
    name: "Paciente demonstrativo 05",
    initials: "PD",
    bed: "OBS-18",
    sector: "Observação",
    specialty: "Clínica médica",
    diagnosis: "Crise hipertensiva",
    admission: "19/10 • 11:25",
    stay: "19h 05min",
    status: "Estável",
  },
];

export const censusHistory = [
  { time: "06:30", date: "20 out 2026", patients: 27, occupancy: "84%", status: "Em revisão", owner: "Mariana Costa" },
  { time: "00:30", date: "20 out 2026", patients: 25, occupancy: "78%", status: "Fechado", owner: "João Ribeiro" },
  { time: "18:30", date: "19 out 2026", patients: 29, occupancy: "91%", status: "Fechado", owner: "Mariana Costa" },
  { time: "12:30", date: "19 out 2026", patients: 24, occupancy: "75%", status: "Fechado", owner: "Carla Nunes" },
  { time: "06:30", date: "19 out 2026", patients: 22, occupancy: "69%", status: "Reaberto", owner: "João Ribeiro" },
];

export const movements = [
  { time: "06:12", patient: "Paciente demonstrativo 05", event: "Mudança de leito", detail: "OBS-16 → OBS-18", author: "Mariana Costa" },
  { time: "05:48", patient: "Paciente demonstrativo 04", event: "Vaga solicitada", detail: "Ortopedia • Hospital de referência", author: "Mariana Costa" },
  { time: "04:25", patient: "Paciente demonstrativo 03", event: "Admissão", detail: "Pediatria • PED-01", author: "João Ribeiro" },
  { time: "03:51", patient: "Paciente demonstrativo 02", event: "Mudança de setor", detail: "Observação → Emergência", author: "João Ribeiro" },
  { time: "02:36", patient: "Paciente demonstrativo 06", event: "Alta", detail: "Alta médica", author: "João Ribeiro" },
];

export const auditEvents = [
  { date: "20/10/2026 06:18", user: "Mariana Costa", action: "Atualizou paciente", target: "AT-263841", result: "Concluído", origin: "10.20.4.18" },
  { date: "20/10/2026 06:12", user: "Mariana Costa", action: "Registrou movimentação", target: "AT-263802", result: "Concluído", origin: "10.20.4.18" },
  { date: "20/10/2026 05:58", user: "João Ribeiro", action: "Exportou censo", target: "Censo 00:30", result: "Concluído", origin: "10.20.4.22" },
  { date: "20/10/2026 05:41", user: "Mariana Costa", action: "Tentou fechar censo", target: "Censo 06:30", result: "Bloqueado", origin: "10.20.4.18" },
  { date: "20/10/2026 05:12", user: "Admin WayNIR", action: "Alterou capacidade", target: "Emergência: 5 → 6", result: "Concluído", origin: "10.20.4.10" },
];

export const occupancySeries = [
  { hour: "00:30", observation: 75, emergency: 83, pediatrics: 50 },
  { hour: "06:30", observation: 79, emergency: 100, pediatrics: 50 },
  { hour: "12:30", observation: 71, emergency: 83, pediatrics: 100 },
  { hour: "18:30", observation: 88, emergency: 100, pediatrics: 50 },
  { hour: "Agora", observation: 83, emergency: 83, pediatrics: 100 },
];

export const exitsByType = [
  { type: "Alta", value: 42 },
  { type: "Transferência", value: 18 },
  { type: "Evasão", value: 5 },
  { type: "Óbito", value: 2 },
];
