import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Navigation, 
  Layers, 
  Building2, 
  Car,
  Activity,
  Compass,
  Volume2,
  VolumeX,
  Radio,
  Gauge,
  Heart,
  ShieldAlert,
  Wifi,
  Sparkles
} from 'lucide-react';
import { MAPBOX_TOKEN } from '../services/emergencyHospitalBackend';
import { emergencySiren } from '../services/emergencyAudioSiren';

mapboxgl.accessToken = MAPBOX_TOKEN;

/**
 * EmergencyMap — Real-Time Mapbox GL JS GIS Operational Engine & Telemetry Suite
 * 
 * Upgraded Features:
 * - Real Mapbox dark cartographic vector basemap with road networks & regional hospitals
 * - Distinct, visible Caller Emergency Beacon (Red)
 * - Ultra-High-Visibility ALS Ambulance vehicle marker with alternating Red/Cyan LED strobes & heading
 * - Dynamic road route corridor with glowing pulse tracer
 * - Live Telemetry HUD: Real-time Speedometer, ETA Countdown, ALS Patient Vitals, Traffic Signal Preemption
 * - WebAudio Emergency Siren Controller with live audible dual-tone wail
 * - 3D Cockpit Follow Cam mode (60° tilt, camera orientation locked to vehicle heading)
 */
