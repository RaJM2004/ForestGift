const XLSX = require('xlsx');
const data = [
  {
    lat: 23.2599,
    lng: 77.4126,
    location: 'Satpura Tiger Reserve, Block A',
    count: 5,
    note: 'Native tree planting batch',
    orderId: 'ORD001',
    species: 'Teak',
    images: 'https://example.com/photo1.jpg;https://example.com/photo2.jpg'
  },
  {
    lat: 22.7196,
    lng: 75.8577,
    location: 'Bhopal Plantation Site',
    count: 3,
    note: 'Community planting',
    orderId: 'ORD002',
    species: 'Neem',
    images: ''
  }
];
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
XLSX.writeFile(wb, '../sample_bulk_entry.xlsx');
console.log('Created sample_bulk_entry.xlsx');
