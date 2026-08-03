import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import { Maximize2, Rotate3D } from 'lucide-react';
import { panoramaUrl } from '../data/platformData';

export default function PanoramaViewer({ table, onReserve, compact = false }) {
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hostRef.current) return undefined;
    setFailed(false); setLoading(true);
    let viewer;
    try {
      viewer = new Viewer({
        container: hostRef.current,
        panorama: panoramaUrl,
        caption: `Arshida · ${table?.id || 'Salon'}`,
        defaultYaw: '25deg',
        navbar: ['zoom', 'move', 'fullscreen'],
        mousewheelCtrlKey: false,
        touchmoveTwoFingers: false,
        plugins: [[MarkersPlugin, { markers: [
          { id: 'window', position: { yaw: '32deg', pitch: '2deg' }, html: '<span class="pano-marker">Panoramic window</span>', anchor: 'bottom center' },
          { id: 'salon', position: { yaw: '-55deg', pitch: '-4deg' }, html: '<span class="pano-marker">Main salon</span>', anchor: 'bottom center' },
          { id: 'stage', position: { yaw: '130deg', pitch: '0deg' }, html: '<span class="pano-marker">Live stage</span>', anchor: 'bottom center' },
        ] }]],
      });
      viewerRef.current = viewer;
      viewer.addEventListener('ready', () => { setLoading(false); viewer.animate({ yaw: '70deg', speed: '1.2rpm' }); }, { once: true });
      viewer.addEventListener('panorama-error', () => { setLoading(false); setFailed(true); });
    } catch { setLoading(false); setFailed(true); }
    return () => { viewerRef.current = null; viewer?.destroy(); };
  }, [table?.id]);

  if (failed) return <div className={`panorama-fallback ${compact ? 'compact' : ''}`}><Rotate3D /><h3>360° view unavailable</h3><p>Table {table?.id} · {table?.seats} seats · {table?.area}</p><button className="button button-primary" onClick={onReserve}>Reserve this table</button></div>;
  return <div className={`real-panorama ${compact ? 'compact' : ''}`}>
    <div ref={hostRef} className="panorama-host" />
    {loading && <div className="panorama-loading"><Rotate3D /><span>Preparing your seat view…</span></div>}
    <div className="panorama-badge"><Rotate3D />Drag to look around · Scroll to zoom</div>
    {!compact && <button className="panorama-reserve button button-primary" onClick={onReserve}><Maximize2 />Reserve {table?.id}</button>}
  </div>;
}
