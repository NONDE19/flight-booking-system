USE `skyquest_airline`;

INSERT IGNORE INTO `airports` (`iata_code`, `icao_code`, `name`, `city`, `country`, `timezone`, `latitude`, `longitude`) VALUES
('LUN', 'FLKK', 'Kenneth Kaunda International Airport', 'Lusaka', 'Zambia', 'Africa/Lusaka', -15.3308, 28.4526),
('LVI', 'FLHN', 'Harry Mwaanga Nkumbula International', 'Livingstone', 'Zambia', 'Africa/Lusaka', -17.8218, 25.8227),
('NLA', 'FLSK', 'Simon Mwansa Kapwepwe International', 'Ndola', 'Zambia', 'Africa/Lusaka', -12.9981, 28.6649),
('MFU', 'FLMF', 'Mfuwe International Airport', 'Mfuwe', 'Zambia', 'Africa/Lusaka', -13.0714, 31.9366),
('JNB', 'FAOR', 'O. R. Tambo International Airport', 'Johannesburg', 'South Africa', 'Africa/Johannesburg', -26.1367, 28.2411);

INSERT IGNORE INTO `airlines` (`iata_code`, `icao_code`, `name`, `logo_url`) VALUES
('ZN', 'AZB', 'Zambia Airways', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=128');

INSERT IGNORE INTO `flights` 
(`id`, `flight_number`, `airline_id`, `aircraft_id`, `departure_airport_id`, `arrival_airport_id`, `departure_time`, `arrival_time`, `flight_duration_minutes`, `base_price_economy`, `base_price_business`, `base_price_first`, `status`)
VALUES 
(2, 'ZN-202', 1, 1, 5, 6, '2026-11-15 08:30:00', '2026-11-15 09:40:00', 70, 1850.00, 3600.00, 5200.00, 'scheduled'),
(3, 'ZN-104', 1, 1, 5, 7, '2026-11-15 14:00:00', '2026-11-15 14:50:00', 50, 1650.00, 3200.00, 4800.00, 'scheduled'),
(4, 'ZN-501', 1, 1, 5, 9, '2026-11-15 16:30:00', '2026-11-15 18:35:00', 125, 3450.00, 6800.00, 11500.00, 'scheduled');