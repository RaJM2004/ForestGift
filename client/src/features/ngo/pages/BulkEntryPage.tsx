import React, { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { createBulkTreeEntry, fetchBulkTreeEntries } from '../../../api';
import * as XLSX from 'xlsx';

export type BulkEntryPageProps = {
  ngoData: any;
  orders: any[];
};

export const BulkEntryPage = ({ ngoData, orders }: BulkEntryPageProps) => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [location, setLocation] = useState({ lat: 22.9734, lng: 78.6569 });
  const [searchDebounceId, setSearchDebounceId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounceId) {
        window.clearTimeout(searchDebounceId);
      }
    };
  }, [searchDebounceId]);

  const [bulkEntries, setBulkEntries] = useState<any[]>([]);
  const [treeCount, setTreeCount] = useState(100);
  const species = 'Native';
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [googleGeocodeError, setGoogleGeocodeError] = useState<string | null>(null);

  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocationLabel, setSelectedLocationLabel] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [excelEntries, setExcelEntries] = useState<any[]>([]);
  const [excelUploadError, setExcelUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeEntry = (raw: any) => ({
    ...raw,
    id: raw.id ?? raw._id ?? `bulk-${Date.now()}`,
    images: raw.images ?? [],
    createdAt: raw.createdAt ?? new Date().toISOString(),
  });

  useEffect(() => {
    const loadEntries = async () => {
      if (!ngoData?.id) return;
      try {
        const data = await fetchBulkTreeEntries(ngoData.id);
        setBulkEntries(Array.isArray(data) ? data.map(normalizeEntry) : []);
      } catch {
        setBulkEntries([]);
      }
    };

    loadEntries();
  }, [ngoData]);

  useEffect(() => {
    if (!selectedOrderId) {
      setTreeCount(ngoData?.trees ?? 100);
      return;
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    if (order?.tree_count != null) {
      setTreeCount(order.tree_count);
    }
  }, [selectedOrderId, orders, ngoData]);

  useEffect(() => {
    if (ngoData?.trees != null) {
      setTreeCount(ngoData.trees);
    }
  }, [ngoData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    if (selectedFiles.length) {
      setTreeCount(selectedFiles.length);
    } else if (ngoData?.trees != null) {
      setTreeCount(ngoData.trees);
    }

    if (!selectedFiles.length) {
      setFilePreviews([]);
      return;
    }

    const readers = selectedFiles.map((file) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    Promise.all(readers).then(setFilePreviews);
  };

  const searchLocation = async (
    query: string,
    setResults: React.Dispatch<React.SetStateAction<Array<{ display_name: string; lat: string; lon: string }>>>
  ) => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];

      setGoogleGeocodeError(null);
      setResults(results);
      return results;
    } catch {
      setGoogleGeocodeError('Location search request failed');
      setResults([]);
      return [];
    }
  };

  const handleSearchLocation = async () => {
    const results = await searchLocation(locationQuery, setSearchResults);
    if (results.length > 0) {
      handleSelectLocation(results[0].lat, results[0].lon, results[0].display_name);
    }
  };

  const moveMapToLocation = (lat: number, lng: number, zoom = 14) => {
    const map = mapRef.current ?? mapInstance;
    if (!map) return;
    map.setView([lat, lng], zoom, { animate: true });
  };

  const handleSelectLocation = (lat: string, lon: string, label: string) => {
    const parsedLat = Number(lat);
    const parsedLng = Number(lon);

    setLocation({ lat: parsedLat, lng: parsedLng });
    setLocationQuery(label);
    setSelectedLocationLabel(label);
    setSearchResults([]);

    moveMapToLocation(parsedLat, parsedLng);
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data.display_name as string | undefined;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    moveMapToLocation(location.lat, location.lng);
  }, [location, mapInstance]);

  const LocationPickerMarker = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });

        const label = await reverseGeocode(lat, lng);
        if (label) {
          setLocationQuery(label);
          setSelectedLocationLabel(label);
        }
      },
    });

    return (
      <Marker position={[location.lat, location.lng]}>
        <Popup>
          <div className="text-sm">Click on the map to select location.</div>
        </Popup>
      </Marker>
    );
  };

  const handleSubmit = async () => {
    if (!locationQuery.trim()) return;
    if (isSubmitting) return;

    if (selectedLocationLabel !== locationQuery) {
      const results = await searchLocation(locationQuery, setSearchResults);
      if (results.length > 0) {
        const first = results[0];
        setLocation({ lat: Number(first.lat), lng: Number(first.lon) });
        setSelectedLocationLabel(locationQuery);
      }
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    try {
      setIsSubmitting(true);
      const payload = {
        ngoId: ngoData?.id || ngoData?.name || '',
        orderId: selectedOrderId || undefined,
        userId: order?.id || undefined,
        lat: location.lat,
        lng: location.lng,
        location: locationQuery || ngoData?.area || '',
        species,
        count: files.length || treeCount,
        note,
        fileNames: files.map((f) => f.name),
        images: filePreviews,
      };

      const created = await createBulkTreeEntry(payload);
      setBulkEntries((prev) => [normalizeEntry(created), ...prev]);

      setTreeCount(ngoData?.trees ?? 100);
      setNote('');
      setSelectedOrderId('');
      setFiles([]);
      setFilePreviews([]);
      setLocationQuery('');
      setSelectedLocationLabel('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitExcelEntries = async () => {
    if (!excelEntries.length || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const createdEntries: any[] = [];

      for (const entry of excelEntries) {
        const payload = {
          ngoId: ngoData?.id || ngoData?.name || '',
          userId: undefined,
          lat: entry.lat,
          lng: entry.lng,
          location: entry.location || ngoData?.area || '',
          species: entry.species || species,
          count: entry.count || 1,
          note: entry.note || '',
          fileNames: [],
          images: Array.isArray(entry.images) ? entry.images : [],
        };

        const created = await createBulkTreeEntry(payload);
        createdEntries.push(normalizeEntry(created));
      }

      setBulkEntries((prev) => [...createdEntries, ...prev]);
      setExcelEntries([]);
      setGoogleGeocodeError(null);
    } catch (err) {
      console.error('Failed to submit Excel entries', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bulk Submission Map</h2>
          <p className="text-sm text-gray-500 mb-6">Select locations on the map for your bulk plantation report.</p>
          <div className="h-96 rounded-2xl overflow-hidden">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={8}
              scrollWheelZoom={false}
              ref={(mapContainer) => {
                if (mapContainer) {
                  setMapInstance(mapContainer);
                  mapRef.current = mapContainer;
                }
              }}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
              {bulkEntries.map((item) => (
                <Marker key={item.id} position={[item.lat, item.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <div className="text-xs text-gray-500">{item.count} trees</div>
                      <div className="text-xs font-semibold">{item.location || 'Location'}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <LocationPickerMarker />
            </MapContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bulk Plantation Entry</h2>
          <p className="text-sm text-gray-500 mb-6">Submit bulk tree data directly to the database.</p>
          
          <div className="space-y-4">
           
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Upload Excel (optional)</label>
              <div className="flex gap-2 mt-2 items-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setExcelUploadError(null);
                      const data = await file.arrayBuffer();
                      const workbook = XLSX.read(data, { type: 'array' });
                      const sheet = workbook.Sheets[workbook.SheetNames[0]];
                      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

                      const parsed = rows
                        .map((r) => ({
                          lat: Number(r.lat ?? r.Lat ?? r.latitude ?? r.Latitude ?? r.latitude),
                          lng: Number(r.lng ?? r.lon ?? r.Lon ?? r.longitude ?? r.Longitude ?? r.longitude),
                          location: r.location ?? r.Location ?? r.address ?? '',
                          count: Number(r.count ?? r.Count ?? 1),
                          note: r.note ?? r.Note ?? '',
                          species: r.species ?? r.Species ?? species,
                          images: typeof r.images === 'string' ? r.images.split(';').map((s: string) => s.trim()).filter(Boolean) : Array.isArray(r.images) ? r.images : [],
                        }))
                        .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

                      if (!parsed.length) {
                        setExcelUploadError('No valid rows found in the uploaded Excel file.');
                        setExcelEntries([]);
                        return;
                      }

                      const normalized = parsed.map((p) => normalizeEntry({ ...p, createdAt: new Date().toISOString() }));
                      setExcelEntries(normalized);
                    } catch (err) {
                      console.error('Failed to parse excel file', err);
                      setExcelUploadError('Failed to parse Excel file.');
                      setExcelEntries([]);
                    }
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              {excelUploadError && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {excelUploadError}
                </div>
              )}
              {excelEntries.length > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <div className="font-semibold">Excel upload ready to submit</div>
                  <div className="mt-2 text-xs text-slate-600">{excelEntries.length} row(s) parsed successfully.</div>
                  <div className="mt-3 flex flex-col gap-2">
                    {excelEntries.slice(0, 3).map((entry, idx) => (
                      <div key={idx} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs">
                        {entry.count} trees at {entry.location || `${entry.lat}, ${entry.lng}`}
                      </div>
                    ))}
                    {excelEntries.length > 3 && (
                      <div className="text-xs text-gray-500">+{excelEntries.length - 3} more rows</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmitExcelEntries}
                    disabled={isSubmitting}
                    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Excel rows...' : 'Submit Excel Rows'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Location Search</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={locationQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocationQuery(value);
                    if (searchDebounceId) window.clearTimeout(searchDebounceId);
                    const id = window.setTimeout(() => searchLocation(value, setSearchResults), 450);
                    setSearchDebounceId(id);
                  }}
                  placeholder="Search for a place"
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleSearchLocation}
                  className="px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Search
                </button>
              </div>
              {googleGeocodeError && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {googleGeocodeError}
                </div>
              )}
              {searchResults.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white">
                  {searchResults.map((result, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectLocation(result.lat, result.lon, result.display_name)}
                      className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-100"
                    >
                      {result.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Tree Count</label>
              <input
                type="number"
                value={treeCount}
                onChange={(e) => setTreeCount(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Proof Photos (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
              {filePreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {filePreviews.map((preview, idx) => (
                    <img key={idx} src={preview} alt={`Proof ${idx + 1}`} className="h-24 w-full object-cover rounded-xl" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !locationQuery.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bulk Tree'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {bulkEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Bulk Tree Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bulkEntries.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-sm font-bold text-gray-900">{item.count} Trees</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.location}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {item.lat?.toFixed?.(6) ?? item.lat}, {item.lng?.toFixed?.(6) ?? item.lng}
                </div>
                {item.orderId && <div className="text-[10px] text-indigo-600 font-bold mt-2">Order ID: {item.orderId}</div>}
                {Array.isArray(item.images) && item.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {item.images.slice(0, 4).map((image: string, idx: number) => (
                      <img key={idx} src={image} alt={`Bulk Tree ${idx + 1}`} className="h-20 w-full object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
