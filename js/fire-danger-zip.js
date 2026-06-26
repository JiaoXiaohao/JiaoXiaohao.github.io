(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.FireDangerZip = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const encoder = new TextEncoder();
  const crcTable = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    crcTable[i] = value >>> 0;
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function writeUInt16(bytes, offset, value) {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >>> 8) & 0xff;
  }

  function writeUInt32(bytes, offset, value) {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >>> 8) & 0xff;
    bytes[offset + 2] = (value >>> 16) & 0xff;
    bytes[offset + 3] = (value >>> 24) & 0xff;
  }

  function dosDateTime(date) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    return { dosDate, dosTime };
  }

  function normalizeFilename(name, usedNames) {
    const baseName = String(name || 'download.bin')
      .replace(/\\/g, '/')
      .split('/')
      .filter(Boolean)
      .pop() || 'download.bin';
    const cleanName = baseName.replace(/[\u0000-\u001f]/g, '_');
    let candidate = cleanName;
    let counter = 2;

    while (usedNames.has(candidate)) {
      const dot = cleanName.lastIndexOf('.');
      candidate = dot > 0
        ? `${cleanName.slice(0, dot)}-${counter}${cleanName.slice(dot)}`
        : `${cleanName}-${counter}`;
      counter += 1;
    }

    usedNames.add(candidate);
    return candidate;
  }

  async function bytesFrom(data) {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      return new Uint8Array(await data.arrayBuffer());
    }
    return encoder.encode(String(data ?? ''));
  }

  function localFileHeader(entry) {
    const header = new Uint8Array(30 + entry.nameBytes.length);
    writeUInt32(header, 0, 0x04034b50);
    writeUInt16(header, 4, 20);
    writeUInt16(header, 6, 0x0800);
    writeUInt16(header, 8, 0);
    writeUInt16(header, 10, entry.dosTime);
    writeUInt16(header, 12, entry.dosDate);
    writeUInt32(header, 14, entry.crc);
    writeUInt32(header, 18, entry.bytes.length);
    writeUInt32(header, 22, entry.bytes.length);
    writeUInt16(header, 26, entry.nameBytes.length);
    writeUInt16(header, 28, 0);
    header.set(entry.nameBytes, 30);
    return header;
  }

  function centralDirectoryHeader(entry) {
    const header = new Uint8Array(46 + entry.nameBytes.length);
    writeUInt32(header, 0, 0x02014b50);
    writeUInt16(header, 4, 20);
    writeUInt16(header, 6, 20);
    writeUInt16(header, 8, 0x0800);
    writeUInt16(header, 10, 0);
    writeUInt16(header, 12, entry.dosTime);
    writeUInt16(header, 14, entry.dosDate);
    writeUInt32(header, 16, entry.crc);
    writeUInt32(header, 20, entry.bytes.length);
    writeUInt32(header, 24, entry.bytes.length);
    writeUInt16(header, 28, entry.nameBytes.length);
    writeUInt16(header, 30, 0);
    writeUInt16(header, 32, 0);
    writeUInt16(header, 34, 0);
    writeUInt16(header, 36, 0);
    writeUInt32(header, 38, 0);
    writeUInt32(header, 42, entry.localOffset);
    header.set(entry.nameBytes, 46);
    return header;
  }

  function endOfCentralDirectory(entryCount, centralDirectorySize, centralDirectoryOffset) {
    const record = new Uint8Array(22);
    writeUInt32(record, 0, 0x06054b50);
    writeUInt16(record, 4, 0);
    writeUInt16(record, 6, 0);
    writeUInt16(record, 8, entryCount);
    writeUInt16(record, 10, entryCount);
    writeUInt32(record, 12, centralDirectorySize);
    writeUInt32(record, 16, centralDirectoryOffset);
    writeUInt16(record, 20, 0);
    return record;
  }

  function concat(chunks, totalLength) {
    const result = new Uint8Array(totalLength);
    let offset = 0;
    chunks.forEach((chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });
    return result;
  }

  async function createZip(files) {
    const usedNames = new Set();
    const timestamp = dosDateTime(new Date());
    const entries = [];
    const chunks = [];
    let offset = 0;

    for (const file of files) {
      const name = normalizeFilename(file.name, usedNames);
      const bytes = await bytesFrom(file.data);
      const entry = {
        name,
        nameBytes: encoder.encode(name),
        bytes,
        crc: crc32(bytes),
        dosDate: timestamp.dosDate,
        dosTime: timestamp.dosTime,
        localOffset: offset
      };
      const header = localFileHeader(entry);
      entries.push(entry);
      chunks.push(header, bytes);
      offset += header.length + bytes.length;
    }

    const centralDirectoryOffset = offset;
    entries.forEach((entry) => {
      const header = centralDirectoryHeader(entry);
      chunks.push(header);
      offset += header.length;
    });

    const centralDirectorySize = offset - centralDirectoryOffset;
    const endRecord = endOfCentralDirectory(entries.length, centralDirectorySize, centralDirectoryOffset);
    chunks.push(endRecord);

    return new Blob([concat(chunks, offset + endRecord.length)], { type: 'application/zip' });
  }

  return {
    createZip
  };
});
