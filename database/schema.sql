CREATE DATABASE IF NOT EXISTS `skyquest_airline` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `skyquest_airline`;

-- 1. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'customer', 'staff') NOT NULL DEFAULT 'customer',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB;

-- 2. CUSTOMERS
CREATE TABLE IF NOT EXISTS `customers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `passport_number` VARCHAR(50) NULL,
  `passport_expiry` DATE NULL,
  `nationality` VARCHAR(50) NULL,
  `date_of_birth` DATE NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. STAFF
CREATE TABLE IF NOT EXISTS `staff` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `employee_code` VARCHAR(50) NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `station_code` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. AIRPORTS
CREATE TABLE IF NOT EXISTS `airports` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `iata_code` VARCHAR(3) NOT NULL UNIQUE,
  `icao_code` VARCHAR(4) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `timezone` VARCHAR(50) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX `idx_airports_iata` (`iata_code`),
  INDEX `idx_airports_city` (`city`)
) ENGINE=InnoDB;

-- 5. AIRLINES
CREATE TABLE IF NOT EXISTS `airlines` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `iata_code` VARCHAR(2) NOT NULL UNIQUE,
  `icao_code` VARCHAR(3) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `logo_url` VARCHAR(255) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 6. AIRCRAFT
CREATE TABLE IF NOT EXISTS `aircraft` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `airline_id` BIGINT UNSIGNED NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `tail_number` VARCHAR(50) NOT NULL UNIQUE,
  `total_economy_seats` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_business_seats` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_first_seats` INT UNSIGNED NOT NULL DEFAULT 0,
  `seating_layout_config` JSON NULL,
  CONSTRAINT `fk_aircraft_airline` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. FLIGHTS
CREATE TABLE IF NOT EXISTS `flights` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `flight_number` VARCHAR(20) NOT NULL,
  `airline_id` BIGINT UNSIGNED NOT NULL,
  `aircraft_id` BIGINT UNSIGNED NOT NULL,
  `departure_airport_id` BIGINT UNSIGNED NOT NULL,
  `arrival_airport_id` BIGINT UNSIGNED NOT NULL,
  `departure_time` DATETIME NOT NULL,
  `arrival_time` DATETIME NOT NULL,
  `flight_duration_minutes` INT UNSIGNED NOT NULL,
  `base_price_economy` DECIMAL(10, 2) NOT NULL,
  `base_price_business` DECIMAL(10, 2) NOT NULL,
  `base_price_first` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('scheduled', 'boarding', 'departed', 'delayed', 'cancelled', 'completed') NOT NULL DEFAULT 'scheduled',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_flights_search` (`departure_airport_id`, `arrival_airport_id`, `departure_time`),
  CONSTRAINT `fk_flights_airline` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`),
  CONSTRAINT `fk_flights_aircraft` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`id`),
  CONSTRAINT `fk_flights_dept_port` FOREIGN KEY (`departure_airport_id`) REFERENCES `airports` (`id`),
  CONSTRAINT `fk_flights_arr_port` FOREIGN KEY (`arrival_airport_id`) REFERENCES `airports` (`id`)
) ENGINE=InnoDB;

-- 8. SEATS
CREATE TABLE IF NOT EXISTS `seats` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `flight_id` BIGINT UNSIGNED NOT NULL,
  `seat_number` VARCHAR(10) NOT NULL,
  `cabin_class` ENUM('economy', 'business', 'first') NOT NULL,
  `status` ENUM('available', 'held', 'booked', 'blocked') NOT NULL DEFAULT 'available',
  `held_until` DATETIME NULL,
  `price_multiplier` DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  CONSTRAINT `fk_seats_flight` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_flight_seat` (`flight_id`, `seat_number`),
  INDEX `idx_seat_status` (`flight_id`, `status`)
) ENGINE=InnoDB;

-- 9. BOOKINGS
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pnr` VARCHAR(6) NOT NULL UNIQUE,
  `customer_id` BIGINT UNSIGNED NOT NULL,
  `booking_agent_id` BIGINT UNSIGNED NULL,
  `outbound_flight_id` BIGINT UNSIGNED NOT NULL,
  `return_flight_id` BIGINT UNSIGNED NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `tax_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bookings_pnr` (`pnr`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_bookings_agent` FOREIGN KEY (`booking_agent_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bookings_outbound` FOREIGN KEY (`outbound_flight_id`) REFERENCES `flights` (`id`),
  CONSTRAINT `fk_bookings_return` FOREIGN KEY (`return_flight_id`) REFERENCES `flights` (`id`)
) ENGINE=InnoDB;

