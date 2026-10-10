/**
 * ABDM Health Facility Registry (HFR) & AP Government Health Services Dataset
 * 
 * Compliant with:
 * - Ayushman Bharat Digital Mission (ABDM) HFR Facility Identity Standard
 * - AP Health, Medical & Family Welfare Department (HMFW AP) & APVVP
 * 
 * Two-Tier Decoupled Architecture:
 * - Tier 1: Static Authoritative Facility Registry (HFR ID, Ownership, Accredited Capabilities)
 * - Tier 2: Live Operational Telemetry (Diversion status, Bed availability, Acknowledgment tokens)
 */

export const ABDM_HFR_FACILITIES = [
  {
    hfrId: 'IN-AP-KRN-004812',
    officialName: 'Ramaiah Super Speciality Hospital',
    shortName: 'Ramaiah',
    facilityType: 'Super Speciality Tertiary Hospital',
    ownership: 'Private (NABH Accredited)',
    regulatoryBody: 'ABDM HFR & Andhra Pradesh Clinical Establishments Act',
    offsetLat: 0.0052,
    offsetLng: 0.0042,
    address: 'Collectorate Junction, Old City Corridor, Kurnool, AP - 518002',
    phone: '+91 8518-241108',
    cmo: 'Dr. K. Seshagiri Rao, MS (Ortho)',
    // Accredited Facility Capabilities (Tier 1)
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-2 Dedicated Trauma Center',
      cathLab: '24x7 Active Cath Lab (Digital Subtraction Angiography)',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: true,
      bloodBank: 'Licensed Component Blood Center (24x7)',
      ambulanceBay: 'Direct Drive-In Resuscitation Bay'
    },
    // Dynamic Operational Telemetry (Tier 2)
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 8,
      icuBedsAvailable: 4,
      ventilatorsAvailable: 3,
      resuscitationBayAssigned: 'Bay #02 (STEMI / Resus)',
      lastVerifiedAt: '18 sec ago',
      source: 'ABDM Fast Healthcare Interoperability Bridge'
    },
    matchJustification: 'Optimal candidate: Lowest road ETA (4m) + Dedicated 24x7 Cath Lab for acute coronary syndromes + ABDM accredited resuscitation bay'
  },
  {
    hfrId: 'IN-AP-KRN-001082',
    officialName: 'District Government General Hospital (GGH) - Kurnool Medical College',
    shortName: 'Govt GGH Apex',
    facilityType: 'Apex Government Medical College & Hospital',
    ownership: 'Government of Andhra Pradesh (DME / HMFW AP)',
    regulatoryBody: 'Directorate of Medical Education, Govt of AP & ABDM',
    offsetLat: 0.0168,
    offsetLng: -0.0025,
    address: 'Hospital Road, Central Civil Lines, Kurnool, AP - 518001',
    phone: '+91 8518-220108',
    cmo: 'Dr. C. Prabhakar Reddy, MS (Superintendent)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Apex Level-1 Trauma & Comprehensive Burn Center',
      cathLab: '24x7 Government Cath Lab Center',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: true,
      bloodBank: 'District Apex Blood Bank & Cryoprecipitate Hub',
      ambulanceBay: 'Dedicated 108 Emergency Entrance'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 14,
      icuBedsAvailable: 6,
      ventilatorsAvailable: 5,
      resuscitationBayAssigned: 'Apex Red Resuscitation Bay #01',
      lastVerifiedAt: '25 sec ago',
      source: 'HMFW AP State Health Emergency Telemetry'
    },
    matchJustification: 'Apex public tertiary hub: Level-1 trauma capability with 14 available emergency beds and 6 ventilator-equipped ICUs'
  },
  {
    hfrId: 'IN-AP-KRN-009144',
    officialName: 'KIMS Super Speciality Hospital',
    shortName: 'KIMS',
    facilityType: 'Multi-Speciality Tertiary Care Hospital',
    ownership: 'Private (NABH Accredited)',
    regulatoryBody: 'ABDM HFR & AP State Health Authority',
    offsetLat: -0.0125,
    offsetLng: -0.0085,
    address: 'NH-44 Express Bypass Road, Kurnool, AP - 518003',
    phone: '+91 8518-299108',
    cmo: 'Dr. P. Sandeep Kumar, DNB (Cardiology)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-1 Tertiary Polytrauma Center',
      cathLab: '24x7 Biplane Cath Lab',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: true,
      bloodBank: '24x7 Component Blood Bank',
      ambulanceBay: 'Direct Tri-Corridor Ambulance Ramp'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 6,
      icuBedsAvailable: 3,
      ventilatorsAvailable: 4,
      resuscitationBayAssigned: 'Critical Bay #04',
      lastVerifiedAt: '42 sec ago',
      source: 'Hospital Information System (HIS) ABDM Bridge'
    },
    matchJustification: 'Comprehensive multi-disciplinary center: 24x7 biplane Cath Lab and neuro-trauma surgical suites on standby'
  },
  {
    hfrId: 'IN-AP-KRN-003319',
    officialName: 'Life Line Emergency & Critical Care Hospital',
    shortName: 'Life Line',
    facilityType: 'Dedicated Critical Care & Emergency Hospital',
    ownership: 'Private Emergency Center',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: -0.0068,
    offsetLng: 0.0118,
    address: 'Gandhi Nagar Main Road, Kurnool, AP - 518002',
    phone: '+91 8518-245108',
    cmo: 'Dr. V. Ramana Murthy, MD (Emergency Medicine)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-3 Acute Trauma Care',
      cathLab: 'Cardiology Stabilization Unit',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'Cross-Matched Emergency Blood Reserve',
      ambulanceBay: 'Emergency Receiving Bay'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 5,
      icuBedsAvailable: 2,
      ventilatorsAvailable: 2,
      resuscitationBayAssigned: 'Acute Bay #01',
      lastVerifiedAt: '1 min ago',
      source: 'ABDM HFR Verified Clinic'
    },
    matchJustification: 'Rapid road proximity (6 min ETA) with dedicated resuscitation bay and 2 available ICU beds'
  },
  {
    hfrId: 'IN-AP-KRN-007201',
    officialName: 'Apollo Specialty Emergency Hospital',
    shortName: 'Apollo',
    facilityType: 'Super Speciality Hospital',
    ownership: 'Corporate (NABH / JCI Accredited)',
    regulatoryBody: 'National Health Authority ABDM Registry',
    offsetLat: -0.0192,
    offsetLng: 0.0055,
    address: 'Revenue Colony Highway, Kurnool, AP - 518004',
    phone: '+91 8518-280108',
    cmo: 'Dr. A. Srinivas, MCh (Cardiothoracic)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-2 Trauma & Cardiothoracic Surgery',
      cathLab: '24x7 Dual Cath Lab & Hybrid OR',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: true,
      bloodBank: 'AABB Accredited Blood Center',
      ambulanceBay: 'Covered High-Speed Ambulance Terminal'
    },
    liveStatus: {
      diversionStatus: 'BUSY_ACCEPTING',
      acceptingEmergencies: true,
      totalBedsAvailable: 3,
      icuBedsAvailable: 2,
      ventilatorsAvailable: 2,
      resuscitationBayAssigned: 'Cardiac Emergency Bay #03',
      lastVerifiedAt: '1 min ago',
      source: 'Apollo Apollo24/7 EMR Gateway'
    },
    matchJustification: 'Advanced cardiothoracic surgical capabilities with ECMO backup and hybrid catheterization laboratory'
  },
  {
    hfrId: 'IN-AP-KRN-002155',
    officialName: 'Sree Sai Emergency & Trauma Hospital',
    shortName: 'Sree Sai',
    facilityType: 'Secondary Emergency Hospital',
    ownership: 'Private Healthcare Facility',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: 0.0115,
    offsetLng: 0.0138,
    address: 'Station Road, Old Gooty Highway, Kurnool, AP - 518001',
    phone: '+91 8518-221108',
    cmo: 'Dr. G. Lakshmi Narayana, MBBS, MEM',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Trauma Resuscitation Unit',
      cathLab: 'Basic Cardiac Monitoring',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'Storage Facility',
      ambulanceBay: 'Direct Entrance'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 4,
      icuBedsAvailable: 1,
      ventilatorsAvailable: 1,
      resuscitationBayAssigned: 'Bay #01',
      lastVerifiedAt: '2 min ago',
      source: 'ABDM Telemetry'
    },
    matchJustification: 'Convenient railway corridor emergency facility suitable for vital stabilization'
  },
  {
    hfrId: 'IN-AP-KRN-008933',
    officialName: 'Medicover Hospitals Kurnool',
    shortName: 'Medicover',
    facilityType: 'Tertiary Care Hospital',
    ownership: 'Private European Standard Healthcare Group',
    regulatoryBody: 'ABDM HFR Registry',
    offsetLat: 0.0045,
    offsetLng: -0.0155,
    address: 'Sampath Nagar Main Road, Kurnool, AP - 518003',
    phone: '+91 8518-261108',
    cmo: 'Dr. S. Venkat Rao, MD (Critical Care)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-2 Trauma & Cardiac Care',
      cathLab: '24x7 Emergency Cath Lab',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: true,
      bloodBank: 'Component Separation Unit',
      ambulanceBay: 'Ambulance Dock #01'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 7,
      icuBedsAvailable: 3,
      ventilatorsAvailable: 3,
      resuscitationBayAssigned: 'CCU Trauma Bay',
      lastVerifiedAt: '50 sec ago',
      source: 'Medicover Central EHR Bridge'
    },
    matchJustification: 'European standard acute critical care facility with rapid catheterization capabilities'
  },
  {
    hfrId: 'IN-AP-KRN-005612',
    officialName: 'Sunrise Acute Care Hospital',
    shortName: 'Sunrise',
    facilityType: 'Acute Medical Hospital',
    ownership: 'Private Facility',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: -0.0085,
    offsetLng: -0.0175,
    address: 'Bellary Sector Ring Road, Kurnool, AP - 518004',
    phone: '+91 8518-250108',
    cmo: 'Dr. M. Haritha, MD (Gen Med)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Emergency Resuscitation & Dialysis Unit',
      cathLab: 'Non-Invasive Cardiology',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'Emergency Reserve',
      ambulanceBay: 'Single Bay Ramp'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 4,
      icuBedsAvailable: 1,
      ventilatorsAvailable: 1,
      resuscitationBayAssigned: 'Bay #02',
      lastVerifiedAt: '3 min ago',
      source: 'ABDM HFR Gateway'
    },
    matchJustification: 'Acute medical management center with emergency dialysis and non-invasive cardiac telemetry'
  },
  {
    hfrId: 'IN-AP-KRN-006741',
    officialName: 'Care Multi-Speciality Hospital',
    shortName: 'Care Hosp',
    facilityType: 'Multi-Speciality Hospital',
    ownership: 'Private NABH Facility',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: -0.0225,
    offsetLng: -0.0115,
    address: 'Joharapuram Main Road, Kurnool, AP - 518002',
    phone: '+91 8518-270108',
    cmo: 'Dr. T. Rajesh, MS (Ortho & Polytrauma)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Level-2 Polytrauma & Orthopedic Unit',
      cathLab: 'Interventional Cardiology Suite',
      icu: true,
      cardiacSurgery: true,
      strokeUnit: false,
      bloodBank: 'Component Unit',
      ambulanceBay: 'Dedicated Ambulance Entrance'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 6,
      icuBedsAvailable: 2,
      ventilatorsAvailable: 2,
      resuscitationBayAssigned: 'Trauma Bay #01',
      lastVerifiedAt: '2 min ago',
      source: 'Care Hospitals Network Telemetry'
    },
    matchJustification: 'Specialized polytrauma and orthopedic surgical center with active resuscitation suites'
  },
  {
    hfrId: 'IN-AP-KRN-003889',
    officialName: 'Ayush Emergency Trauma Center',
    shortName: 'Ayush Trauma',
    facilityType: 'Emergency & Polytrauma Center',
    ownership: 'Private Healthcare Center',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: 0.0138,
    offsetLng: 0.0105,
    address: 'Mourya Junction, Bellary Bypass, Kurnool, AP - 518003',
    phone: '+91 8518-232108',
    cmo: 'Dr. N. Bhanu Murthy, MS (Gen Surgery)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Acute Surgical Resuscitation Unit',
      cathLab: 'Cardiac Monitoring Unit',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'Blood Bank On Premises',
      ambulanceBay: 'Drive-Through Ambulance Bay'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 5,
      icuBedsAvailable: 2,
      ventilatorsAvailable: 1,
      resuscitationBayAssigned: 'Bay #03',
      lastVerifiedAt: '4 min ago',
      source: 'ABDM Gateway'
    },
    matchJustification: 'Acute surgical resuscitation unit with in-house component blood bank'
  },
  {
    hfrId: 'IN-AP-KRN-001928',
    officialName: 'City Critical Care Hospital',
    shortName: 'City Critical',
    facilityType: 'Intensive Care Center',
    ownership: 'Private Intensive Care Center',
    regulatoryBody: 'ABDM HFR Registered',
    offsetLat: -0.0012,
    offsetLng: 0.0208,
    address: 'East Central Road, Budhawarapet, Kurnool, AP - 518002',
    phone: '+91 8518-212108',
    cmo: 'Dr. B. Raghuram, MD (Chest & Critical Care)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Medical Intensive Care Unit',
      cathLab: 'Basic Telemetry',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'Emergency Reserve',
      ambulanceBay: 'Single Ambulance Bay'
    },
    liveStatus: {
      diversionStatus: 'BUSY',
      acceptingEmergencies: true,
      totalBedsAvailable: 2,
      icuBedsAvailable: 1,
      ventilatorsAvailable: 1,
      resuscitationBayAssigned: 'MICU Bed #05',
      lastVerifiedAt: '2 min ago',
      source: 'City Critical Care Telemetry'
    },
    matchJustification: 'Intensive medical care center specializing in acute respiratory stabilization'
  },
  {
    hfrId: 'IN-AP-KRN-001099',
    officialName: 'APVVP Area Hospital - Kurnool Division',
    shortName: 'APVVP Area Hosp',
    facilityType: 'Government Area Hospital (APVVP)',
    ownership: 'Government of Andhra Pradesh (APVVP / HMFW AP)',
    regulatoryBody: 'AP Vaidya Vidhana Parishad (APVVP) & ABDM',
    offsetLat: 0.0198,
    offsetLng: 0.0015,
    address: 'Court Compound Feeder Road, Kurnool, AP - 518001',
    phone: '+91 8518-223108',
    cmo: 'Dr. M. Sridhar, MS (Civil Surgeon Specialist)',
    capabilities: {
      emergencyDepartment: true,
      traumaTier: 'Secondary Trauma Resuscitation Unit',
      cathLab: 'Government Cardiac Care Unit',
      icu: true,
      cardiacSurgery: false,
      strokeUnit: false,
      bloodBank: 'APVVP Regional Blood Bank',
      ambulanceBay: '108 Dedicated Bay'
    },
    liveStatus: {
      diversionStatus: 'OPEN',
      acceptingEmergencies: true,
      totalBedsAvailable: 9,
      icuBedsAvailable: 3,
      ventilatorsAvailable: 2,
      resuscitationBayAssigned: 'APVVP Emergency Bay #02',
      lastVerifiedAt: '1 min ago',
      source: 'APVVP State Portal & ABDM HFR'
    },
    matchJustification: 'Authoritative state public secondary hospital with 9 available beds and direct 108 emergency intake'
  }
];
