/**
 * auditLedgerService.js
 * Implements Phase 15: Cryptographic SHA-256 tamper-evident clinical audit ledger.
 * Chains every emergency dispatch, prescription issuance, and vital recording
 * into a cryptographic blockchain-like block ledger to prove non-tampering under DPDP Act 2023.
 */

const LEDGER_STORAGE_KEY = 'ayuswar_clinical_audit_ledger_v1';

// Fast pure JS SHA-256 implementation for universal browser/node support
function sha256Pure(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeArray = ascii + '\x80';
  while (compositeArray[lengthProperty] % 64 - 56) compositeArray += '\x00';
  for (i = 0; i < compositeArray[lengthProperty]; i++) {
    j = compositeArray.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15], w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

export const getAuditLedger = () => {
  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (!raw) {
      // Genesis Block
      const genesisBlock = {
        index: 0,
        timestamp: '2026-10-17T00:00:00.000Z',
        eventType: 'GENESIS_BOOTSTRAP',
        actor: 'SYSTEM_ROOT',
        details: 'AyuSwar AI Clinical Safety Sentinel Genesis Block',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      };
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify([genesisBlock]));
      return [genesisBlock];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const recordAuditBlock = (eventType, actor, details) => {
  try {
    const ledger = getAuditLedger();
    const previousBlock = ledger[ledger.length - 1] || { hash: '0000' };
    const newIndex = ledger.length;
    const timestamp = new Date().toISOString();
    const dataString = `${newIndex}-${timestamp}-${eventType}-${actor}-${JSON.stringify(details)}-${previousBlock.hash}`;
    const hash = sha256Pure(dataString);

    const newBlock = {
      index: newIndex,
      timestamp,
      eventType,
      actor,
      details,
      previousHash: previousBlock.hash,
      hash
    };

    const updatedLedger = [...ledger, newBlock];
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(updatedLedger));
    return newBlock;
  } catch (e) {
    console.error('Audit block record error:', e);
    return null;
  }
};

export const verifyLedgerIntegrity = () => {
  const ledger = getAuditLedger();
  if (ledger.length <= 1) return { isValid: true, count: ledger.length };

  for (let i = 1; i < ledger.length; i++) {
    const current = ledger[i];
    const previous = ledger[i - 1];

    if (current.previousHash !== previous.hash) {
      return { isValid: false, corruptedIndex: i, reason: 'Broken hash pointer' };
    }

    const recomputedString = `${current.index}-${current.timestamp}-${current.eventType}-${current.actor}-${JSON.stringify(current.details)}-${current.previousHash}`;
    const recomputedHash = sha256Pure(recomputedString);

    if (recomputedHash !== current.hash) {
      return { isValid: false, corruptedIndex: i, reason: 'Tampered block payload' };
    }
  }

  return { 
    isValid: true, 
    count: ledger.length, 
    latestHash: ledger[ledger.length - 1].hash.substring(0, 16) + '...'
  };
};