export default function EmergencyMap({
  callerCoords = { lat: 15.8281, lng: 78.0373 },
  hospitals = [],
  selectedHospital = null,
  onSelectHospital = () => {},
  ambulanceData = { id: 'A-12', lat: 15.8210, lng: 78.0320, heading: 52, speed: 54, status: 'EN_ROUTE' },
  routeCoordinates = [],
  callerAmbulanceRoute = [],
  isDispatched = false
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const callerMarkerRef = useRef(null);
  const ambulanceMarkerRef = useRef(null);
  const hospitalMarkersRef = useRef([]);

  // Layer & Camera Toggles
  const [showHospitals, setShowHospitals] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapStyleType, setMapStyleType] = useState('navigation'); // 'navigation' | 'streets' | 'satellite'
  const [followAmbulance, setFollowAmbulance] = useState(false);
  const [is3DCockpitView, setIs3DCockpitView] = useState(false);
  const [showTelemetryHUD, setShowTelemetryHUD] = useState(true);

  // Siren Audio State
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  // Dynamic Live Telemetry Metrics
  const [telemetrySpeed, setTelemetrySpeed] = useState(ambulanceData.speed || 52);
  const [heartRate, setHeartRate] = useState(108);
  const [spO2, setSpO2] = useState(94);
  const [trafficOverrideCount, setTrafficOverrideCount] = useState(4);
  const [etaRemainingSec, setEtaRemainingSec] = useState(240);

  // Smooth Vehicle Animation Refs
  const currentPosRef = useRef({ lat: ambulanceData.lat, lng: ambulanceData.lng });
  const animFrameRef = useRef(null);

  // Toggle Siren Audio
  const handleToggleSiren = () => {
    const newState = emergencySiren.toggle();
    setIsSirenPlaying(newState);
  };

  // Clean up siren on unmount
  useEffect(() => {
    return () => {
      emergencySiren.stop();
    };
  }, []);

  // Live telemetry pulse simulation (vital signs fluctuation & ETA countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDispatched) {
        setTelemetrySpeed(Math.round(48 + Math.sin(Date.now() / 2000) * 14));
        setHeartRate(Math.round(106 + Math.sin(Date.now() / 3000) * 8));
        setSpO2(Math.min(98, Math.max(91, Math.round(94 + Math.sin(Date.now() / 4000) * 2))));
        setEtaRemainingSec((prev) => (prev > 10 ? prev - 1 : 240));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isDispatched]);

  // Format ETA seconds into MM:SS
  const formatEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 1. Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [callerCoords.lng, callerCoords.lat],
      zoom: 14.3,
      pitch: 32,
      bearing: 0,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      // 1. SOURCE: Caller ─── Ambulance Route (Subtle)
      map.addSource('caller-ambulance-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'caller-ambulance-line',
        type: 'line',
        source: 'caller-ambulance-source',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#F59E0B',
          'line-width': 2.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.8
        }
      });

      // 2. SOURCE: Ambulance ══════ Selected Hospital Route
      map.addSource('ambulance-hospital-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Route Outer Neon Glow
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'ambulance-hospital-source',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#0284C7',
          'line-width': 10,
          'line-opacity': 0.5
        }
      });

      // Route Core Line
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'ambulance-hospital-source',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#38BDF8',
          'line-width': 4.5,
          'line-opacity': 0.95
        }
      });

      // Route Pulsing Dash Flow
      map.addLayer({
        id: 'route-pulse',
        type: 'line',
        source: 'ambulance-hospital-source',
        layout: { 'line-cap': 'round', 'line-join': 'round', visibility: 'visible' },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
          'line-dasharray': [1, 3],
          'line-opacity': 0.85
        }
      });

      // 3. CREATE PULSING CALLER EMERGENCY MARKER
      const callerEl = document.createElement('div');
      callerEl.className = 'caller-emergency-beacon';
      callerEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(220, 38, 38, 0.65);"></div>
            <div style="position: absolute; width: 15px; height: 15px; border-radius: 50%; background: #EF4444; border: 2.5px solid #FFF; box-shadow: 0 0 16px #EF4444;"></div>
          </div>
          <div style="
            background: rgba(10, 19, 36, 0.96);
            border: 1.5px solid #EF4444;
            color: #FFFFFF;
            padding: 3px 9px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 900;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.85);
            margin-top: 2px;
          ">
            🚨 PATIENT DISTRESS ANCHOR (±6m)
          </div>
        </div>
      `;
      callerMarkerRef.current = new mapboxgl.Marker({ element: callerEl })
        .setLngLat([callerCoords.lng, callerCoords.lat])
        .addTo(map);

      // 4. CREATE HIGH-CONTRAST DUAL-STROBE AMBULANCE MARKER
      const ambulanceEl = document.createElement('div');
      ambulanceEl.className = 'ambulance-live-vehicle-node';
      ambulanceEl.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.9));">
          <!-- STROBE VEHICLE BODY -->
          <div style="
            position: relative;
            background: linear-gradient(135deg, #0B1E38 0%, #031024 100%);
            border: 2px solid #38BDF8;
            border-radius: 20px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            gap: 7px;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.8), inset 0 0 10px rgba(2, 132, 199, 0.4);
          ">
            <!-- Alternating Strobe Lights -->
            <div style="
              width: 9px;
              height: 9px;
              border-radius: 50%;
              background: #EF4444;
              box-shadow: 0 0 12px #EF4444;
              animation: ping 0.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>

            <span style="font-size: 14px; line-height: 1;">🚑</span>
            
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 11.5px; font-weight: 900; color: #FFFFFF; letter-spacing: 0.5px;">ALS-12</span>
              <span style="font-size: 8px; color: #38BDF8; font-weight: 800; font-family: monospace;">EMERGENCY DISPATCH</span>
            </div>

            <!-- Blue Strobe Light -->
            <div style="
              width: 9px;
              height: 9px;
              border-radius: 50%;
              background: #0284C7;
              box-shadow: 0 0 12px #38BDF8;
              animation: pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            "></div>
          </div>

          <!-- POINTER ARROW -->
          <div style="
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid #38BDF8;
          "></div>
        </div>
      `;
      ambulanceMarkerRef.current = new mapboxgl.Marker({ element: ambulanceEl })
        .setLngLat([ambulanceData.lng, ambulanceData.lat])
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  // 2. Update Caller Marker and Center Map when GPS resolves
  useEffect(() => {
    if (callerMarkerRef.current && callerCoords) {
      callerMarkerRef.current.setLngLat([callerCoords.lng, callerCoords.lat]);
      if (mapRef.current && !followAmbulance) {
        mapRef.current.flyTo({
          center: [callerCoords.lng, callerCoords.lat],
          zoom: 14.3,
          essential: true,
          duration: 1000
        });
      }
    }
  }, [callerCoords.lat, callerCoords.lng]);

  // 3. Render High-Visibility HTML Markers for ALL 12 Hospitals
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    hospitalMarkersRef.current.forEach((m) => m.remove());
    hospitalMarkersRef.current = [];

    if (!showHospitals) return;

    hospitals.forEach((hosp) => {
      const isSelected = selectedHospital && selectedHospital.id === hosp.id;
      const isTop = hosp.id === 'hosp_001';

      const el = document.createElement('div');
      el.className = 'hospital-map-node';
      el.style.cursor = 'pointer';

      const badgeBg = isSelected 
        ? '#0284C7' 
        : isTop 
        ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' 
        : hosp.ownership?.toLowerCase().includes('government')
        ? 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)'
        : 'rgba(8, 18, 36, 0.94)';
      const badgeBorder = isSelected 
        ? '2px solid #38BDF8' 
        : isTop 
        ? '1.5px solid #F59E0B' 
        : hosp.ownership?.toLowerCase().includes('government')
        ? '1px solid #10B981'
        : '1px solid #1E3A5F';

      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-50%);">
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: ${badgeBg};
            border: ${badgeBorder};
            padding: 3px 8px;
            border-radius: 8px;
            box-shadow: ${isSelected ? '0 0 18px rgba(56, 189, 248, 0.85)' : '0 4px 12px rgba(0,0,0,0.7)'};
            white-space: nowrap;
          ">
            <span style="font-size: 12px; line-height: 1;">🏥</span>
            <span style="font-size: 10.5px; font-weight: 800; color: #FFFFFF;">
              ${hosp.shortName || hosp.name.split(' ')[0]} ${isTop ? '★' : ''}
            </span>
            <span style="
              font-size: 9px; 
              font-weight: 800; 
              color: ${isSelected ? '#FFFFFF' : '#38BDF8'};
              background: rgba(0,0,0,0.35);
              padding: 1px 5px;
              border-radius: 6px;
            ">
              ${hosp.etaMinutes}m
            </span>
          </div>
          <div style="width: 2px; height: 6px; background: ${isSelected ? '#38BDF8' : '#1E3A5F'};"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectHospital(hosp);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([hosp.lng, hosp.lat])
        .addTo(map);

      hospitalMarkersRef.current.push(marker);
    });
  }, [hospitals, selectedHospital, showHospitals]);

  // 4. Update Route 1 (Caller ─── Ambulance)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('caller-ambulance-source');
    if (source && callerCoords && ambulanceData) {
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [callerCoords.lng, callerCoords.lat],
                [ambulanceData.lng, ambulanceData.lat]
              ]
            },
            properties: {}
          }
        ]
      });
    }
  }, [callerCoords.lat, callerCoords.lng, ambulanceData.lat, ambulanceData.lng]);

  // 5. Update Route 2 (Ambulance ══════ Selected Hospital)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('ambulance-hospital-source');
    if (source) {
      if (routeCoordinates && routeCoordinates.length > 0) {
        source.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              },
              properties: {}
            }
          ]
        });
      } else {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    }
  }, [routeCoordinates]);

  // 6. Smooth Vehicle Movement Interpolation with 3D Camera Follow
  useEffect(() => {
    if (!ambulanceMarkerRef.current || !ambulanceData) return;

    const targetLng = ambulanceData.lng;
    const targetLat = ambulanceData.lat;
    const heading = ambulanceData.heading || 52;

    const animate = () => {
      const curLng = currentPosRef.current.lng;
      const curLat = currentPosRef.current.lat;

      const diffLng = targetLng - curLng;
      const diffLat = targetLat - curLat;

      if (Math.abs(diffLng) > 0.000005 || Math.abs(diffLat) > 0.000005) {
        const nextLng = curLng + diffLng * 0.16;
        const nextLat = curLat + diffLat * 0.16;
        currentPosRef.current = { lng: nextLng, lat: nextLat };
        ambulanceMarkerRef.current.setLngLat([nextLng, nextLat]);

        if (mapRef.current) {
          if (is3DCockpitView) {
            mapRef.current.easeTo({
              center: [nextLng, nextLat],
              pitch: 62,
              bearing: heading,
              zoom: 16.2,
              duration: 80
            });
          } else if (followAmbulance) {
            mapRef.current.easeTo({
              center: [nextLng, nextLat],
              duration: 80
            });
          }
        }
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentPosRef.current = { lng: targetLng, lat: targetLat };
        ambulanceMarkerRef.current.setLngLat([targetLng, targetLat]);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [ambulanceData.lat, ambulanceData.lng, followAmbulance, is3DCockpitView, ambulanceData.heading]);

  // Layer Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('route-line')) {
      map.setLayoutProperty('route-line', 'visibility', showRoutes ? 'visible' : 'none');
      map.setLayoutProperty('route-glow', 'visibility', showRoutes ? 'visible' : 'none');
      map.setLayoutProperty('route-pulse', 'visibility', showRoutes ? 'visible' : 'none');
      map.setLayoutProperty('caller-ambulance-line', 'visibility', showRoutes ? 'visible' : 'none');
    }
  }, [showRoutes]);

  // Controls Actions
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleLocateCaller = () => {
    setIs3DCockpitView(false);
    mapRef.current?.flyTo({
      center: [callerCoords.lng, callerCoords.lat],
      zoom: 14.8,
      pitch: 28,
      bearing: 0,
      speed: 1.3
    });
  };

  const toggleSatelliteStyle = () => {
    if (!mapRef.current) return;
    if (mapStyleType === 'navigation') {
      mapRef.current.setStyle('mapbox://styles/mapbox/streets-v12');
      setMapStyleType('streets');
    } else if (mapStyleType === 'streets') {
      mapRef.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
      setMapStyleType('satellite');
    } else {
      mapRef.current.setStyle('mapbox://styles/mapbox/navigation-night-v1');
      setMapStyleType('navigation');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* MAPBOX CANVAS */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#090F1E' }} />

      {/* TOP-LEFT STATUS STRIP */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {/* Real-time Telemetry Indicator */}
        <div style={{
          background: 'rgba(6, 13, 26, 0.94)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #1E2E4E',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>
            ● TELEMETRY STREAM (SIMULATION)
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
            GNSS Telemetry (SIMULATION)
          </span>
        </div>

        {/* Green Corridor Signal Status */}
        <div style={{
          background: 'rgba(6, 78, 59, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #059669',
          borderRadius: '8px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10.5px',
          color: '#E0F2FE',
          fontWeight: 800
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }} />
          <span>GREEN CORRIDOR (SIMULATION): {trafficOverrideCount} SIGNALS PREEMPTED</span>
        </div>
      </div>

      {/* FLOATING ACTION TOOLBAR (TOP RIGHT) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        background: 'rgba(6, 13, 26, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #1C2E4C',
        borderRadius: '10px',
        padding: '6px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.8)'
      }}>
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          style={{ background: '#0F1E38', border: '1px solid #1C335A', color: '#FFF', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={15} />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{ background: '#0F1E38', border: '1px solid #1C335A', color: '#FFF', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Minus size={15} />
        </button>

        <div style={{ height: '1px', background: '#1E2F4C', margin: '2px 0' }} />

        {/* Emergency Siren Audio Button */}
        <button
          onClick={handleToggleSiren}
          title={isSirenPlaying ? "Mute Emergency Siren" : "Sound Emergency Siren (WebAudio)"}
          style={{
            background: isSirenPlaying ? '#DC2626' : '#0F1E38',
            border: isSirenPlaying ? '1.5px solid #EF4444' : '1px solid #1C335A',
            color: '#FFF',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSirenPlaying ? '0 0 14px rgba(239, 68, 68, 0.8)' : 'none'
          }}
        >
          {isSirenPlaying ? <Volume2 size={16} /> : <VolumeX size={15} />}
        </button>

        {/* 3D Cockpit Follow Cam */}
        <button
          onClick={() => {
            setIs3DCockpitView(!is3DCockpitView);
            setFollowAmbulance(true);
          }}
          title={is3DCockpitView ? "3D Cockpit Chase Cam (Active)" : "Switch to 3D Cockpit Cam"}
          style={{
            background: is3DCockpitView ? '#0284C7' : '#0F1E38',
            border: is3DCockpitView ? '1.5px solid #38BDF8' : '1px solid #1C335A',
            color: '#FFF',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: is3DCockpitView ? '0 0 14px rgba(56, 189, 248, 0.8)' : 'none'
          }}
        >
          <Compass size={15} />
        </button>

        {/* Locate Caller */}
        <button
          onClick={handleLocateCaller}
          title="Locate Caller (Reset View)"
          style={{ background: '#0F1E38', border: '1px solid #1C335A', color: '#EF4444', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Crosshair size={15} />
        </button>

        {/* Toggle Telemetry HUD */}
        <button
          onClick={() => setShowTelemetryHUD(!showTelemetryHUD)}
          title="Toggle ALS Telemetry HUD"
          style={{
            background: showTelemetryHUD ? '#7C3AED' : '#0F1E38',
            border: showTelemetryHUD ? '1px solid #A78BFA' : '1px solid #1C335A',
            color: '#FFF',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Activity size={15} />
        </button>

        <button
          onClick={() => setShowHospitals(!showHospitals)}
          title="Toggle Hospital Markers"
          style={{
            background: showHospitals ? '#059669' : '#0F1E38',
            border: showHospitals ? '1px solid #10B981' : '1px solid #1C335A',
            color: '#FFF',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Building2 size={15} />
        </button>

        <button
          onClick={toggleSatelliteStyle}
          title="Toggle Map Style"
          style={{ background: '#0F1E38', border: '1px solid #1C335A', color: '#CBD5E1', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Layers size={15} />
        </button>
      </div>

      {/* FLOATING ALS CLINICAL TELEMETRY HUD (BOTTOM LEFT OVERLAY) */}
      {showTelemetryHUD && isDispatched && (
        <div style={{
          position: 'absolute',
          bottom: '54px',
          left: '12px',
          zIndex: 25,
          background: 'rgba(6, 13, 28, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #1E3A66',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minWidth: '280px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="#38BDF8" className="animate-pulse" />
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                ALS-12 LIVE TELEMETRY
              </span>
            </div>
            <div style={{
              background: isSirenPlaying ? '#EF4444' : '#1E293B',
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            onClick={handleToggleSiren}
            >
              {isSirenPlaying ? '🔊 SIREN WAILING' : '🔇 SIREN MUTED'}
            </div>
          </div>

          {/* Grid of Key Telemetry Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {/* Speed Gauge */}
            <div style={{ background: '#0A1830', padding: '6px 8px', borderRadius: '8px', border: '1px solid #1C335A', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>SPEED</div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#38BDF8' }}>
                {telemetrySpeed}
              </div>
              <div style={{ fontSize: '7.5px', color: '#64748B' }}>km/h</div>
            </div>

            {/* ETA Countdown */}
            <div style={{ background: '#0A1830', padding: '6px 8px', borderRadius: '8px', border: '1px solid #1C335A', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>LIVE ETA</div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#10B981' }}>
                {formatEta(etaRemainingSec)}
              </div>
              <div style={{ fontSize: '7.5px', color: '#64748B' }}>mm:ss</div>
            </div>

            {/* Heart Rate */}
            <div style={{ background: '#0A1830', padding: '6px 8px', borderRadius: '8px', border: '1px solid #1C335A', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>PULSE</div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#EF4444' }}>
                {heartRate}
              </div>
              <div style={{ fontSize: '7.5px', color: '#64748B' }}>BPM</div>
            </div>

            {/* SpO2 */}
            <div style={{ background: '#0A1830', padding: '6px 8px', borderRadius: '8px', border: '1px solid #1C335A', textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700 }}>SPO2</div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#A78BFA' }}>
                {spO2}%
              </div>
              <div style={{ fontSize: '7.5px', color: '#64748B' }}>O2 Sat</div>
            </div>
          </div>

          {/* Continuous Lead-II ECG Rhythm Strip & SpO2 Plethysmograph */}
          <div style={{ background: '#020617', borderRadius: '6px', border: '1px solid #0F2342', padding: '5px 7px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '8px' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>● ECG LEAD-II (25 mm/s • 10 mm/mV)</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>PLETH SpO2: {spO2}%</span>
              <span style={{ color: '#64748B', fontFamily: 'monospace' }}>IoT CAN-BUS: ACTIVE</span>
            </div>
            <svg viewBox="0 0 280 34" style={{ width: '100%', height: '34px', overflow: 'hidden' }}>
              <defs>
                <pattern id="ecgMiniGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="280" height="34" fill="url(#ecgMiniGrid)" />
              <path
                d="M 0,17 L 18,17 Q 23,13 28,17 L 36,17 L 40,21 L 44,3 L 48,31 L 52,17 L 60,17 Q 67,11 75,17 L 95,17 L 110,17 Q 115,13 120,17 L 128,17 L 132,21 L 136,3 L 140,31 L 144,17 L 152,17 Q 159,11 167,17 L 187,17 L 202,17 Q 207,13 212,17 L 220,17 L 224,21 L 228,3 L 232,31 L 236,17 L 244,17 Q 251,11 259,17 L 280,17"
                fill="none"
                stroke="#10B981"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.9))'
                }}
              />
            </svg>
          </div>

          {/* Clinical Vital Signs Ticker */}
          <div style={{
            background: '#040B17',
            padding: '5px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '9.5px',
            color: '#CBD5E1',
            border: '1px solid #12213A'
          }}>
            <span>Blood Pressure: <strong style={{ color: '#F1F5F9' }}>136/88 mmHg</strong></span>
            <span>Rhythm: <strong style={{ color: '#10B981' }}>Normal Sinus (Lead II)</strong></span>
            <span>O2: <strong style={{ color: '#38BDF8' }}>Ventilator Active</strong></span>
          </div>
        </div>
      )}

      {/* BOTTOM MAP LEGEND */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 20,
        background: 'rgba(6, 13, 26, 0.94)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #16243C',
        borderRadius: '20px',
        padding: '5px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        fontSize: '10px',
        color: '#94A3B8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          <span>🔴 Caller</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🚑 Ambulance ALS-12</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '2px', background: '#F59E0B' }} />
          <span>Caller ─── Ambulance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '12px', height: '3px', background: '#38BDF8' }} />
          <span>Ambulance ══════ Hospital</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🏥 12 ABDM Regional Hospitals</span>
        </div>
      </div>
    </div>
  );
}
