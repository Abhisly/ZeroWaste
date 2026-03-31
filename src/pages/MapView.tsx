import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Package, Phone, MessageSquare } from 'lucide-react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { cn } from '@/lib/utils';

interface MapViewProps {
    onClose: () => void;
    onComplete: () => void;
    delivery: any;
}

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = { lat: 28.6139, lng: 77.2090 };
const origin = { lat: 28.5355, lng: 77.2410 };
const destination = { lat: 28.6505, lng: 77.2303 };

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#050505" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#1f1f1f" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

export default function MapView({ onClose, onComplete, delivery }: MapViewProps) {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [eta, setEta] = useState(12);

    // Provide your own Google Maps API Key here or via env. If empty, it'll show a development map.
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const directionsCallback = (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
    ) => {
        if (status === 'OK' && result) {
            setDirections(result);
            if (result.routes[0]?.legs[0]?.duration?.text) {
                const durationText = result.routes[0].legs[0].duration.text;
                const numericEta = parseInt(durationText.replace(/\D/g, ''));
                if (!isNaN(numericEta)) setEta(numericEta);
            }
        }
    };

    return (
        <div className="relative h-screen w-full bg-[#050505] border-none font-sans">
            {/* API Loaded Google Map */}
            <div className="absolute inset-0">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={12}
                        options={{
                            styles: darkMapStyle,
                            disableDefaultUI: true,
                            zoomControl: true,
                        }}
                    >
                        {!directions && (
                            <DirectionsService
                                options={{
                                    destination: destination,
                                    origin: origin,
                                    travelMode: google.maps.TravelMode.DRIVING
                                }}
                                callback={directionsCallback}
                            />
                        )}
                        {directions && (
                            <DirectionsRenderer
                                options={{
                                    directions: directions,
                                    polylineOptions: {
                                        strokeColor: "#14b8a6", // Teal line matching theme
                                        strokeWeight: 6,
                                        strokeOpacity: 0.8
                                    },
                                    suppressMarkers: false,
                                }}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 font-black tracking-widest text-sm uppercase">
                        INITIALIZING SATELLITE LINK...
                    </div>
                )}
            </div>

            {/* Top Bar Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-20">
                <button
                    onClick={onClose}
                    className="pointer-events-auto p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 text-white hover:bg-black/80 transition-all shadow-2xl"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="bg-black/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-2xl min-w-[320px] pointer-events-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">ETA TO DESTINATION</p>
                            <h2 className="text-4xl font-display font-black text-white">{eta} MINS</h2>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-semibold text-gray-300">Live: Heading to {delivery.ngo}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Panel Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none z-20">
                <div className="bg-black/90 backdrop-blur-3xl w-full max-w-4xl p-8 rounded-[40px] border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-6 flex-1 text-left">
                        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-xl">
                            <Package className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1">{delivery.type} Rescue</h3>
                            <p className="text-gray-400 font-semibold">From: <span className="text-white">{delivery.restaurant}</span></p>
                        </div>
                    </div>

                    <div className="h-12 w-px bg-white/10 hidden md:block" />

                    <div className="flex gap-4">
                        <div className="flex items-center gap-4 text-left">
                            <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                <Phone className="w-6 h-6" />
                            </button>
                            <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                <MessageSquare className="w-6 h-6" />
                            </button>
                        </div>
                        <button
                            onClick={onComplete}
                            className="px-10 py-5 bg-blue-600 rounded-[24px] text-white font-black text-lg hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20"
                        >
                            Confirm Delivery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
