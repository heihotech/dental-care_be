const { v4: uuidv4 } = require('uuid')
const availableRoles = [
  {
    name: 'super',
    description: 'Super',
    level: 0,
  },
  {
    name: 'admin',
    description: 'Admin',
    level: 1,
  },
  {
    name: 'doctor',
    description: 'Dokter',
    level: null,
  },
  {
    name: 'nurse',
    description: 'Perawat',
    level: null,
  },
  {
    name: 'director',
    description: 'Direktur',
    level: 2,
  },
  {
    name: 'head-of-general-affairs-and-personnel',
    description: 'Kepala Bagian Umum dan Kepegawaian',
    level: 3,
  },
  {
    name: 'head-of-nursing',
    description: 'Kepala Bidang Keperawatan',
    level: 3,
  },
  {
    name: 'head-of-serving',
    description: 'Kepala Bidang Pelayanan',
    level: 3,
  },
  {
    name: 'head-of-sub-section-of-personnel',
    description: 'Kepala Sub Bagian Kepegawaian',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-finance',
    description: 'Kepala Sub Bagian Keuangan',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-planning',
    description: 'Kepala Sub Bagian Perencanaan',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-inpatient-nursing',
    description: 'Kepala Seksi Keperawatan Rawat Inap',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-outpatient-nursing',
    description: 'Kepala Seksi Keperawatan Rawat Jalan',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-outpatient',
    description: 'Kepala Seksi Rawat Jalan',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-medical-service',
    description: 'Kepala Seksi Pelayanan Medik Rawat Jalan dan Rawat Inap ',
    level: 4,
  },
  {
    name: 'head-of-sub-section-of-medical-and-non-medical-support',
    description: 'Kepala Seksi Penunjang Medik dan Non Medik ',
    level: 4,
  },
  {
    name: 'head-of-installation',
    description: 'Kepala Instalasi',
    level: 5,
  },
  {
    name: 'head-of-room',
    description: 'Kepala Ruang',
    level: 5,
  },
  {
    name: 'staff-of-sub-section-of-personnel',
    description: 'Staff Sub Bagian Kepegawaian',
    level: 6,
  },
  {
    name: 'staff-of-sub-section-of-finance',
    description: 'Staff Sub Bagian Keuangan',
    level: 6,
  },
  {
    name: 'staff-of-sub-section-of-planning',
    description: 'Staff Sub Bagian Perencanaan',
    level: 6,
  },
  {
    name: 'staff-of-installation',
    description: 'Staff Instalasi',
    level: 6,
  },
  {
    name: 'staff-of-room',
    description: 'Staff Ruang',
    level: 6,
  },
  {
    name: 'user',
    description: 'Pengguna',
    level: 99,
  },
]

let roles = []

for (let i = 0; i < availableRoles.length; i++) {
  roles.push({
    id: i + 1,
    guid: uuidv4(),
    ...availableRoles[i],
    created_at: new Date(),
    updated_at: new Date(),
  })
}

module.exports = roles
