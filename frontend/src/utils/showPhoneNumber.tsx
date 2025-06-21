export function getRandomVietnamesePhoneNumber() {
  const validPrefixes = [
    '032', '033', '034', '035', '036', '037', '038', '039', // Viettel
    '070', '076', '077', '078', '079',                     // MobiFone
    '081', '082', '083', '084', '085',                     // VinaPhone
    '056', '058',                                           // Vietnamobile
    '059'                                                  // Gmobile
  ];

  const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
  const suffix = Math.floor(Math.random() * 1_000_0000).toString().padStart(7, '0');

  return `${prefix}${suffix}`;
}


export function maskPhone(phone: string): string {
    if (phone.length !== 10) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}