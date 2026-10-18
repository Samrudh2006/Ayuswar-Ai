/**
 * bandwidthAdaptiveService.js
 * Implements Phase 14: Bandwidth-Adaptive Dynamic data compression layer.
 * Detects 2G/3G rural cellular connections via navigator.connection and throttles
 * heavy raster graphics, enabling high-speed vector telemetry and compressed audio payloads.
 */

export const getNetworkQualityProfile = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return {
      type: '4g',
      downlinkMbps: 10,
      rttMs: 50,
      isRuralLowBandwidth: false,
      compressionLevel: 'NORMAL'
    };
  }

  const conn = navigator.connection;
  const effectiveType = conn.effectiveType || '4g'; // 'slow-2g' | '2g' | '3g' | '4g'
  const isRuralLowBandwidth = effectiveType.includes('2g') || effectiveType === '3g' || (conn.saveData === true);

  return {
    type: effectiveType,
    downlinkMbps: conn.downlink || 10,
    rttMs: conn.rtt || 50,
    saveData: conn.saveData || false,
    isRuralLowBandwidth,
    compressionLevel: isRuralLowBandwidth ? 'AGGRESSIVE_VECTOR' : 'NORMAL'
  };
};

export const subscribeToNetworkChanges = (callback) => {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const handler = () => {
      callback(getNetworkQualityProfile());
    };
    navigator.connection.addEventListener('change', handler);
    return () => navigator.connection.removeEventListener('change', handler);
  }
  return () => {};
};
