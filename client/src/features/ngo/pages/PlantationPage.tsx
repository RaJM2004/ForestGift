import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { createSubmission, fetchSubmissions } from '../../../api';

export type PlantationPageProps = {
  ngoData: any;
  orders: any[];
  onSubmissionsCreated?: (created: any[]) => void;
};

export const PlantationPage = ({ ngoData, orders, onSubmissionsCreated }: PlantationPageProps) => {
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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [treeCount, setTreeCount] = useState(100);
  const species = 'Native';
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [googleGeocodeError, setGoogleGeocodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  type LocationPoint = {
    id: string;
    lat: number;
    lng: number;
    locationLabel: string;
    count: number;
    fileNames: string[];
    proofs: string[];
  };

  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  // One point = one tree (Tree 1, Tree 2, ...)
  const [treesForThisLocation] = useState<number>(1);

  const normalizeSubmission = (raw: any) => ({
    ...raw,
    id: raw.id ?? raw._id ?? `sub-${Date.now()}`,
    proofs: raw.proofs ?? [],
    createdAt: raw.createdAt ?? new Date().toISOString(),
  });

  // If an order is selected, use its tree_count as the default tree count.
  useEffect(() => {
    if (!selectedOrderId) {
      setTreeCount(ngoData?.trees ?? 100);
      resetLocationPoints();
      return;
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    if (order?.tree_count != null) {
      setTreeCount(order.tree_count);
      resetLocationPoints();
    }
  }, [selectedOrderId, orders, ngoData]);

  // Default tree count should be driven by user / NGO data.
  useEffect(() => {
    if (ngoData?.trees != null) {
      setTreeCount(ngoData.trees);
    }
  }, [ngoData]);

  const allocatedTrees = useMemo(
    () => locationPoints.reduce((sum, p) => sum + Number(p.count || 0), 0),
    [locationPoints]
  );

  const remainingTrees = Math.max(0, Number(treeCount || 0) - allocatedTrees);

  const resetLocationPoints = () => {
    setLocationPoints([]);
  };

  useEffect(() => {
    // Keep remaining trees consistent when treeCount changes.
    if (allocatedTrees > Number(treeCount || 0)) {
      resetLocationPoints();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeCount]);

  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocationLabel, setSelectedLocationLabel] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

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

  const resetCurrentEvidence = () => {
    setFiles([]);
    setFilePreviews([]);
  };

  const geocode = async (query: string) => {
    if (!query.trim()) return null;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
      }
    } catch {
      // ignore
    }

    return null;
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!ngoData?.id) return;
      try {
        const data = await fetchSubmissions(ngoData.id);
        setSubmissions(Array.isArray(data) ? data.map(normalizeSubmission) : []);
      } catch {
        setSubmissions([]);
      }
    };

    loadSubmissions();
  }, [ngoData]);

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

    // Prefer setView to ensure map zoom updates consistently.
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

  // Whenever the selected location changes or the map becomes ready, ensure the map is centered.
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
          <div className="text-sm">Select a location, then add it as a point.</div>
        </Popup>
      </Marker>
    );
  };

  const handleAddLocationPoint = () => {
    const total = Number(treeCount || 0);
    if (total <= 0) return;

    const order = orders.find((o) => o.id === selectedOrderId);
    const label = locationQuery || selectedLocationLabel || order?.location || ngoData?.area || '';

    if (!label.trim()) return;

    // Flow requested: Tree N has exactly 1 location + its own images.
    const count = 1;
    if (remainingTrees < 1) return;

    const point: LocationPoint = {
      id: `pt-${Date.now()}`,
      lat: Number(location.lat),
      lng: Number(location.lng),
      locationLabel: label,
      count,
      fileNames: files.map((f) => f.name),
      proofs: filePreviews,
    };

    setLocationPoints((prev) => [...prev, point]);
    resetCurrentEvidence();
  };

  const handleRemoveLocationPoint = (id: string) => {
    setLocationPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = orders.find((o) => o.id === selectedOrderId);

    const total = Number(treeCount || 0);
    if (locationPoints.length === 0) return;
    if (allocatedTrees !== total) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const createdMany: any[] = [];
      for (const point of locationPoints) {
        const payload = {
          ngoId: ngoData?.id || ngoData?.name || '',
          orderId: selectedOrderId || undefined,
          userId: order?.id || undefined, // This is crucial for matching!
          lat: point.lat,
          lng: point.lng,
          location: point.locationLabel || locationQuery || order?.location || ngoData?.area || '',
          species,
          count: point.count,
          note,
          fileNames: point.fileNames,
          proofs: point.proofs,
        };

        const created = await createSubmission(payload);
        createdMany.push(normalizeSubmission(created));
      }

      setSubmissions((prev) => [...createdMany, ...prev]);
      onSubmissionsCreated?.(createdMany);
    } catch {
      // keep local state even if backend fails
      const createdMany: any[] = [];
      for (const point of locationPoints) {
        const id = `sub-${Date.now()}-${point.id}`;
        createdMany.push(
          normalizeSubmission({
            id,
            ngoId: ngoData?.id || ngoData?.name || '',
            orderId: selectedOrderId || undefined,
            userId: order?.id || undefined,
            lat: point.lat,
            lng: point.lng,
            location: point.locationLabel || locationQuery || order?.location || ngoData?.area || '',
            species,
            count: point.count,
            note,
            fileNames: point.fileNames,
            createdAt: new Date().toISOString(),
            proofs: point.proofs,
          })
        );
      }
      setSubmissions((prev) => [...createdMany, ...prev]);
      onSubmissionsCreated?.(createdMany);
    } finally {
      setIsSubmitting(false);
    }

    setTreeCount(ngoData?.trees ?? 100);
    setNote('');
    setSelectedOrderId('');
    resetCurrentEvidence();
    setLocationQuery('');
    setSelectedLocationLabel('');
    setLocation({ lat: 22.9734, lng: 78.6569 });
    resetLocationPoints();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Field Submission Map</h2>
          <p className="text-sm text-gray-500 mb-6">Use the map to visualize submitted plantation locations.</p>
          <div className="h-96 rounded-2xl overflow-hidden">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={8}
              scrollWheelZoom={false}
              ref={(mapContainer) => {
                if (mapContainer) {
                  const map = mapContainer;
                  if (map) {
                    setMapInstance(map);
                    mapRef.current = map;
                  }
                }
              }}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
              {submissions.map((sub) => (
                <Marker key={sub.id} position={[sub.lat, sub.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <div className="text-xs text-gray-500">{sub.count} trees</div>
                      <div className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleString()}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {locationPoints.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <div className="text-xs text-gray-600 font-semibold">{p.count} trees</div>
                      <div className="text-xs text-gray-600">{p.locationLabel}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <LocationPickerMarker />
            </MapContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Report a Plantation</h2>
              <p className="text-sm text-gray-500">Add planting evidence with location, photos, and order link.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Associated Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
              >
                <option value="">Select an order (optional)</option>
                {orders
                  .filter((order) => {
                    const isCompleted = (order.status || '').toString().toLowerCase() === 'planted';
                    const hasSubmission = submissions.some(
                      (sub) => (sub.orderId || sub.order || '').toString() === order.id.toString()
                    );
                    return !isCompleted && !hasSubmission;
                  })
                  .map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.name} ({order.status})
                    </option>
                  ))}
              </select>
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
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Location Search</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={locationQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocationQuery(value);

                    if (searchDebounceId) {
                      window.clearTimeout(searchDebounceId);
                    }

                    const id = window.setTimeout(() => {
                      searchLocation(value, setSearchResults);
                    }, 450);

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

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Latitude</label>
                  <input
                    value={location.lat}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Longitude</label>
                  <input
                    value={location.lng}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-4">
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
                      <img
                        key={idx}
                        src={preview}
                        alt={`Proof ${idx + 1}`}
                        className="h-28 w-full object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Tree mapping step
                    </label>
                    <div className="mt-2 text-[11px] text-gray-600">
                      Select location + upload images for <span className="font-semibold">Tree {allocatedTrees + 1}</span> of{' '}
                      <span className="font-semibold">{treeCount}</span>.
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      Remaining trees to allocate: <span className="font-semibold">{remainingTrees}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLocationPoint}
                    disabled={
                      remainingTrees <= 0 ||
                      (!locationQuery.trim() && !selectedLocationLabel.trim()) ||
                      filePreviews.length === 0
                    }
                    className="h-10 mt-6 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Add Point
                  </button>
                </div>

                {locationPoints.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                      Added Locations
                    </div>
                    <ul className="space-y-2">
                      {locationPoints.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3"
                        >
                          <div>
                            <div className="text-xs font-semibold text-gray-900">{p.count} trees</div>
                            <div className="text-[11px] text-gray-500 line-clamp-2">{p.locationLabel}</div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveLocationPoint(p.id)}
                            className="text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Notes</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSubmitting || locationPoints.length === 0 || allocatedTrees !== Number(treeCount || 0)}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Plantation Report'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Submissions</h3>
            <ul className="space-y-2">
              {submissions.map((sub) => (
                <li key={sub.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500">{sub.count} trees</div>
                      {sub.orderId && (
                        <div className="text-xs text-gray-500">
                          Order: <span className="font-medium text-gray-700">{sub.orderId}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>
                  {sub.note && <div className="mt-2 text-xs text-gray-500">{sub.note}</div>}
                  {sub.proofs?.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {sub.proofs.map((proof: string, idx: number) => (
                        <img
                          key={idx}
                          src={proof}
                          alt={`Proof ${idx + 1}`}
                          className="h-28 w-full object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
