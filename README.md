# ✈️ SkyQuest Zambia — Commercial Flight Booking & Reservation System

An enterprise-grade, responsive full-stack flight reservation, ticketing, and airline operations management system tailored for the Zambian commercial aviation network.

---

## 🌟 Key Features

### 🇿🇲 Zambian Domestic & Regional Flight Network
- **Primary Sectors**: 
  - Lusaka (Kenneth Kaunda International - LUN)
  - Livingstone (Harry Mwaanga Nkumbula / Victoria Falls - LVI)
  - Ndola (Simon Mwansa Kapwepwe - NLA)
  - Mfuwe (South Luangwa Safari - MFU)
  - Regional: Johannesburg (O.R. Tambo - JNB)
- **Currency**: Native Zambian Kwacha (`ZMW / K`).
- **Luggage Allowance**: Standardized 23kg check-in bag (*Chitundu*) + 7kg hand luggage.

### 📱 Local Payment Processing
- Integrated support for **MTN Mobile Money**, **Airtel Money Zambia**, **Zamtel Kwacha**, and Visa/Mastercard debit/credit cards with country dial code `+260`.

### 🎟️ Scannable Electronic Boarding Pass & ZRA Tax Receipt
- Instant generation of an official **Zambian Fiscal Tax Receipt & Boarding Itinerary**.
- Embedded **dynamic, high-density optical QR Code** verifiable with any standard mobile phone camera or airport terminal scanner.
- Downloadable **A4 PDF Boarding Pass** generated on-the-fly via PDFKit.

### 🛡️ Role-Based Access Control (RBAC) & Security
- **Master Administrator**: Full access to global telemetry, financial turnover, scheduled flight dispatching, flight cancellations/delays, and customer management.
- **Airport Staff / Agent**: Create bookings on behalf of passengers, verify manifests, and re-issue boarding passes.
- **Passenger / Customer**: Search flights, select cabin seats on an interactive Boeing 787 / Dash 8 map, manage itineraries, and print receipts.
- **Data Protection**: Zero raw card/CVV storage, parameterized SQL queries, bcrypt password hashing, and tokenized JWT sessions.

---

## 🚀 Quick Setup & Installation

### 1. Database Setup
```bash
cd database
mysql -u root -p < schema.sql
mysql -u root -p < zambia_seed.sql
