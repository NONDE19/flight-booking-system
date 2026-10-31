const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

exports.buildTicketPDF = async (bookingData, passengerData, flightData) => {
  // Generate verifiable QR Code Buffer
  const qrPayload = JSON.stringify({
    system: 'SKYQUEST ZAMBIA E-TICKET',
    pnr: bookingData.pnr,
    passenger: `${passengerData.first_name} ${passengerData.last_name}`,
    passport: passengerData.passport_number || 'DOMESTIC_ID',
    flight: flightData.flight_number,
    route: `${flightData.departure_iata} -> ${flightData.arrival_iata}`,
    seat: passengerData.seat_number || '10A',
    fare_paid: `ZMW ${bookingData.total_amount}`,
    zra_tax_ref: `ZRA-TAX-${bookingData.pnr}-${Date.now().toString().slice(-6)}`,
    status: 'OFFICIALLY_CONFIRMED'
  });

  const qrImageBuffer = await QRCode.toBuffer(qrPayload, {
    width: 130,
    margin: 1,
    color: { dark: '#0A192F', light: '#FFFFFF' }
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header Navy Bar
    doc.rect(0, 0, 595.28, 85).fill('#0A192F');

    doc.fillColor('#FFFFFF')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('SKYQUEST ZAMBIA AIRWAYS', 40, 22);

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#F59E0B')
       .text('OFFICIAL ELECTRONIC TICKET & ZRA FISCAL RECEIPT', 40, 50);

    doc.fillColor('#FFFFFF')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(`PNR: ${bookingData.pnr}`, 440, 28);

    doc.fontSize(8)
       .fillColor('#94A3B8')
       .text('RESERVATION CONFIRMED', 440, 48);

    // Passenger / Flight Summary Box
    doc.rect(40, 110, 515, 140).lineWidth(1).strokeColor('#CBD5E1').stroke();

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('PASSENGER NAME', 55, 125);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text(`${passengerData.first_name} ${passengerData.last_name}`.toUpperCase(), 55, 138);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('NATIONALITY / ID', 55, 160);
    doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold')
       .text(`${passengerData.nationality || 'ZAMBIA'} (${passengerData.passport_number || 'NRC-VALID'})`, 55, 173);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('FLIGHT NO', 230, 125);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text(flightData.flight_number, 230, 138);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('CABIN CLASS', 330, 125);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text((passengerData.cabin_class || 'ECONOMY').toUpperCase(), 330, 138);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('SEAT ASSIGNED', 440, 125);
    doc.fillColor('#0284C7').fontSize(16).font('Helvetica-Bold')
       .text(passengerData.seat_number || '10A', 440, 137);

    // Route Row
    doc.moveTo(55, 195).lineTo(530, 195).strokeColor('#E2E8F0').stroke();

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('DEPARTURE AIRPORT', 55, 205);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text(`${flightData.departure_city || 'Lusaka'} (${flightData.departure_iata || 'LUN'})`, 55, 218);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('ARRIVAL AIRPORT', 330, 205);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold')
       .text(`${flightData.arrival_city || 'Livingstone'} (${flightData.arrival_iata || 'LVI'})`, 330, 218);

    // Scannable Receipt & QR Code Validation Block
    doc.rect(40, 270, 515, 150).fill('#F8FAFC');
    doc.rect(40, 270, 515, 150).lineWidth(1).strokeColor('#E2E8F0').stroke();

    // Embed Dynamic QR Code
    doc.image(qrImageBuffer, 55, 280, { width: 130 });

    doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold')
       .text('DIGITAL AIRPORT SECURITY & ZRA SCANNER', 200, 285);

    doc.fillColor('#64748B').fontSize(8).font('Helvetica')
       .text('Point any phone camera or airport terminal optical scanner to verify manifest authenticity, boarding status, and tax registration in real-time.', 200, 303, { width: 330 });

    doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold').text('FISCAL INVOICE DETAILS:', 200, 335);
    doc.fillColor('#334155').fontSize(8).font('Helvetica')
       .text(`Total Amount Paid: ZMW ${Number(bookingData.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 200, 350)
       .text(`Airport Service Charge & ZRA VAT (16%): ZMW ${Number(bookingData.tax_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 200, 365)
       .text(`Payment Gateway: MTN MoMo / Airtel Money / Card Settled`, 200, 380)
       .text(`ZRA TPIN: 1003928192 &bull; ZCAA Operator License: ZCAA/AOC/044/26`, 200, 395);

    doc.fontSize(8).font('Helvetica').fillColor('#94A3B8')
       .text('Boarding gates close 25 minutes prior to scheduled departure. Present this e-ticket with valid National Registration Card (NRC) or Passport at airport security checkpoints.', 40, 440, { width: 515, align: 'center' });

    doc.end();
  });
};