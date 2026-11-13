import jsPDF from 'jspdf';
import { Booking } from '../types';

export const generateBookingInvoicePDF = (booking: Booking): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background Header Styling
  doc.setFillColor(11, 14, 20); // #0B0E14
  doc.rect(0, 0, 210, 42, 'F');

  // Gold accent bar
  doc.setFillColor(229, 169, 60); // #E5A93C
  doc.rect(0, 42, 210, 3, 'F');

  // AutoForge Brand Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(245, 200, 105);
  doc.text('AUTOFORGE', 16, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 190, 205);
  doc.text('CAREERS & GARAGE  |  PRECISION AUTOMOTIVE ENGINEERING', 16, 28);
  doc.text('Official Work Order & Service Tax Invoice', 16, 35);

  // Invoice Meta (Right side)
  doc.setFontSize(10);
  doc.setTextColor(229, 169, 60);
  doc.text(`INVOICE: ${booking.invoiceNumber}`, 140, 20);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8.5);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 140, 27);
  doc.text(`Status: PAID & CONFIRMED`, 140, 34);

  // Section 1: Customer & Workshop Info
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER / VEHICLE DETAILS', 16, 56);
  doc.text('WORKSHOP FACILITY', 115, 56);

  // Light grey separators
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.5);
  doc.line(16, 59, 95, 59);
  doc.line(115, 59, 195, 59);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 75, 85);

  const customerName = typeof booking.user === 'object' ? booking.user.name : 'Valued Client';
  const customerEmail = typeof booking.user === 'object' ? booking.user.email : '';
  const customerPhone = typeof booking.user === 'object' && booking.user.phone ? booking.user.phone : '+1 (555) 019-823';

  doc.text(`Client: ${customerName}`, 16, 66);
  doc.text(`Contact: ${customerPhone}`, 16, 72);
  doc.text(`Email: ${customerEmail}`, 16, 78);
  doc.text(`Vehicle: ${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`, 16, 84);
  doc.text(`Plate Number: ${booking.vehicle.plateNumber}`, 16, 90);
  if (booking.vehicle.mileage) {
    doc.text(`Odometer: ${booking.vehicle.mileage.toLocaleString()} km`, 16, 96);
  }

  // Workshop Details
  doc.text(`Facility: ${booking.workshop.name || 'AutoForge Superhub'}`, 115, 66);
  doc.text(`City: ${booking.workshop.city}, ${booking.workshop.country || 'International'}`, 115, 72);
  doc.text(`Address: ${booking.workshop.address || 'Central Engineering Hub'}`, 115, 78);
  doc.text(`Phone: ${booking.workshop.phone || '+91 80 4920 1800'}`, 115, 84);
  doc.text(`Scheduled Date: ${booking.appointmentDate}`, 115, 90);
  doc.text(`Slot: ${booking.timeSlot}`, 115, 96);

  // Section 2: Itemized Table Header
  const tableStartY = 112;
  doc.setFillColor(242, 244, 248);
  doc.rect(16, tableStartY, 178, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 35, 45);
  doc.text('DESCRIPTION / LINE ITEM', 20, tableStartY + 6);
  doc.text('DURATION', 125, tableStartY + 6);
  doc.text('PRICE (USD)', 165, tableStartY + 6);

  // Row 1
  let currentY = tableStartY + 18;
  doc.setFont('helvetica', 'bold');
  doc.text(booking.service.name || 'General Service', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 105, 115);
  doc.setFontSize(8);
  const desc = booking.service.shortDescription || 'Precision maintenance inspection and fluid replacement';
  doc.text(desc.slice(0, 68), 20, currentY + 5);

  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`${booking.service.durationHours || 2} Hours`, 125, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${booking.totalAmount.toFixed(2)}`, 168, currentY);

  // Line separator
  doc.setDrawColor(230, 235, 240);
  doc.line(16, currentY + 12, 194, currentY + 12);

  // Totals Box
  const totalBoxY = currentY + 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Subtotal:', 135, totalBoxY);
  doc.text(`$${booking.totalAmount.toFixed(2)}`, 172, totalBoxY);

  doc.text('State / Environmental Tax (0%):', 135, totalBoxY + 6);
  doc.text('$0.00', 172, totalBoxY + 6);

  doc.setFillColor(248, 242, 225);
  doc.rect(130, totalBoxY + 10, 64, 11, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(170, 115, 15);
  doc.text('TOTAL AMOUNT PAID:', 134, totalBoxY + 17);
  doc.text(`$${booking.totalAmount.toFixed(2)}`, 172, totalBoxY + 17);

  // Warranty Stamp / Quality Assurance
  doc.setDrawColor(229, 169, 60);
  doc.setLineWidth(1);
  doc.rect(16, totalBoxY + 2, 95, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 120, 20);
  doc.text('AUTOFORGE WARRANTY ASSURED', 22, totalBoxY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 95, 105);
  doc.text('• 12-Month / 15,000 km Guaranteed Workmanship', 22, totalBoxY + 16);
  doc.text('• Genuine OEM & Certified High-Performance Components', 22, totalBoxY + 21);

  // Footer Note
  doc.setFontSize(8);
  doc.setTextColor(140, 145, 155);
  doc.text('Thank you for trusting AutoForge Careers & Garage. Keep this document for your vehicle service logbook.', 16, 275);
  doc.text('www.autoforge.io  |  Global Network Support: support@autoforge.com', 16, 281);

  // Save the PDF
  doc.save(`AutoForge_Invoice_${booking.invoiceNumber}.pdf`);
};

