import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ shareUrl }) => {
  if (!shareUrl) return null;

  return (
    <div className="share-section">
      <h3>Share Your Selections</h3>
      <p>Scan this QR code to share your selections:</p>
      <div className="qr-code">
        <QRCodeSVG value={shareUrl} size={200} />
      </div>
      <p className="share-url">{shareUrl}</p>
    </div>
  );
};

export default QRCodeDisplay; 