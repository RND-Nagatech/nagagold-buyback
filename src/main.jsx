import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Banknote,
  CalendarDays,
  Check,
  Download,
  Gem,
  ImageOff,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Weight,
} from 'lucide-react';
import { trustPoints } from './data/buybackData';
import './styles.css';

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

function BuybackPageHeader({ brandName }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-link" href="#top" aria-label="Kembali ke halaman buyback">
          <span className="brand-name">{brandName}</span>
        </a>
      </div>
    </header>
  );
}

function VerificationBadge({ status }) {
  if (!status) return null;

  return (
    <span className="verification-badge">
      <span className="badge-icon"><Check size={13} strokeWidth={2.5} /></span>
      <span className="verification-copy">
        <strong>{status}</strong>
      </span>
    </span>
  );
}

function ProductMedia({ imageUrl, itemName }) {
  const [imageState, setImageState] = useState(imageUrl ? 'loading' : 'failed');

  return (
    <div className={`product-media ${imageState}`}>
      {imageState === 'loading' && <div className="media-skeleton" aria-hidden="true" />}
      {imageState === 'failed' ? (
        <div className="media-fallback" role="img" aria-label={`Foto ${itemName} belum tersedia`}>
          <span className="fallback-icon"><ImageOff size={26} strokeWidth={1.5} /></span>
          <span>Foto produk belum tersedia</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={`Foto ${itemName}`}
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('failed')}
        />
      )}
      <div className="media-overlay">
        <span className="media-label"><Sparkles size={13} /> Koleksi Anda</span>
      </div>
    </div>
  );
}

function DetailIcon({ type }) {
  const Icon = type === 'weight' ? Weight : type === 'price' ? Banknote : CalendarDays;
  return <span className="detail-icon"><Icon size={14} strokeWidth={1.7} aria-hidden="true" /></span>;
}

