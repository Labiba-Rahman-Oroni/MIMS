# MIMS
⸻

🏥 PROJECT TITLE

Medical Information Management System (MIMS)

⸻

📄 PROJECT DESCRIPTION

🔹 Introduction

The Medical Information Management System (MIMS) is a database-driven system designed to efficiently manage healthcare data related to patients, doctors, hospitals, appointments, prescriptions, and medicines. The system ensures proper organization, retrieval, and management of medical information to support better healthcare services.

⸻

🔹 Objectives

The main objectives of this system are:

* To maintain structured records of patients and their medical information
* To manage doctor details, specializations, and hospital schedules
* To facilitate appointment booking between patients and doctors
* To store prescriptions and prescribed medicines
* To support medicine substitution using generic composition
* To maintain patient medical history for future reference

⸻

🔹 System Overview

The system consists of several interconnected modules:

👤 Patient Management

Stores patient information including personal details, contact, and physical attributes like weight and height. Each patient is linked to a medical history.

⸻

👨‍⚕️ Doctor & Specialization

Doctors are registered with unique license numbers. Each doctor can have multiple specializations, and each specialization can be associated with multiple doctors.

⸻

🏥 Hospital & Scheduling

Doctors can work in multiple hospitals at different times. This is managed through a DoctorSchedule entity which records working days and time slots.

⸻

📅 Appointment System

Patients can book appointments with doctors in specific hospitals. Each appointment has a status and token number.

⸻

📄 Prescription System

Each appointment generates exactly one prescription. The prescription contains diagnosis notes and prescribed medicines.

⸻

💊 Medicine & Generic System

Each medicine belongs to a generic (compound). If a specific medicine is unavailable, alternative medicines with the same generic and strength can be suggested.

⸻

🏥 Medical History

Each patient has a medical history that stores all prescriptions over time, allowing doctors to review past treatments.

⸻

🔹 Key Features

* Doctor suggestion based on specialization
* Medicine substitution using generic composition
* Multi-hospital doctor scheduling
* Structured appointment system
* Centralized patient medical history

⸻

🔹 Database Design Concepts Used

* Entity-Relationship modeling
* Normalization (up to 3NF)
* Primary and Foreign Keys
* Many-to-Many relationships resolved using associative tables
* Constraints (UNIQUE, CHECK, NOT NULL)
