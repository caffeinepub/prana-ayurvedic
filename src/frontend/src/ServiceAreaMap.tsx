import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Chandapura, Bangalore coordinates
const CHANDAPURA_LAT = 12.8185;
const CHANDAPURA_LNG = 77.7066;
const RADIUS_KM = 15;

// Extend window type for leaflet loaded via CDN
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
    L: any;
  }
}

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }

    // Load CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Leaflet"));
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

// Haversine formula for distance in km
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── ServiceAreaMap ─────────────────────────────────────────────────────────────
interface ServiceAreaMapProps {
  onLocationFound?: (lat: number, lng: number, name: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  userPinRef?: React.MutableRefObject<any>;
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  mapInstanceRef?: React.MutableRefObject<any>;
}

export default function ServiceAreaMap({
  mapInstanceRef: externalMapRef,
  userPinRef,
}: ServiceAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  const internalMapRef = useRef<any>(null);
  const activeMapRef = externalMapRef ?? internalMapRef;

  useEffect(() => {
    if (!mapRef.current || activeMapRef.current) return;

    loadLeaflet()
      .then(() => {
        if (!mapRef.current || activeMapRef.current) return;
        const L = window.L;

        // Fix leaflet default icon paths
        L.Icon.Default.prototype._getIconUrl = undefined;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current, {
          center: [CHANDAPURA_LAT, CHANDAPURA_LNG],
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        activeMapRef.current = map;

        // Dark-friendly tile layer (CartoDB Dark Matter)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          },
        ).addTo(map);

        // 15 km radius circle
        L.circle([CHANDAPURA_LAT, CHANDAPURA_LNG], {
          radius: RADIUS_KM * 1000,
          color: "#c9a84c",
          fillColor: "#c9a84c",
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "6 4",
        }).addTo(map);

        // Custom gold marker for Chandapura
        const goldIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:18px;height:18px;
            background:#c9a84c;
            border:3px solid #fff;
            border-radius:50%;
            box-shadow:0 0 12px rgba(201,168,76,0.8);
          "></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        L.marker([CHANDAPURA_LAT, CHANDAPURA_LNG], { icon: goldIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;text-align:center;padding:4px 8px">
              <strong style="color:#c9a84c">Prana Ayurvedic</strong><br/>
              <span style="font-size:12px">Chandapura, Bangalore</span><br/>
              <span style="font-size:11px;color:#888">15 km free service radius</span>
            </div>`,
          )
          .openPopup();

        // If a userPinRef is given, initialise the pin as null here;
        // ZoneChecker will add it when needed
        if (userPinRef) {
          userPinRef.current = null;
        }
      })
      .catch(() => {
        // Silently fail — fallback UI shown if map doesn't load
      });

    return () => {
      if (activeMapRef.current) {
        activeMapRef.current.remove();
        activeMapRef.current = null;
      }
    };
  }, [activeMapRef, userPinRef]);

  return (
    <div
      ref={mapRef}
      data-ocid="contact.map_marker"
      className="w-full h-[320px] rounded-xl overflow-hidden border border-gold/20"
      style={{ zIndex: 0 }}
    />
  );
}

// ── ZoneChecker ────────────────────────────────────────────────────────────────
type ZoneResult =
  | { type: "in"; distance: number; placeName: string }
  | { type: "out"; distance: number; placeName: string }
  | { type: "error"; message: string };

interface ZoneCheckerProps {
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  mapInstanceRef: React.MutableRefObject<any>;
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  userPinRef: React.MutableRefObject<any>;
}

export function ZoneChecker({ mapInstanceRef, userPinRef }: ZoneCheckerProps) {
  const [query, setQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ZoneResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkZone = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsChecking(true);
    setResult(null);

    try {
      const searchQuery =
        trimmed.toLowerCase().includes("bangalore") ||
        trimmed.toLowerCase().includes("bengaluru")
          ? trimmed
          : `${trimmed}, Bangalore, India`;

      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=in`,
        { headers: { "Accept-Language": "en" } },
      );

      if (!resp.ok) throw new Error("Network error");

      const data = await resp.json();

      if (!data || data.length === 0) {
        setResult({
          type: "error",
          message:
            "Address not found. Try adding more detail, like the neighbourhood name.",
        });
        return;
      }

      const { lat, lon, display_name } = data[0];
      const userLat = Number.parseFloat(lat);
      const userLng = Number.parseFloat(lon);
      const distance = haversineDistance(
        CHANDAPURA_LAT,
        CHANDAPURA_LNG,
        userLat,
        userLng,
      );

      // Short display name — take first 2 segments
      const placeName =
        display_name
          .split(",")
          .slice(0, 2)
          .map((s: string) => s.trim())
          .join(", ") || display_name;

      setResult({
        type: distance <= RADIUS_KM ? "in" : "out",
        distance: Math.round(distance * 10) / 10,
        placeName,
      });

      // Place or move user pin on the map
      if (window.L && mapInstanceRef.current) {
        const L = window.L;

        const amberIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:14px;height:14px;
            background:${distance <= RADIUS_KM ? "#4ade80" : "#fb923c"};
            border:2.5px solid #fff;
            border-radius:50%;
            box-shadow:0 0 10px ${distance <= RADIUS_KM ? "rgba(74,222,128,0.8)" : "rgba(251,146,60,0.8)"};
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        if (userPinRef.current) {
          userPinRef.current.setLatLng([userLat, userLng]);
          userPinRef.current.setIcon(amberIcon);
          userPinRef.current.getPopup()?.setContent(
            `<div style="font-family:sans-serif;text-align:center;padding:4px 8px">
                <strong style="color:${distance <= RADIUS_KM ? "#4ade80" : "#fb923c"}">${placeName}</strong><br/>
                <span style="font-size:11px;color:#aaa">${distance.toFixed(1)} km from Chandapura</span>
              </div>`,
          );
        } else {
          userPinRef.current = L.marker([userLat, userLng], {
            icon: amberIcon,
          })
            .addTo(mapInstanceRef.current)
            .bindPopup(
              `<div style="font-family:sans-serif;text-align:center;padding:4px 8px">
                <strong style="color:${distance <= RADIUS_KM ? "#4ade80" : "#fb923c"}">${placeName}</strong><br/>
                <span style="font-size:11px;color:#aaa">${distance.toFixed(1)} km from Chandapura</span>
              </div>`,
            );
        }
        userPinRef.current.openPopup();

        // Pan map to fit both markers
        const bounds = L.latLngBounds(
          [CHANDAPURA_LAT, CHANDAPURA_LNG],
          [userLat, userLng],
        );
        mapInstanceRef.current.fitBounds(bounds.pad(0.25), {
          animate: true,
          duration: 0.8,
        });
      }
    } catch {
      setResult({
        type: "error",
        message: "Could not connect to address service. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setQuery("");
    if (userPinRef.current) {
      userPinRef.current.remove();
      userPinRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([CHANDAPURA_LAT, CHANDAPURA_LNG], 11, {
        animate: true,
        duration: 0.6,
      });
    }
    inputRef.current?.focus();
  };

  return (
    <div className="mt-5 pt-5 border-t border-gold/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <Navigation className="w-3.5 h-3.5 text-gold" />
        </div>
        <div>
          <h4 className="font-display text-sm text-cream leading-tight">
            Check If You're in the Zone
          </h4>
          <p className="text-muted-foreground font-sans text-xs leading-tight mt-0.5">
            Enter your address to see if free home service applies
          </p>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={checkZone} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Koramangala, Electronic City, HSR Layout…"
            className="pl-9 bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/15 h-11 font-sans text-sm"
            disabled={isChecking}
            data-ocid="zone.search_input"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          disabled={isChecking || !query.trim()}
          className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold text-sm h-11 px-5 transition-all duration-200 shadow-gold hover:shadow-gold-lg disabled:opacity-60 shrink-0"
          data-ocid="zone.primary_button"
        >
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-1.5" />
              Check My Area
            </>
          )}
        </Button>
      </form>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={
              result.type === "error"
                ? "error"
                : result.type === "in"
                  ? "in"
                  : "out"
            }
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3"
          >
            {result.type === "in" && (
              <div
                className="rounded-xl overflow-hidden border border-emerald-500/30"
                data-ocid="zone.success_state"
              >
                {/* Green gradient header */}
                <div className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-emerald-950/60 px-5 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-emerald-300 font-display text-base font-semibold leading-tight">
                      You're in the Free Zone!
                    </p>
                    <p className="text-emerald-200/80 font-sans text-sm mt-1 leading-relaxed">
                      <span className="font-semibold text-emerald-300">
                        {result.placeName}
                      </span>{" "}
                      is{" "}
                      <span className="font-semibold text-emerald-300">
                        {result.distance} km
                      </span>{" "}
                      from Chandapura — free home visit included!
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-950/40 border-t border-emerald-500/15 px-5 py-3 flex items-center justify-between gap-3">
                  <p className="text-emerald-200/60 font-sans text-xs">
                    ₹1,500 per session · No travel charge
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-sans font-semibold text-xs px-4 py-2 rounded-lg transition-colors duration-200 shrink-0"
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            )}

            {result.type === "out" && (
              <div
                className="rounded-xl overflow-hidden border border-amber-500/30"
                data-ocid="zone.success_state"
              >
                {/* Amber gradient header */}
                <div className="bg-gradient-to-br from-amber-950/70 via-amber-900/30 to-amber-950/50 px-5 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-300 font-display text-base font-semibold leading-tight">
                      Travel Charge Applies
                    </p>
                    <p className="text-amber-200/80 font-sans text-sm mt-1 leading-relaxed">
                      <span className="font-semibold text-amber-300">
                        {result.placeName}
                      </span>{" "}
                      is{" "}
                      <span className="font-semibold text-amber-300">
                        {result.distance} km
                      </span>{" "}
                      from Chandapura — outside the 15 km free zone.
                    </p>
                    <p className="text-amber-200/60 font-sans text-xs mt-2">
                      Contact us to confirm the travel charge for your area.
                    </p>
                  </div>
                </div>
                <div className="bg-amber-950/40 border-t border-amber-500/15 px-5 py-3 flex items-center justify-between gap-3">
                  <p className="text-amber-200/50 font-sans text-xs">
                    We still serve your area — just call us first
                  </p>
                  <a
                    href="tel:9845304711"
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-sans font-semibold text-xs px-4 py-2 rounded-lg transition-colors duration-200 shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Us
                  </a>
                </div>
              </div>
            )}

            {result.type === "error" && (
              <div
                className="flex items-start gap-3 bg-red-950/40 border border-red-500/25 rounded-xl px-4 py-3.5"
                data-ocid="zone.error_state"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-300/90 font-sans text-sm leading-relaxed">
                  {result.message}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear button */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex justify-center"
          >
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground/60 font-sans text-xs hover:text-muted-foreground transition-colors underline underline-offset-2"
            >
              Clear & try another address
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