function ItemDetails({ data }) {
  const details = [
    { label: 'Berat', value: data.weightLabel, type: 'weight' },
    { label: 'Harga Beli', value: formatRupiah(data.purchasePrice), type: 'price' },
    { label: 'Tanggal Beli', value: data.purchaseDate, type: 'date' },
  ];

  return (
    <dl className="item-details" aria-label="Detail barang">
      {details.map((detail) => (
        <div className={`detail-row detail-${detail.type}`} key={detail.label}>
          <dt><DetailIcon type={detail.type} /> {detail.label}</dt>
          <dd>{detail.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function BuybackEstimateCard({ data, onDownload }) {
  const { buyback } = data;
  const available = Boolean(
    buyback.isEstimateAvailable &&
    Number.isFinite(buyback.min) &&
    Number.isFinite(buyback.max)
  );

  return (
    <section className={`estimate-card ${available ? '' : 'unavailable'}`} id="buyback" aria-labelledby="estimate-title">
      <div className="estimate-heading">
        <div>
          <span className="estimate-kicker">Nilai saat ini</span>
          <h2 id="estimate-title">Estimasi Nilai Buyback</h2>
        </div>
        {available && <span className="update-pill"><span className="pulse-dot" /> {buyback.updatedAtLabel}</span>}
      </div>

      {available ? (
        <>
          <p className="estimate-range">
            <span>{formatRupiah(buyback.min)}</span>
            <span className="range-dash">–</span>
            <span>{formatRupiah(buyback.max)}</span>
          </p>
          <p className="estimate-note">
            <span className="estimate-note-mark" aria-hidden="true">!</span>
            <span>Nilai final dapat berbeda setelah pemeriksaan fisik barang oleh tenaga ahli kami.</span>
          </p>
        </>
      ) : (
        <p className="estimate-empty">Estimasi belum tersedia. Silakan hubungi toko kami.</p>
      )}

      <button className="secondary-button download-button" type="button" onClick={onDownload}>
        <Download size={17} strokeWidth={1.8} />
        <span>Unduh Ringkasan</span>
      </button>
    </section>
  );
}

function TrustIcon({ type }) {
  const Icon = type === 'shield' ? ShieldCheck : type === 'gem' ? Gem : WalletCards;
  return <Icon size={19} strokeWidth={1.6} />;
}

function TrustPoints({ className = '' }) {
  return (
    <section className={`trust-section ${className}`.trim()} aria-label="Keunggulan layanan buyback">
      {trustPoints.map((point) => (
        <article className="trust-point" key={point.title}>
          <span className="trust-icon"><TrustIcon type={point.icon} /></span>
          <div>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [printMeta, setPrintMeta] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const rawKodeToko = searchParams.get('kode_toko') || '';
    let barcode = searchParams.get('kode_barcode');
    let backendUrl = searchParams.get('backend_url');

    // Kompatibilitas dengan format QR lama: kode_toko<kurls>backend_url.
    if ((!backendUrl || !barcode) && rawKodeToko.includes('kurls')) {
      const [kodeTokoValue, ...backendUrlParts] = rawKodeToko.split('kurls');
      backendUrl = backendUrl || backendUrlParts.join('kurls');
      try {
        const legacyBackendUrl = new URL(backendUrl);
        barcode = barcode || legacyBackendUrl.pathname.split('/').filter(Boolean).pop();
      } catch {
        // Validasi alamat backend dilakukan di bawah.
      }
      searchParams.set('kode_toko', kodeTokoValue);
    }

    const tokenPusat = import.meta.env.VITE_TOKEN_PUSAT;
    if (!barcode || !backendUrl) {
      setError('QR buyback tidak memiliki alamat backend atau kode barcode.');
      return;
    }
    if (!tokenPusat) {
      setError('Token pusat belum dikonfigurasi pada frontend buyback.');
      return;
    }

    let endpoint;
    try {
      const parsedBackendUrl = new URL(backendUrl);
      if (!['http:', 'https:'].includes(parsedBackendUrl.protocol)) throw new Error('Alamat backend tidak valid.');
      if (!/\/buyback\/check\/[^/]+$/.test(parsedBackendUrl.pathname)) {
        parsedBackendUrl.pathname = `${parsedBackendUrl.pathname.replace(/\/$/, '')}/buyback/check/${encodeURIComponent(barcode)}`;
      }
      endpoint = parsedBackendUrl.toString();
    } catch {
      setError('Alamat backend pada QR tidak valid.');
      return;
    }

    fetch(endpoint, {
      headers: {
        'X-Auth-Token': tokenPusat,
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        const payload = body?.data?.item ? body.data : body;
        if (!response.ok) throw new Error(payload?.message || 'Data buyback tidak dapat dimuat.');
        return payload;
      })
      .then((payload) => {
        const item = payload.item || {};
        const buyback = payload.buyback_result || {};
        const parsedDate = item.tgl_beli ? new Date(item.tgl_beli) : null;
        const purchaseDate = parsedDate && !Number.isNaN(parsedDate.getTime())
          ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsedDate)
          : '-';
        const weight = Number(item.berat || 0);
        const min = Number(buyback.terendah);
        const max = Number(buyback.tertinggi);
        const brandName = item.nama_toko || searchParams.get('nama_toko') || 'NAGA GOLD';

        setData({
          brandName,
          itemName: item.nama_barang || 'Barang emas',
          itemDescription: `Kode barcode ${item.kode_barcode || barcode}`,
          collectionLabel: 'Dari koleksi',
          collectionYear: parsedDate && !Number.isNaN(parsedDate.getTime()) ? String(parsedDate.getFullYear()) : '-',
          weightLabel: `${weight.toLocaleString('id-ID', { maximumFractionDigits: 3 })} gram`,
          purchasePrice: Number(item.harga_beli || 0),
          purchaseDate,
          buyback: {
            min: Number.isFinite(min) ? min : 0,
            max: Number.isFinite(max) ? max : 0,
            updatedAtLabel: 'Update hari ini',
            isEstimateAvailable: Number.isFinite(min) && Number.isFinite(max),
          },
          verificationStatus: 'Data transaksi terverifikasi',
          imageUrl: item.foto_barang || '',
        });
      })
      .catch((requestError) => setError(requestError.message || 'Data buyback tidak dapat dimuat.'));
  }, []);

  if (!data && !error) {
    return <div className="app-shell loading-state"><LoaderCircle className="spin" size={28} /><p>Memuat informasi buyback…</p></div>;
  }

  if (error) {
    return <div className="app-shell loading-state"><ImageOff size={28} /><h1>Informasi belum tersedia</h1><p>{error}</p></div>;
  }

  const handleDownload = () => {
    const originalTitle = document.title;
    const printTitle = `Ringkasan Buyback - ${data.itemName}`;
    const downloadedAt = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    setPrintMeta({ downloadedAt, printTitle });
    document.title = printTitle;
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.title = originalTitle;
        setPrintMeta(null);
      }, 1000);
    }, 0);
  };

  return (
    <div className="app-shell" id="top">
      <div className="print-meta" aria-hidden="true">
        <span>{printMeta?.downloadedAt}</span>
        <strong>{printMeta?.printTitle}</strong>
      </div>
      <BuybackPageHeader brandName={data.brandName} />

      <main>
        <section className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Layanan Buyback Emas</div>
            <h1 id="page-title">
              <span className="desktop-title">Nilai Kembali, <em>Lebih Berharga</em></span>
              <span className="mobile-title">Nilai Kembali,<br /><em>Lebih Berharga</em></span>
            </h1>
            <p>Berikut adalah estimasi nilai buyback berdasarkan data pembelian Anda.</p>
          </div>
          <p className="intro-side-note intro-side-note-left">Kepercayaan<br />memiliki<br />nilai abadi</p>
          <p className="intro-side-note intro-side-note-right">Emas<br />tetap bermakna<br />di setiap cerita</p>
          {/* <p className="brand-statement">Emas<br />tetap bernilai<br />di setiap cerita</p> */}
        </section>

        <section className="content-wrap" aria-label="Detail barang dan estimasi buyback">
          <article className="item-card">
            <div className="media-column">
              <ProductMedia imageUrl={data.imageUrl} itemName={data.itemName} />
              <div className="mobile-verification"><VerificationBadge status={data.verificationStatus} /></div>
              <div className="media-caption">
                <span className="caption-label">{data.collectionLabel}</span>
                <strong>{data.brandName}</strong>
                <span className="caption-dot" aria-hidden="true" />
                <span>{data.collectionYear}</span>
              </div>
            </div>

            <div className="details-column">
              <div className="details-topline">
                <span className="item-label">DETAIL BARANG</span>
                <div className="desktop-verification"><VerificationBadge status={data.verificationStatus} /></div>
              </div>
              <h2 className="item-name">{data.itemName}</h2>
              <p className="item-subtitle">{data.itemDescription}</p>
              <ItemDetails data={data} />
              <BuybackEstimateCard data={data} onDownload={handleDownload} />
            </div>
          </article>
          <TrustPoints className="desktop-trust" />
          <TrustPoints className="mobile-trust" />
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 Nagatech Sistem Integrator</span>
        <span className="footer-status"><span className="status-dot" /> Data Anda aman dan terlindungi</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