-- 10. PASSENGERS
CREATE TABLE IF NOT EXISTS `passengers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('male', 'female', 'other') NOT NULL,
  `passport_number` VARCHAR(50) NULL,
  `passport_expiry` DATE NULL,
  `nationality` VARCHAR(50) NOT NULL,
  `seat_id` BIGINT UNSIGNED NULL,
  CONSTRAINT `fk_passengers_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_passengers_seat` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS `payments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `payment_reference` VARCHAR(100) NOT NULL UNIQUE,
  `gateway` ENUM('stripe', 'card', 'mobile_money') NOT NULL,
  `gateway_transaction_id` VARCHAR(150) NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `status` ENUM('pending', 'successful', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `raw_response` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB;

-- 12. TICKETS
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_number` VARCHAR(20) NOT NULL UNIQUE,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `passenger_id` BIGINT UNSIGNED NOT NULL,
  `flight_id` BIGINT UNSIGNED NOT NULL,
  `seat_id` BIGINT UNSIGNED NOT NULL,
  `e_ticket_url` VARCHAR(255) NULL,
  `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tickets_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_passenger` FOREIGN KEY (`passenger_id`) REFERENCES `passengers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_flight` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`id`),
  CONSTRAINT `fk_tickets_seat` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`)
) ENGINE=InnoDB;

-- 13. CANCELLATIONS
CREATE TABLE IF NOT EXISTS `cancellations` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `reason` TEXT NOT NULL,
  `cancellation_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `cancelled_by_user_id` BIGINT UNSIGNED NOT NULL,
  `cancelled_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cancellations_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `fk_cancellations_user` FOREIGN KEY (`cancelled_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- 14. REFUNDS
CREATE TABLE IF NOT EXISTS `refunds` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `payment_id` BIGINT UNSIGNED NOT NULL,
  `booking_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'processed', 'declined') NOT NULL DEFAULT 'pending',
  `processed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_refunds_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  CONSTRAINT `fk_refunds_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB;

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info', 'flight_alert', 'payment', 'ticket') NOT NULL DEFAULT 'info',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. SYSTEM_SETTINGS
CREATE TABLE IF NOT EXISTS `system_settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `value` TEXT NOT NULL,
  `description` VARCHAR(255) NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- INITIAL SEED RECORDS
INSERT IGNORE INTO `system_settings` (`key_name`, `value`, `description`) VALUES
('tax_rate', '0.075', 'Airport & Aviation Fuel Tax (7.5%)'),
('booking_hold_timeout_minutes', '15', 'Timeout in minutes for held seats during booking'),
('currency_code', 'USD', 'Operating Base Currency');

INSERT IGNORE INTO `airports` (`iata_code`, `icao_code`, `name`, `city`, `country`, `timezone`, `latitude`, `longitude`) VALUES
('JFK', 'KJFK', 'John F. Kennedy International', 'New York', 'United States', 'America/New_York', 40.6413, -73.7781),
('LHR', 'EGLL', 'Heathrow Airport', 'London', 'United Kingdom', 'Europe/London', 51.4700, -0.4543),
('DXB', 'OMDB', 'Dubai International', 'Dubai', 'United Arab Emirates', 'Asia/Dubai', 25.2532, 55.3657),
('NBO', 'HKJK', 'Jomo Kenyatta International', 'Nairobi', 'Kenya', 'Africa/Nairobi', -1.3192, 36.9275);

INSERT IGNORE INTO `airlines` (`iata_code`, `icao_code`, `name`, `logo_url`) VALUES
('SQ', 'SQA', 'SkyQuest International', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=128'),
('BA', 'BAW', 'British Airways', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=128');

INSERT IGNORE INTO `aircraft` (`airline_id`, `model`, `tail_number`, `total_economy_seats`, `total_business_seats`, `total_first_seats`) VALUES
(1, 'Boeing 787-9 Dreamliner', 'N789SQ', 216, 42, 8);

-- Seed Sample Scheduled Flight
INSERT IGNORE INTO `flights` 
(`id`, `flight_number`, `airline_id`, `aircraft_id`, `departure_airport_id`, `arrival_airport_id`, `departure_time`, `arrival_time`, `flight_duration_minutes`, `base_price_economy`, `base_price_business`, `base_price_first`, `status`)
VALUES 
(1, 'SQ-101', 1, 1, 1, 2, '2026-11-15 18:30:00', '2026-11-16 06:45:00', 435, 450.00, 1250.00, 3100.00, 'scheduled');

-- Seed Seats for SQ-101
INSERT IGNORE INTO `seats` (`flight_id`, `seat_number`, `cabin_class`, `status`, `price_multiplier`) VALUES
(1, '1A', 'first', 'available', 1.00), (1, '1B', 'first', 'available', 1.00),
(1, '5A', 'business', 'available', 1.00), (1, '5B', 'business', 'available', 1.00),
(1, '10A', 'economy', 'available', 1.00), (1, '10B', 'economy', 'available', 1.00),
(1, '10C', 'economy', 'available', 1.00), (1, '10D', 'economy', 'available', 1.00),
(1, '10E', 'economy', 'available', 1.00), (1, '10F', 'economy', 'available', 1.00),
(1, '11A', 'economy', 'available', 1.00), (1, '11B', 'economy', 'booked', 1.00),
(1, '11C', 'economy', 'available', 1.00), (1, '11D', 'economy', 'available', 1.00),
(1, '11E', 'economy', 'available', 1.00), (1, '11F', 'economy', 'available', 1.00);
