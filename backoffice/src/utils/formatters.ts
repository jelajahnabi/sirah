import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { PaymentTransaction, Jamaah } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

// Terbilang Rupiah generator for Kwitansi resmi MKB
export function terbilang(angka: number): string {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  if (angka < 12) {
    return bilangan[angka];
  } else if (angka < 20) {
    return terbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
  } else if (angka < 200) {
    return 'Seratus ' + terbilang(angka - 100);
  } else if (angka < 1000) {
    return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
  } else if (angka < 2000) {
    return 'Seribu ' + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  } else if (angka < 1000000000) {
    return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    return terbilang(Math.floor(angka / 1000000000)) + ' Miliar ' + terbilang(angka % 1000000000);
  }
  return '';
}

export function terbilangRupiah(amount: number): string {
  if (amount === 0) return 'Nol Rupiah';
  const hasil = terbilang(Math.floor(amount)).trim();
  return hasil.replace(/\s+/g, ' ') + ' Rupiah';
}

// Clean Indonesian WhatsApp number: 081328313731 -> 6281328313731
export function sanitizeWaNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function buildWaLink(phone: string, message: string): string {
  const sanitized = sanitizeWaNumber(phone);
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

/**
 * Export data to authentic Microsoft Excel (.xlsx) file using SheetJS.
 * Each column and row lands precisely in its own Excel cell.
 */
export function exportToXlsx(filename: string, headers: string[], rows: (string | number)[][]): void {
  // Combine headers and rows
  const data = [headers, ...rows];
  
  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths based on content
  const colWidths = headers.map((header, colIndex) => {
    let maxLength = header.length;
    rows.forEach(row => {
      const cellVal = row[colIndex] ? String(row[colIndex]) : '';
      if (cellVal.length > maxLength) {
        maxLength = cellVal.length;
      }
    });
    return { wch: Math.min(Math.max(maxLength + 2, 10), 40) };
  });
  worksheet['!cols'] = colWidths;

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data MKB Travel');

  // Trigger download with .xlsx extension
  const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanFilename);
}

/**
 * Generate and download clean PDF receipt for a payment transaction using jsPDF.
 */
export function downloadReceiptPdf(
  tx: PaymentTransaction,
  companyInfo: {
    legalName: string;
    address: string;
    whatsappDisplay: string;
    skIzin: string;
  },
  customLogo?: string | null,
  signatoryStaffName?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Neat official half-page receipt format
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background banner
  doc.setFillColor(15, 81, 50); // Deep emerald
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Try adding custom logo if available
  if (customLogo && customLogo.startsWith('data:image/')) {
    try {
      const format = customLogo.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(customLogo, format, 8, 4, 20, 20);
    } catch {
      // Continue without logo if invalid format
    }
  }

  // Header texts
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(companyInfo.legalName, pageWidth / 2, 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    `PPIU Kemenhaj RI: ${companyInfo.skIzin} | WA: ${companyInfo.whatsappDisplay}`,
    pageWidth / 2,
    14,
    { align: 'center' }
  );
  doc.text(companyInfo.address, pageWidth / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('KWITANSI PEMBAYARAN RESMI', pageWidth / 2, 24, { align: 'center' });

  // Receipt body
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);

  let currentY = 36;
  doc.setFont('helvetica', 'bold');
  doc.text(`Nomor Kwitansi: ${tx.receiptNumber}`, 14, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal: ${formatDateIndo(tx.paymentDate)}`, pageWidth - 14, currentY, { align: 'right' });

  currentY += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, currentY, pageWidth - 14, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Telah Terima Dari', 14, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${tx.jamaahName.toUpperCase()}`, 52, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Untuk Pembayaran', 14, currentY);
  doc.text(`: ${tx.paymentType} - ${tx.packageName}`, 52, currentY);

  if (tx.notes) {
    currentY += 6;
    doc.text('Catatan', 14, currentY);
    doc.text(`: ${tx.notes}`, 52, currentY);
  }

  currentY += 8;
  doc.text('Metode Pembayaran', 14, currentY);
  doc.text(`: ${tx.paymentMethod}`, 52, currentY);

  // Terbilang box
  currentY += 8;
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(14, currentY, pageWidth - 28, 12, 2, 2, 'F');
  doc.setDrawColor(200, 220, 210);
  doc.roundedRect(14, currentY, pageWidth - 28, 12, 2, 2, 'D');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 80, 50);
  doc.text('Terbilang:', 18, currentY + 4.5);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(terbilangRupiah(tx.amount), 18, currentY + 8.5);

  // Amount badge
  currentY += 18;
  doc.setFillColor(15, 81, 50);
  doc.roundedRect(14, currentY, 65, 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`JUMLAH: ${formatRupiah(tx.amount)}`, 18, currentY + 7.5);

  // Signature area
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Yogyakarta, Indonesia', pageWidth - 42, currentY - 2, { align: 'center' });
  doc.text('Kasir & Keuangan MKB,', pageWidth - 42, currentY + 2, { align: 'center' });

  // Stamp simulation
  doc.setDrawColor(20, 100, 60);
  doc.circle(pageWidth - 42, currentY + 11, 7, 'S');
  doc.setFontSize(5);
  doc.setTextColor(20, 100, 60);
  doc.text('LUNAS / VERIFIED', pageWidth - 42, currentY + 10.5, { align: 'center' });
  doc.text('MKB TRAVEL', pageWidth - 42, currentY + 12.5, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  const signer = signatoryStaffName || tx.verifiedBy;
  doc.text(signer, pageWidth - 42, currentY + 23, { align: 'center' });

  // Footer note
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 140, 140);
  doc.text(
    'Kwitansi digital ini sah diterbitkan oleh sistem backoffice PT MUDAHKEBAITULLAH TRAVEL INDONESIA.',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 8,
    { align: 'center' }
  );

  // Save to file
  doc.save(`Kwitansi_${tx.receiptNumber}_${tx.jamaahName.replace(/\s+/g, '_')}.pdf`);
}

/** Teks promosi paket untuk dibagikan via WhatsApp. */
export function sharePackageToWhatsApp(
  pkg: { name: string; price: number; durationDays: number; departureMonth: string; airline: string; makkahHotel: string; madinahHotel: string; highlightFeatures: string[] },
  company: { legalName: string; address: string; whatsappDisplay: string; website: string }
): void {
  const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBerikut Informasi Program Resmi dari *${company.legalName}*:\n\n*${pkg.name.toUpperCase()}*\n🔹 Harga: *${formatRupiah(pkg.price)}*\n🔹 Durasi: ${pkg.durationDays} Hari (${pkg.departureMonth})\n🔹 Maskapai: ${pkg.airline}\n🔹 Hotel Makkah: ${pkg.makkahHotel}\n🔹 Hotel Madinah: ${pkg.madinahHotel}\n\n*Fasilitas Unggulan:*\n${pkg.highlightFeatures.map((f) => `• ${f}`).join('\n')}\n\n📍 Kantor MKB Travel: ${company.address}\n📞 Hubungi Hotline WA: ${company.whatsappDisplay}\n🌐 Website: ${company.website}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
