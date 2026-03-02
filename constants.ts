
import { Medicine, UserProfile, Gender } from './types';

export const APP_NAME = "AI Pharmacist";

// A high-quality SVG data URI for the default blue profile icon
export const DEFAULT_PROFILE_IMAGE = '/assests/Monalisa.png';

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Napa',
    genericName: 'Paracetamol',
    description: 'Analgesic and antipyretic used to treat fever and mild to moderate pain.',
    uses: 'Paracetamol is used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    dosage: {
        adults: '500-1000mg every 4-6 hours',
        children: '10-15mg/kg every 4-6 hours',
        maximum: '4000mg per day'
    },
    sideEffects: ['Nausea', 'Allergic reactions (rare)', 'Liver damage (with overdose)'],
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    source: 'Medex',
    medexId: '13474/napa-500mg-tablet' // Real example ID
  },
  {
    id: '2',
    name: 'Seclo',
    genericName: 'Omeprazole',
    description: 'Proton pump inhibitor used to treat heartburn, stomach ulcers, and GERD.',
    uses: 'Used for relief of signs and symptoms of gastric ulcers and acidity.',
    dosage: {
        adults: '20mg once daily',
        children: '10mg once daily',
        maximum: '40mg per day'
    },
    sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Stomach pain'],
    manufacturer: 'Square Pharmaceuticals Ltd.',
    source: 'Medex',
    medexId: '12403/seclo-20mg-capsule'
  },
  {
    id: '3',
    name: 'Alatrol',
    genericName: 'Cetirizine Hydrochloride',
    description: 'Antihistamine used to relieve allergy symptoms.',
    uses: 'Relief of nasal and ocular symptoms of seasonal and perennial allergic rhinitis.',
    dosage: {
        adults: '10mg once daily',
        children: '2.5-5mg once daily',
        maximum: '10mg per day'
    },
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    manufacturer: 'Square Pharmaceuticals Ltd.',
    source: 'Medex',
    medexId: '12745/alatrol-10mg-tablet'
  }
];

export const COMMON_CONDITIONS = [
  { name: 'Fever' },
  { name: 'Headache' },
  { name: 'Cold & Flu' },
  { name: 'Allergies' },
  { name: 'Stomach Pain' },
];

export const SAFETY_DISCLAIMER_TEXT = `
1. Service Description
AI Pharmacist is an AI-powered health guidance platform that provides preliminary health assessments, medication information, and general health advice.

2. Medical Disclaimer
The information provided is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.

3. User Responsibilities
You are responsible for providing accurate health information and following appropriate medical care protocols.

4. Privacy Policy
We collect and process your health data to provide personalized health guidance. Your data is encrypted and stored securely.
`;

export const EMPTY_USER_PROFILE: UserProfile = {
  name: 'Monalisa Bargman',
  email: 'monalisabargman58@gmail.com',
  phone: '+880 1234567890',
  photoUrl: '/assests/Monalisa.png',
  dob: '2002-05-07',
  gender: Gender.FEMALE,
  height: '165',
  weight: '48',
  bloodGroup: 'A+',
  bloodPressure: '120/80',
  allergies: ['Penicillin'],
  conditions: [{ name: 'Hypertension', since: '2020', medication: 'Lisinopril', status: 'Ongoing' }],
  emergencyContact: { name: 'John Doe', phone: '+880 1999999999' },
  shareLocation: true
};
