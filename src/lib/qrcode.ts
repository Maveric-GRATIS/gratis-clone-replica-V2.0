/**
 * QR Code Generation Utilities
 *
 * Generate QR codes for event tickets
 */

import QRCode from 'qrcode';

export interface TicketQRData {
  ticketId: string;
  eventId: string;
  userId: string;
  ticketType: string;
  orderNumber: string;
  checkInKey: string;
}

/**
 * Generate QR code as data URL
 */
export async function generateTicketQR(
  ticketData: TicketQRData
): Promise<string> {
  try {
    // Create JSON string of ticket data
    const dataString = JSON.stringify(ticketData);

    // Generate QR code with custom options
    const qrDataURL = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as canvas element
 */
export async function generateTicketQRCanvas(
  ticketData: TicketQRData,
  canvas: HTMLCanvasElement
): Promise<void> {
  try {
    const dataString = JSON.stringify(ticketData);

    await QRCode.toCanvas(canvas, dataString, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR canvas:', error);
    throw new Error('Failed to generate QR canvas');
  }
}

/**
 * Verify QR code data
 */
export function verifyTicketQR(qrData: string): TicketQRData | null {
  try {
    const parsed = JSON.parse(qrData);

    // Validate required fields
    if (
      !parsed.ticketId ||
      !parsed.eventId ||
      !parsed.userId ||
      !parsed.ticketType ||
      !parsed.orderNumber ||
      !parsed.checkInKey
    ) {
      return null;
    }

    return parsed as TicketQRData;
  } catch (error) {
    console.error('Error verifying QR data:', error);
    return null;
  }
}

/**
 * Generate unique check-in key
 */
export function generateCheckInKey(
  ticketId: string,
  eventId: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${ticketId}-${eventId}-${timestamp}-${random}`;
}
