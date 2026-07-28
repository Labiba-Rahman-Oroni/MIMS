DROP DATABASE IF EXISTS MIMS_V2;
CREATE DATABASE MIMS_V2;
USE MIMS_V2;

CREATE TABLE Patient (
    patient_id       INT PRIMARY KEY AUTO_INCREMENT,
    nid              VARCHAR(50) UNIQUE NOT NULL,
    full_name        VARCHAR(100) NOT NULL,
    date_of_birth    DATE,
    gender           ENUM('Male', 'Female', 'Other'),
    blood_group      ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    weight           DECIMAL(5,2),
    height           DECIMAL(5,2),
    phone            VARCHAR(20) UNIQUE NOT NULL,
    address          TEXT,
    emergency_contact VARCHAR(20),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Doctor (
    doctor_id        INT PRIMARY KEY AUTO_INCREMENT,
    full_name        VARCHAR(100) NOT NULL,
    license_number   VARCHAR(50) UNIQUE NOT NULL,
    phone            VARCHAR(20) UNIQUE,
    email            VARCHAR(100) UNIQUE,
    experience_years INT CHECK (experience_years >= 0),
    consultation_fee DECIMAL(10,2) CHECK (consultation_fee >= 0),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Hospital (
    hospital_id      INT PRIMARY KEY AUTO_INCREMENT,
    name             VARCHAR(100) NOT NULL,
    license_number   VARCHAR(50) UNIQUE NOT NULL,
    address          TEXT,
    phone            VARCHAR(20),
    hospital_type    ENUM('Private', 'Government') NOT NULL,
    total_beds       INT CHECK (total_beds >= 0)
);

CREATE TABLE Specialization (
    specialization_id INT PRIMARY KEY AUTO_INCREMENT,
    name              VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Generic (
    generic_id        INT PRIMARY KEY AUTO_INCREMENT,
    generic_name      VARCHAR(100) NOT NULL UNIQUE,
    description       TEXT
);

CREATE TABLE Disease (
    disease_id        INT PRIMARY KEY AUTO_INCREMENT,
    name              VARCHAR(100) NOT NULL,
    icd_code          VARCHAR(20) UNIQUE,
    description       TEXT,
    specialization_id INT NOT NULL,
    FOREIGN KEY (specialization_id) REFERENCES Specialization(specialization_id)
);

CREATE TABLE Medicine (
    medicine_id      INT PRIMARY KEY AUTO_INCREMENT,
    trade_name       VARCHAR(100) NOT NULL,
    generic_id       INT NOT NULL,
    strength_value   DECIMAL(7,2) NOT NULL,
    strength_unit    VARCHAR(10) NOT NULL,
    form             ENUM('Tablet','Capsule','Syrup','Injection','Cream','Drop') NOT NULL,
    manufacturer     VARCHAR(100),
    FOREIGN KEY (generic_id) REFERENCES Generic(generic_id)
);

CREATE TABLE DoctorSpecialization (
    doctor_id         INT NOT NULL,
    specialization_id INT NOT NULL,
    PRIMARY KEY (doctor_id, specialization_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (specialization_id) REFERENCES Specialization(specialization_id) ON DELETE CASCADE
);

CREATE TABLE DoctorSchedule (
    schedule_id  INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id    INT NOT NULL,
    hospital_id  INT NOT NULL,
    day_of_week  ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    shift_type   ENUM('Morning','Evening','Night') NOT NULL,
    UNIQUE (doctor_id, hospital_id, day_of_week, start_time),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id) ON DELETE CASCADE
);

CREATE TABLE Appointment (
    appointment_id   INT PRIMARY KEY AUTO_INCREMENT,
    patient_id       INT NOT NULL,
    doctor_id        INT NOT NULL,
    hospital_id      INT NOT NULL,
    disease_id       INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status           ENUM('Booked','Completed','Cancelled') DEFAULT 'Booked',
    token_number     INT NOT NULL,
    UNIQUE (doctor_id, hospital_id, appointment_date, token_number),
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES Disease(disease_id)
);

CREATE TABLE Prescription (
    prescription_id  INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id   INT UNIQUE NOT NULL,
    diagnosis_notes  TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
);

CREATE TABLE PrescriptionDetails (
    prescription_id  INT NOT NULL,
    medicine_id      INT NOT NULL,
    dosage           VARCHAR(50) NOT NULL,
    duration_days    INT CHECK (duration_days > 0),
    instructions     TEXT,
    PRIMARY KEY (prescription_id, medicine_id),
    FOREIGN KEY (prescription_id) REFERENCES Prescription(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES Medicine(medicine_id)
);

CREATE TABLE MedicalHistory (
    history_id       INT PRIMARY KEY AUTO_INCREMENT,
    patient_id       INT NOT NULL,
    prescription_id  INT NOT NULL,
    recorded_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes            TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES Prescription(prescription_id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_patient_phone ON Patient(phone);
CREATE INDEX idx_appointment_date ON Appointment(appointment_date);
CREATE INDEX idx_appointment_patient ON Appointment(patient_id);
CREATE INDEX idx_appointment_doctor ON Appointment(doctor_id);
CREATE INDEX idx_medicine_generic ON Medicine(generic_id);
CREATE INDEX idx_disease_specialization ON Disease(specialization_id);
CREATE INDEX idx_history_patient ON MedicalHistory(patient_id);

-- VIEW
CREATE VIEW PatientMedicalHistoryView AS
SELECT
    mh.history_id, mh.recorded_at, mh.notes,
    p.patient_id, p.full_name AS patient_name, p.blood_group,
    d.full_name AS doctor_name,
    h.name AS hospital_name, h.hospital_type,
    di.name AS disease_name, di.icd_code,
    s.name AS specialization,
    pr.diagnosis_notes, pr.created_at AS prescription_date,
    m.trade_name AS medicine_name, g.generic_name,
    m.strength_value, m.strength_unit, m.form,
    pd.dosage, pd.duration_days, pd.instructions
FROM MedicalHistory mh
JOIN Patient p        ON mh.patient_id = p.patient_id
JOIN Prescription pr  ON mh.prescription_id = pr.prescription_id
JOIN Appointment a    ON pr.appointment_id = a.appointment_id
JOIN Doctor d         ON a.doctor_id = d.doctor_id
JOIN Hospital h       ON a.hospital_id = h.hospital_id
JOIN Disease di       ON a.disease_id = di.disease_id
JOIN Specialization s ON di.specialization_id = s.specialization_id
JOIN PrescriptionDetails pd ON pr.prescription_id = pd.prescription_id
JOIN Medicine m       ON pd.medicine_id = m.medicine_id
JOIN Generic g        ON m.generic_id = g.generic_id;


USE MIMS_V2;

-- PATIENTS (20)
INSERT INTO Patient (nid, full_name, date_of_birth, gender, blood_group, weight, height, phone, address, emergency_contact) VALUES
('NID001', 'Rahim Uddin',        '1990-05-10', 'Male',   'B+',  72.5, 170.0, '01711000001', 'Dhaka, Bangladesh',        '01711000021'),
('NID002', 'Fatema Begum',       '1985-08-22', 'Female', 'A+',  58.0, 158.0, '01711000002', 'Chittagong, Bangladesh',   '01711000022'),
('NID003', 'Karim Hossain',      '2000-01-15', 'Male',   'O+',  65.0, 175.0, '01711000003', 'Sylhet, Bangladesh',       '01711000023'),
('NID004', 'Nasrin Akter',       '1995-11-30', 'Female', 'AB+', 60.0, 162.0, '01711000004', 'Rajshahi, Bangladesh',     '01711000024'),
('NID005', 'Arif Rahman',        '1978-03-18', 'Male',   'B-',  80.0, 178.0, '01711000005', 'Khulna, Bangladesh',       '01711000025'),
('NID006', 'Sumaiya Islam',      '1992-07-25', 'Female', 'O-',  55.0, 155.0, '01711000006', 'Barisal, Bangladesh',      '01711000026'),
('NID007', 'Tanvir Ahmed',       '1988-12-05', 'Male',   'A-',  75.0, 172.0, '01711000007', 'Mymensingh, Bangladesh',   '01711000027'),
('NID008', 'Roksana Khanam',     '1975-04-14', 'Female', 'B+',  63.0, 160.0, '01711000008', 'Comilla, Bangladesh',      '01711000028'),
('NID009', 'Jahangir Alam',      '1983-09-21', 'Male',   'AB-', 85.0, 180.0, '01711000009', 'Narayanganj, Bangladesh',  '01711000029'),
('NID010', 'Sharmin Sultana',    '1997-02-28', 'Female', 'A+',  52.0, 156.0, '01711000010', 'Gazipur, Bangladesh',      '01711000030'),
('NID011', 'Mahbubur Rahman',    '1970-06-11', 'Male',   'O+',  90.0, 175.0, '01711000011', 'Dhaka, Bangladesh',        '01711000031'),
('NID012', 'Nusrat Jahan',       '2001-10-19', 'Female', 'B-',  48.0, 152.0, '01711000012', 'Chittagong, Bangladesh',   '01711000032'),
('NID013', 'Mosharraf Hossain',  '1965-03-30', 'Male',   'A-',  78.0, 168.0, '01711000013', 'Sylhet, Bangladesh',       '01711000033'),
('NID014', 'Dilruba Yeasmin',    '1993-08-07', 'Female', 'O+',  57.0, 159.0, '01711000014', 'Rajshahi, Bangladesh',     '01711000034'),
('NID015', 'Shakil Mahmud',      '1987-11-23', 'Male',   'AB+', 82.0, 177.0, '01711000015', 'Khulna, Bangladesh',       '01711000035'),
('NID016', 'Tania Sultana',      '1999-05-16', 'Female', 'B+',  54.0, 157.0, '01711000016', 'Barisal, Bangladesh',      '01711000036'),
('NID017', 'Rezaul Karim',       '1980-01-09', 'Male',   'O-',  70.0, 171.0, '01711000017', 'Mymensingh, Bangladesh',   '01711000037'),
('NID018', 'Mahmuda Khatun',     '1972-07-31', 'Female', 'A+',  65.0, 163.0, '01711000018', 'Comilla, Bangladesh',      '01711000038'),
('NID019', 'Faisal Hasan',       '2003-04-12', 'Male',   'B+',  60.0, 169.0, '01711000019', 'Narayanganj, Bangladesh',  '01711000039'),
('NID020', 'Sadia Afrin',        '1996-12-25', 'Female', 'AB+', 50.0, 154.0, '01711000020', 'Gazipur, Bangladesh',      '01711000040');

-- SPECIALIZATIONS (8)
INSERT INTO Specialization (name) VALUES
('Cardiology'),
('Neurology'),
('Dermatology'),
('Orthopedics'),
('General Medicine'),
('Gastroenterology'),
('Endocrinology'),
('Pulmonology');

-- DOCTORS (10)
INSERT INTO Doctor (full_name, license_number, phone, email, experience_years, consultation_fee) VALUES
('Dr. Salim Ahmed',       'LIC-DOC-001', '01811000001', 'salim@mims.com',      15, 800.00),
('Dr. Nadia Islam',       'LIC-DOC-002', '01811000002', 'nadia@mims.com',      10, 600.00),
('Dr. Faruk Hasan',       'LIC-DOC-003', '01811000003', 'faruk@mims.com',       8, 500.00),
('Dr. Meherun Nessa',     'LIC-DOC-004', '01811000004', 'meherun@mims.com',    20, 1000.00),
('Dr. Tariq Mahmud',      'LIC-DOC-005', '01811000005', 'tariq@mims.com',      12, 700.00),
('Dr. Sanjida Parvin',    'LIC-DOC-006', '01811000006', 'sanjida@mims.com',     6, 450.00),
('Dr. Aminul Islam',      'LIC-DOC-007', '01811000007', 'aminul@mims.com',     18, 900.00),
('Dr. Rubina Akhter',     'LIC-DOC-008', '01811000008', 'rubina@mims.com',      9, 550.00),
('Dr. Habibur Rahman',    'LIC-DOC-009', '01811000009', 'habibur@mims.com',    25, 1200.00),
('Dr. Farzana Hoque',     'LIC-DOC-010', '01811000010', 'farzana@mims.com',     5, 400.00);

-- HOSPITALS (8)
INSERT INTO Hospital (name, license_number, address, phone, hospital_type, total_beds) VALUES
('Dhaka Medical College Hospital',  'HOS-LIC-001', 'Dhaka',       '02-555001', 'Government', 1000),
('Square Hospital',                 'HOS-LIC-002', 'Dhaka',       '02-555002', 'Private',     350),
('Chittagong General Hospital',     'HOS-LIC-003', 'Chittagong',  '03-555003', 'Government',  800),
('Ibn Sina Hospital',               'HOS-LIC-004', 'Dhaka',       '02-555004', 'Private',     200),
('Sylhet MAG Osmani Hospital',      'HOS-LIC-005', 'Sylhet',      '08-555005', 'Government',  600),
('Popular Medical Centre',          'HOS-LIC-006', 'Dhaka',       '02-555006', 'Private',     150),
('Rajshahi Medical College',        'HOS-LIC-007', 'Rajshahi',    '07-555007', 'Government',  700),
('Evercare Hospital',               'HOS-LIC-008', 'Dhaka',       '02-555008', 'Private',     250);

-- DOCTOR SPECIALIZATIONS
INSERT INTO DoctorSpecialization (doctor_id, specialization_id) VALUES
(1, 1), (1, 5),  -- Dr. Salim → Cardiology, General Medicine
(2, 2), (2, 8),  -- Dr. Nadia → Neurology, Pulmonology
(3, 3),          -- Dr. Faruk → Dermatology
(4, 4),          -- Dr. Meherun → Orthopedics
(5, 1), (5, 2),  -- Dr. Tariq → Cardiology, Neurology
(6, 6),          -- Dr. Sanjida → Gastroenterology
(7, 7), (7, 5),  -- Dr. Aminul → Endocrinology, General Medicine
(8, 3), (8, 6),  -- Dr. Rubina → Dermatology, Gastroenterology
(9, 1), (9, 7),  -- Dr. Habibur → Cardiology, Endocrinology
(10, 2),(10, 8); -- Dr. Farzana → Neurology, Pulmonology

-- DOCTOR SCHEDULES (20)
INSERT INTO DoctorSchedule (doctor_id, hospital_id, day_of_week, start_time, end_time, shift_type) VALUES
(1, 1, 'Monday',    '08:00:00', '14:00:00', 'Morning'),
(1, 2, 'Wednesday', '15:00:00', '20:00:00', 'Evening'),
(1, 4, 'Saturday',  '08:00:00', '14:00:00', 'Morning'),
(2, 2, 'Tuesday',   '08:00:00', '14:00:00', 'Morning'),
(2, 4, 'Thursday',  '15:00:00', '20:00:00', 'Evening'),
(3, 3, 'Monday',    '08:00:00', '14:00:00', 'Morning'),
(3, 6, 'Wednesday', '15:00:00', '20:00:00', 'Evening'),
(4, 1, 'Saturday',  '08:00:00', '14:00:00', 'Morning'),
(4, 7, 'Sunday',    '08:00:00', '14:00:00', 'Morning'),
(5, 4, 'Sunday',    '15:00:00', '20:00:00', 'Evening'),
(5, 8, 'Friday',    '08:00:00', '14:00:00', 'Morning'),
(6, 2, 'Monday',    '15:00:00', '20:00:00', 'Evening'),
(6, 6, 'Thursday',  '08:00:00', '14:00:00', 'Morning'),
(7, 1, 'Tuesday',   '08:00:00', '14:00:00', 'Morning'),
(7, 8, 'Saturday',  '15:00:00', '20:00:00', 'Evening'),
(8, 3, 'Wednesday', '08:00:00', '14:00:00', 'Morning'),
(8, 5, 'Friday',    '15:00:00', '20:00:00', 'Evening'),
(9, 1, 'Thursday',  '08:00:00', '14:00:00', 'Morning'),
(9, 2, 'Sunday',    '15:00:00', '20:00:00', 'Evening'),
(10, 5,'Monday',    '08:00:00', '14:00:00', 'Morning'),
(10, 7,'Wednesday', '15:00:00', '20:00:00', 'Evening');

-- GENERICS (10)
INSERT INTO Generic (generic_name, description) VALUES
('Paracetamol',     'Common pain reliever and fever reducer'),
('Amlodipine',      'Calcium channel blocker for hypertension'),
('Metformin',       'Oral diabetes medication'),
('Cetirizine',      'Antihistamine for allergies and eczema'),
('Atorvastatin',    'Statin for cholesterol management'),
('Omeprazole',      'Proton pump inhibitor for acid reflux'),
('Salbutamol',      'Bronchodilator for asthma'),
('Losartan',        'ARB for hypertension'),
('Sertraline',      'SSRI antidepressant'),
('Amoxicillin',     'Broad spectrum antibiotic');

-- DISEASES (10)
INSERT INTO Disease (name, icd_code, description, specialization_id) VALUES
('Hypertension',        'I10',  'High blood pressure',              1),
('Migraine',            'G43',  'Recurring headache disorder',      2),
('Eczema',              'L20',  'Chronic skin inflammation',        3),
('Fracture',            'S72',  'Broken bone',                      4),
('Diabetes Type 2',     'E11',  'Insulin resistance condition',     7),
('Atrial Fibrillation', 'I48',  'Irregular heart rhythm',           1),
('Epilepsy',            'G40',  'Seizure disorder',                 2),
('Acid Reflux',         'K21',  'Gastroesophageal reflux disease',  6),
('Asthma',              'J45',  'Chronic airway inflammation',      8),
('Hyperlipidemia',      'E78',  'High cholesterol levels',          5);

-- MEDICINES (20)
INSERT INTO Medicine (trade_name, generic_id, strength_value, strength_unit, form, manufacturer) VALUES
('Napa',        1, 500.00, 'mg',  'Tablet',  'Beximco Pharma'),
('Ace',         1, 500.00, 'mg',  'Tablet',  'Square Pharma'),
('Napa Extra',  1, 665.00, 'mg',  'Tablet',  'Beximco Pharma'),
('Paracet',     1, 500.00, 'mg',  'Tablet',  'ACI Pharma'),
('Amdocal',     2,   5.00, 'mg',  'Tablet',  'ACI Pharma'),
('Amcard',      2,   5.00, 'mg',  'Tablet',  'Square Pharma'),
('Amlovas',     2,   5.00, 'mg',  'Tablet',  'Opsonin Pharma'),
('Glucomin',    3, 500.00, 'mg',  'Tablet',  'Opsonin Pharma'),
('Diabet',      3, 500.00, 'mg',  'Tablet',  'Beximco Pharma'),
('Alatrol',     4,  10.00, 'mg',  'Tablet',  'Square Pharma'),
('Cetigen',     4,  10.00, 'mg',  'Tablet',  'General Pharma'),
('Atova',       5,  20.00, 'mg',  'Tablet',  'ACI Pharma'),
('Lipitor',     5,  20.00, 'mg',  'Tablet',  'Pfizer'),
('Losectil',    6,  20.00, 'mg',  'Capsule', 'Square Pharma'),
('Omeprazol',   6,  20.00, 'mg',  'Capsule', 'Beximco Pharma'),
('Sultolin',    7, 100.00, 'mcg', 'Capsule', 'GlaxoSmithKline'),
('Asthalin',    7, 100.00, 'mcg', 'Capsule', 'Cipla'),
('Losartan',    8,  50.00, 'mg',  'Tablet',  'Beximco Pharma'),
('Lozar',       8,  50.00, 'mg',  'Tablet',  'Square Pharma'),
('Zosert',      9,  50.00, 'mg',  'Tablet',  'Sun Pharma');

-- APPOINTMENTS (20)
INSERT INTO Appointment (patient_id, doctor_id, hospital_id, disease_id, appointment_date, appointment_time, status, token_number) VALUES
(1,  1, 1, 1,  '2025-01-10', '09:00:00', 'Completed', 1),
(2,  2, 2, 2,  '2025-01-11', '10:00:00', 'Completed', 1),
(3,  3, 3, 3,  '2025-01-12', '09:30:00', 'Completed', 1),
(4,  4, 1, 4,  '2025-01-13', '11:00:00', 'Completed', 2),
(5,  7, 1, 5,  '2025-01-14', '08:30:00', 'Completed', 3),
(6,  6, 2, 8,  '2025-01-15', '15:30:00', 'Completed', 1),
(7,  5, 4, 6,  '2025-01-16', '16:00:00', 'Completed', 1),
(8,  2, 4, 7,  '2025-01-17', '15:30:00', 'Completed', 1),
(9,  9, 1, 1,  '2025-01-18', '09:00:00', 'Completed', 4),
(10, 7, 1, 5,  '2025-01-19', '10:00:00', 'Completed', 5),
(11, 1, 2, 10, '2025-01-20', '15:00:00', 'Completed', 2),
(12, 3, 6, 3,  '2025-01-21', '15:30:00', 'Completed', 1),
(13, 4, 7, 4,  '2025-01-22', '09:00:00', 'Completed', 1),
(14, 6, 6, 8,  '2025-01-23', '08:30:00', 'Completed', 2),
(15, 5, 8, 9,  '2025-01-24', '08:00:00', 'Completed', 1),
(16, 9, 2, 6,  '2025-02-01', '15:30:00', 'Completed', 1),
(17, 1, 4, 1,  '2025-02-05', '08:00:00', 'Completed', 1),
(18, 8, 5, 3,  '2025-02-10', '15:00:00', 'Completed', 1),
(1,  5, 8, 6,  '2025-06-01', '08:00:00', 'Booked',    1),
(2,  10,5, 9,  '2025-06-02', '08:00:00', 'Booked',    1);

-- PRESCRIPTIONS (18 - only completed appointments)
INSERT INTO Prescription (appointment_id, diagnosis_notes) VALUES
(1,  'Stage 1 hypertension. Start Amlodipine.'),
(2,  'Chronic migraine. Paracetamol for acute relief.'),
(3,  'Mild eczema on forearms. Cetirizine prescribed.'),
(4,  'Hairline fracture left femur. Rest advised.'),
(5,  'Type 2 Diabetes confirmed. Starting Metformin.'),
(6,  'Acid reflux diagnosed. Omeprazole prescribed.'),
(7,  'Atrial fibrillation detected. Monitor closely.'),
(8,  'Epilepsy confirmed. Follow up in 2 weeks.'),
(9,  'Hypertension stage 2. Losartan added.'),
(10, 'Diabetes follow-up. Dosage increased.'),
(11, 'High cholesterol. Atorvastatin started.'),
(12, 'Eczema worsening. Cetirizine dose adjusted.'),
(13, 'Fracture healing. Continue rest.'),
(14, 'Acid reflux improving. Continue Omeprazole.'),
(15, 'Asthma attack. Salbutamol inhaler prescribed.'),
(16, 'Atrial fibrillation follow-up. Stable.'),
(17, 'Hypertension controlled. Continue medication.'),
(18, 'Skin rash. Cetirizine prescribed.');

-- PRESCRIPTION DETAILS
INSERT INTO PrescriptionDetails (prescription_id, medicine_id, dosage, duration_days, instructions) VALUES
(1,  5,  '1 tablet once daily',   30, 'Take in the morning with water'),
(2,  1,  '1 tablet every 8 hrs',   7, 'Take after meals'),
(3,  10, '1 tablet once daily',   14, 'Take at night'),
(4,  1,  '1 tablet every 6 hrs',   5, 'Take only when pain is severe'),
(5,  8,  '1 tablet twice daily',  90, 'Take with meals, monitor blood sugar'),
(6,  14, '1 capsule once daily',  30, 'Take 30 mins before breakfast'),
(7,  18, '1 tablet once daily',   30, 'Take in the morning'),
(8,  1,  '1 tablet every 8 hrs',   7, 'Take after meals for pain'),
(9,  18, '1 tablet once daily',   60, 'Take in the morning with water'),
(9,  5,  '1 tablet once daily',   60, 'Take in the evening'),
(10, 8,  '1 tablet twice daily', 180, 'Take with meals'),
(10, 12, '1 tablet once daily',  180, 'Take at night'),
(11, 12, '1 tablet once daily',   90, 'Take at night with water'),
(12, 10, '1 tablet once daily',   21, 'Take at night'),
(13, 1,  '1 tablet every 6 hrs',   7, 'Take only when pain is severe'),
(14, 15, '1 capsule once daily',  30, 'Continue same dosage'),
(15, 16, '2 puffs when needed',   30, 'Use during asthma attacks'),
(16, 18, '1 tablet once daily',   60, 'Continue monitoring'),
(17, 5,  '1 tablet once daily',   60, 'Continue morning dose'),
(18, 10, '1 tablet once daily',   14, 'Take at night');

-- MEDICAL HISTORY
INSERT INTO MedicalHistory (patient_id, prescription_id, notes) VALUES
(1,  1,  'First visit. Hypertension diagnosed.'),
(2,  2,  'Chronic migraine. Follow-up in 1 month.'),
(3,  3,  'Skin condition improving slowly.'),
(4,  4,  'X-ray confirmed hairline fracture.'),
(5,  5,  'HbA1c test recommended next visit.'),
(6,  6,  'Acid reflux confirmed by endoscopy.'),
(7,  7,  'ECG showed irregular rhythm.'),
(8,  8,  'EEG scheduled for next visit.'),
(9,  9,  'Blood pressure very high. Two medications started.'),
(10, 10, 'Blood sugar improving with Metformin.'),
(11, 11, 'LDL cholesterol above normal range.'),
(12, 12, 'Eczema spreading. Dosage adjusted.'),
(13, 13, 'Fracture healing well. Minimal pain.'),
(14, 14, 'Symptoms reduced. Continue treatment.'),
(15, 15, 'Severe asthma attack. Inhaler prescribed.'),
(16, 16, 'Heart rhythm stabilizing. Good progress.'),
(17, 17, 'BP now controlled. Maintain medication.'),
(18, 18, 'Skin rash due to allergy. Improving.');