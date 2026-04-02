import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Info,
  Instagram,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminPanel from "./AdminPanel";
import type { Review } from "./backend";
import { useCountdown } from "./hooks/useCountdown";
import {
  useGetAllInquiries,
  useGetAllReviews,
  useSubmitInquiry,
  useSubmitReview,
} from "./hooks/useQueries";

import { ZoneChecker } from "./ServiceAreaMap";
const ServiceAreaMap = lazy(() => import("./ServiceAreaMap"));

// ── Fade-up reveal wrapper ──────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-16">
      <FadeUp>
        <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">
          {label}
        </span>
      </FadeUp>
      <FadeUp delay={0.1}>
        <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight mb-4">
          {title}
        </h2>
      </FadeUp>
      {subtitle && (
        <FadeUp delay={0.2}>
          <p className="text-muted-foreground font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeUp>
      )}
      <FadeUp delay={0.25}>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-12 bg-gold opacity-40" />
          <Leaf className="w-4 h-4 text-gold opacity-60" />
          <div className="h-px w-12 bg-gold opacity-40" />
        </div>
      </FadeUp>
    </div>
  );
}

// ── Services Data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    name: "Uzhichil",
    image: "/assets/generated/uzhichil-massage.dim_800x600.jpg",
    description:
      "A classical Kerala oil massage performed with rhythmic strokes using warm medicated herbal oils. Ideal for deep relaxation, improved circulation, and total rejuvenation of the body.",
    ocid: "services.item.1",
  },
  {
    name: "Swedana",
    image: "/assets/generated/swedana-therapy.dim_800x600.jpg",
    description:
      "A therapeutic herbal steam treatment that opens pores, eliminates toxins, and deeply relieves muscle tension. Herbal vapors penetrate the body to restore balance and vitality.",
    ocid: "services.item.2",
  },
  {
    name: "Abhyanga",
    image: "/assets/generated/abhyanga-massage.dim_800x600.jpg",
    description:
      "A full-body warm herbal oil massage rooted in Ayurvedic tradition. Nourishes tissues, calms the nervous system, and restores balance between the doshas — mind, body, and spirit.",
    ocid: "services.item.3",
  },
  {
    name: "Pindasweda",
    image: "/assets/generated/pindasweda-therapy.dim_800x600.jpg",
    description:
      "A unique bolus massage using pouches of medicated rice dipped in warm herbal milk. Excellent for pain relief, nourishing the skin, and deep muscle rehabilitation.",
    ocid: "services.item.4",
  },
  {
    name: "Njavarakkizhi",
    image: "/assets/generated/njavarakkizhi-therapy.dim_800x600.jpg",
    description:
      "A highly rejuvenating treatment using boluses of cooked Navara rice tied in muslin cloth and dipped in warm herbal milk. Strengthens muscles, nourishes the skin, and relieves neurological conditions.",
    ocid: "services.item.5",
  },
  {
    name: "Soundarya Vardhini",
    image: "/assets/generated/soundarya-vardhini-therapy.dim_800x600.jpg",
    description:
      "A traditional Ayurvedic beauty therapy combining herbal face packs, warm oil massage, and natural treatments to enhance skin glow, reduce pigmentation, and restore natural radiance.",
    ocid: "services.item.6",
  },
  {
    name: "Post Delivery Care",
    image: "/assets/generated/post-delivery-care-therapy.dim_800x600.jpg",
    description:
      "Specialized postnatal Ayurvedic care for new mothers — gentle herbal oil massages, abdominal binding, and restorative therapies to aid recovery, reduce fatigue, and restore strength after childbirth.",
    ocid: "services.item.7",
  },
];

// ── Floating Petals for Launch Celebration ───────────────────────────────────
const PETAL_CONFIGS = [
  { id: "p1", left: "8%", delay: 0, duration: 5.5, size: 18 },
  { id: "p2", left: "18%", delay: 0.6, duration: 6.2, size: 14 },
  { id: "p3", left: "28%", delay: 1.2, duration: 5, size: 20 },
  { id: "p4", left: "38%", delay: 0.3, duration: 6.8, size: 16 },
  { id: "p5", left: "48%", delay: 0.9, duration: 5.3, size: 22 },
  { id: "p6", left: "58%", delay: 1.5, duration: 6, size: 12 },
  { id: "p7", left: "68%", delay: 0.4, duration: 5.7, size: 18 },
  { id: "p8", left: "78%", delay: 1.1, duration: 6.4, size: 15 },
  { id: "p9", left: "88%", delay: 0.7, duration: 5.1, size: 20 },
  { id: "p10", left: "93%", delay: 1.8, duration: 6.6, size: 13 },
  { id: "p11", left: "13%", delay: 2.0, duration: 5.8, size: 17 },
  { id: "p12", left: "53%", delay: 2.3, duration: 6.1, size: 14 },
];

// ── Countdown Banner ─────────────────────────────────────────────────────────
function CountdownBanner() {
  const { days, hours, minutes, seconds, isLaunched } = useCountdown();
  const [prevValues, setPrevValues] = useState({
    days,
    hours,
    minutes,
    seconds,
  });
  const [flipping, setFlipping] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  useEffect(() => {
    const newFlipping = {
      days: false,
      hours: false,
      minutes: false,
      seconds: false,
    };
    if (prevValues.seconds !== seconds) newFlipping.seconds = true;
    if (prevValues.minutes !== minutes) newFlipping.minutes = true;
    if (prevValues.hours !== hours) newFlipping.hours = true;
    if (prevValues.days !== days) newFlipping.days = true;

    if (Object.values(newFlipping).some(Boolean)) {
      setFlipping(newFlipping);
      const timer = setTimeout(
        () =>
          setFlipping({
            days: false,
            hours: false,
            minutes: false,
            seconds: false,
          }),
        300,
      );
      setPrevValues({ days, hours, minutes, seconds });
      return () => clearTimeout(timer);
    }
  }, [days, hours, minutes, seconds, prevValues]);

  if (isLaunched) {
    // ── Launch Celebration ──────────────────────────────────────────────────
    return (
      <div className="relative overflow-hidden bg-charcoal-mid border-b border-gold/20 py-16 md:py-24">
        {/* Floating petals */}
        {PETAL_CONFIGS.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute pointer-events-none"
            style={{ left: petal.left, bottom: "-20px" }}
            animate={{ y: [0, -600], opacity: [0, 0.7, 0.5, 0] }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          >
            <Leaf
              style={{ width: petal.size, height: petal.size }}
              className="text-gold opacity-60 rotate-12"
            />
          </motion.div>
        ))}

        {/* Gold glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-gold/8 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Pulsing icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shadow-gold">
                <Sparkles className="w-7 h-7 text-gold" />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl text-gold leading-tight mb-4"
            style={{ textShadow: "0 0 40px oklch(0.75 0.12 85 / 0.5)" }}
          >
            We Are Now Open!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-cream/85 font-sans text-base md:text-lg leading-relaxed mb-8"
          >
            Ancient healing is now at your doorstep. Book your first session
            today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold text-base px-10 h-13 tracking-wide transition-all duration-300 shadow-gold hover:shadow-gold-lg"
              data-ocid="launch.primary_button"
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Pre-launch Countdown Banner ─────────────────────────────────────────
  const tiles = [
    { value: days, label: "Days", key: "days" as const },
    { value: hours, label: "Hours", key: "hours" as const },
    { value: minutes, label: "Minutes", key: "minutes" as const },
    { value: seconds, label: "Seconds", key: "seconds" as const },
  ];

  return (
    <div className="relative overflow-hidden bg-charcoal-mid border-b border-gold/20 py-8 md:py-10">
      {/* Gold glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-gold/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-gold text-xs tracking-[0.35em] uppercase font-sans mb-2"
        >
          Launching
        </motion.span>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-cream text-2xl md:text-3xl mb-6"
        >
          15 March 2026
        </motion.p>

        {/* Countdown Tiles */}
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-5">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="flex flex-col items-center"
            >
              <div className="relative bg-charcoal border border-gold/20 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center backdrop-blur-sm shadow-gold overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={tile.value}
                    initial={{
                      y: flipping[tile.key] ? -20 : 0,
                      opacity: flipping[tile.key] ? 0 : 1,
                      scale: flipping[tile.key] ? 0.8 : 1,
                    }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-2xl md:text-3xl text-gold font-semibold leading-none relative z-10"
                  >
                    {String(tile.value).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-cream/60 font-sans text-[10px] md:text-xs tracking-widest uppercase mt-2">
                {tile.label}
              </span>
            </motion.div>
          ))}

          {/* Separator dots */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={`sep-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
              className="text-gold/60 font-display text-2xl md:text-3xl leading-none mb-6 hidden xs:block"
              style={{ display: i < 3 ? undefined : "none" }}
            />
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-cream/60 font-sans text-sm"
        >
          Service begins 15 March 2026 — Pre-book your session now!
        </motion.p>
      </div>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Gallery", id: "gallery" },
    { label: "Reviews", id: "reviews" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-charcoal/95 backdrop-blur-md border-b border-gold/10 shadow-gold"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/prana-logo-transparent.png"
              alt="Prana Ayurvedic"
              className="h-20 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-sans tracking-wide text-muted-foreground hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-1"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-gold text-charcoal hover:bg-gold-bright font-sans text-sm font-semibold tracking-wide px-6 h-10 transition-all duration-200"
              data-ocid="nav.primary_button"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cream p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-charcoal/98 backdrop-blur-md border-b border-gold/10 md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left text-base font-sans text-muted-foreground hover:text-gold transition-colors py-2 border-b border-charcoal-light last:border-0"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("contact")}
                className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold mt-2"
                data-ocid="nav.primary_button"
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { isLaunched } = useCountdown();
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-bg.dim_1600x900.jpg')`,
        }}
      />
      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />

      {/* Decorative gold accent lines */}
      <div className="absolute top-1/2 left-0 w-24 h-px bg-gradient-to-r from-transparent to-gold/30" />
      <div className="absolute top-1/2 right-0 w-24 h-px bg-gradient-to-l from-transparent to-gold/30" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <img
            src="/assets/generated/prana-logo-transparent.png"
            alt="Prana Ayurvedic"
            className="h-48 md:h-64 w-auto mx-auto object-contain drop-shadow-[0_0_30px_rgba(30,100,30,0.5)]"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold text-xs md:text-sm tracking-[0.4em] uppercase font-sans mb-5"
        >
          Ayurvedic Home Service · Bangalore
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6"
        >
          Ancient Healing. <span className="text-gold italic">Delivered</span>{" "}
          to Your Doorstep.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-muted-foreground font-sans text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Traditional Kerala Ayurveda, brought to the comfort of your home.
          Serving within 15 km of Chandapura, Bangalore.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold text-base px-10 h-14 tracking-wide transition-all duration-300 shadow-gold hover:shadow-gold-lg"
            data-ocid="hero.primary_button"
          >
            Book a Session
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border-gold/40 text-cream hover:bg-gold/10 hover:border-gold/80 font-sans font-medium text-base px-10 h-14 tracking-wide transition-all duration-300"
            data-ocid="hero.secondary_button"
          >
            Our Services
          </Button>
        </motion.div>

        {/* Service Area Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
        >
          <div className="flex items-center gap-2 bg-forest/20 border border-forest/50 backdrop-blur-sm rounded-full px-5 py-2.5">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <span className="text-cream/90 font-sans text-sm">
              <span className="text-gold font-semibold">Free home visit</span>{" "}
              within 15 km of Chandapura
            </span>
          </div>
          <div className="flex items-center gap-2 bg-amber/10 border border-amber/30 backdrop-blur-sm rounded-full px-5 py-2.5">
            <Info className="w-4 h-4 text-amber shrink-0" />
            <span className="text-cream/80 font-sans text-sm">
              Travel charge beyond 15 km
            </span>
          </div>
        </motion.div>

        {/* Launch Date Pill (only shown before launch) */}
        {!isLaunched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex justify-center mt-4"
          >
            <div className="inline-flex items-center gap-2 bg-charcoal/60 border border-gold/30 backdrop-blur-sm rounded-full px-4 py-2">
              <Leaf className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="text-gold/90 font-sans text-xs font-medium tracking-wide">
                🌿 Launching 15 March 2026
              </span>
            </div>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-gold/50 text-xs tracking-widest uppercase font-sans">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-charcoal relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <FadeUp>
              <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">
                Our Story
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight mb-6">
                Rooted in <span className="text-gold italic">Kerala's</span>{" "}
                Ancient Wisdom
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-muted-foreground font-sans text-base leading-relaxed mb-5">
                Prana Ayurvedic Home Service brings the time-honored healing
                traditions of Kerala directly to your home. Our certified
                therapists are trained in authentic Ayurvedic techniques passed
                down through generations, using only the finest medicated herbal
                oils and natural ingredients.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="text-muted-foreground font-sans text-base leading-relaxed mb-8">
                We believe wellness should be accessible, personal, and deeply
                nourishing. Skip the commute and receive a complete spa
                experience in the comfort and privacy of your own home — we come
                to you.
              </p>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.4}>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "4+", label: "Therapies" },
                  { value: "15km", label: "Service Area" },
                  { value: "₹1,500", label: "Per Session" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl text-gold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right: Image grid */}
          <FadeUp delay={0.2} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden aspect-[3/4]">
                  <img
                    src="/assets/generated/abhyanga-massage.dim_800x600.jpg"
                    alt="Abhyanga massage"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden aspect-square">
                  <img
                    src="/assets/generated/swedana-therapy.dim_800x600.jpg"
                    alt="Swedana therapy"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-lg overflow-hidden aspect-square">
                  <img
                    src="/assets/generated/uzhichil-massage.dim_800x600.jpg"
                    alt="Uzhichil massage"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg overflow-hidden aspect-[3/4]">
                  <img
                    src="/assets/generated/pindasweda-therapy.dim_800x600.jpg"
                    alt="Pindasweda therapy"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-charcoal-mid border border-gold/30 rounded-lg p-4 shadow-gold">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-cream font-display text-sm">
                    100% Natural
                  </div>
                  <div className="text-muted-foreground text-xs font-sans">
                    Herbal oils & ingredients
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Services Section ──────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-charcoal-mid relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          label="Our Treatments"
          title="Timeless Therapies, Modern Comfort"
          subtitle="Each therapy is tailored to your unique constitution, performed with warm medicated oils and expert hands that have mastered ancient Kerala techniques."
        />

        {/* Service Area Notice */}
        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center gap-3 bg-forest/15 border border-forest/40 rounded-lg px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-forest/30 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-gold font-sans font-semibold text-sm">
                  Within 15 km — FREE Home Visit
                </p>
                <p className="text-muted-foreground font-sans text-xs mt-0.5">
                  No travel charge within 15 km of Chandapura, Bangalore
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 bg-amber/8 border border-amber/25 rounded-lg px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-amber/15 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-amber" />
              </div>
              <div>
                <p className="text-amber font-sans font-semibold text-sm">
                  Beyond 15 km — Travel Charge Applies
                </p>
                <p className="text-muted-foreground font-sans text-xs mt-0.5">
                  Additional service charge for locations outside the area
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <FadeUp key={service.name} delay={index * 0.1}>
              <div
                data-ocid={service.ocid}
                className="group relative bg-charcoal border border-gold/10 rounded-lg overflow-hidden cursor-default transition-all duration-500 hover:border-gold/40 hover:shadow-gold gold-glow-hover"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-charcoal/80 backdrop-blur-sm border border-gold/40 rounded px-2.5 py-1">
                    <span className="text-gold font-display text-sm font-semibold">
                      ₹1,500
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-cream mb-2 group-hover:text-gold transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold/60 font-sans tracking-wide uppercase">
                      per session
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("contact")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-xs text-gold font-sans tracking-wide hover:text-gold-bright transition-colors underline underline-offset-4"
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Gallery Section ───────────────────────────────────────────────────────────
function GallerySection() {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="The Experience"
          title="A Glimpse Into Healing"
          subtitle="Every session is a journey — an invitation to slow down, be restored, and reconnect with yourself."
        />

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Large featured: Abhyanga */}
          <FadeUp className="col-span-2 row-span-2">
            <div className="group relative overflow-hidden rounded-lg h-full min-h-[280px] md:min-h-[380px]">
              <img
                src="/assets/generated/abhyanga-massage.dim_800x600.jpg"
                alt="Abhyanga massage therapy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cream font-display text-lg">
                  Abhyanga
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Uzhichil */}
          <FadeUp delay={0.1}>
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img
                src="/assets/generated/uzhichil-massage.dim_800x600.jpg"
                alt="Uzhichil massage"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cream font-display text-base">
                  Uzhichil
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Pindasweda */}
          <FadeUp delay={0.15}>
            <div className="group relative overflow-hidden rounded-lg aspect-square">
              <img
                src="/assets/generated/pindasweda-therapy.dim_800x600.jpg"
                alt="Pindasweda therapy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cream font-display text-base">
                  Pindasweda
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Swedana — wide */}
          <FadeUp delay={0.2} className="col-span-2">
            <div className="group relative overflow-hidden rounded-lg aspect-[16/7]">
              <img
                src="/assets/generated/swedana-therapy.dim_800x600.jpg"
                alt="Swedana steam therapy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cream font-display text-lg">Swedana</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Contact / Booking Section ─────────────────────────────────────────────────
function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Shared refs for map + zone checker communication
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  const mapInstanceRef = useRef<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet loaded via CDN
  const userPinRef = useRef<any>(null);

  const { mutate: submitInquiry, isPending } = useSubmitInquiry();
  const { data: allInquiries } = useGetAllInquiries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !service ||
      !preferredDate ||
      !preferredTime
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    submitInquiry(
      {
        name: name.trim(),
        phone: phone.trim(),
        service,
        preferredDate,
        preferredTime,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName("");
          setPhone("");
          setService("");
          setPreferredDate("");
          setPreferredTime("");
        },
        onError: () => {
          toast.error(
            "Something went wrong. Please try again or call us directly.",
          );
        },
      },
    );
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-charcoal-mid relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-gold/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Book a Session"
          title="Wellness Begins Here"
          subtitle="Reserve your Ayurvedic session today. Our therapist will come to your home within 15 km of Chandapura, Bangalore."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Booking Form */}
          <FadeUp>
            <div className="bg-charcoal border border-gold/15 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold/5 blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                    data-ocid="contact.success_state"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-display text-2xl text-cream mb-3">
                      Booking Received!
                    </h3>
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-6">
                      Thank you for reaching out. Our therapist will contact you
                      shortly to confirm your session.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-gold/40 text-gold hover:bg-gold/10"
                    >
                      Book Another Session
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <h3 className="font-display text-xl text-cream mb-6">
                      Request a Session
                    </h3>

                    <div className="space-y-2">
                      <Label className="text-cream/80 font-sans text-sm">
                        Your Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/60 focus:border-gold/60 focus:ring-gold/20 h-12 font-sans"
                        data-ocid="contact.input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-cream/80 font-sans text-sm">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="Your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/60 focus:border-gold/60 focus:ring-gold/20 h-12 font-sans"
                        data-ocid="contact.input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-cream/80 font-sans text-sm">
                        Select Service
                      </Label>
                      <Select
                        value={service}
                        onValueChange={setService}
                        required
                      >
                        <SelectTrigger
                          className="bg-charcoal-light border-gold/20 text-cream h-12 font-sans focus:ring-gold/20 focus:border-gold/60"
                          data-ocid="contact.select"
                        >
                          <SelectValue placeholder="Choose a therapy" />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold/20">
                          {SERVICES.map((s) => (
                            <SelectItem
                              key={s.name}
                              value={s.name}
                              className="text-cream font-sans focus:bg-gold/15 focus:text-cream"
                            >
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-cream/80 font-sans text-sm">
                        Preferred Date
                      </Label>
                      <Input
                        type="date"
                        value={preferredDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/60 focus:border-gold/60 focus:ring-gold/20 h-12 font-sans [color-scheme:dark]"
                        data-ocid="contact.input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-cream/80 font-sans text-sm">
                        Preferred Time
                      </Label>
                      <Select
                        value={preferredTime}
                        onValueChange={setPreferredTime}
                        required
                      >
                        <SelectTrigger
                          className="bg-charcoal-light border-gold/20 text-cream h-12 font-sans focus:ring-gold/20 focus:border-gold/60"
                          data-ocid="contact.select"
                        >
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold/20">
                          {(() => {
                            const bookedSlots = new Set(
                              (allInquiries ?? [])
                                .filter(
                                  (b) =>
                                    b.preferredDate === preferredDate &&
                                    preferredDate !== "",
                                )
                                .map((b) => b.preferredTime),
                            );
                            return [
                              "7:00 AM",
                              "7:30 AM",
                              "8:00 AM",
                              "8:30 AM",
                              "9:00 AM",
                              "9:30 AM",
                              "10:00 AM",
                              "10:30 AM",
                              "11:00 AM",
                              "11:30 AM",
                              "12:00 PM",
                              "12:30 PM",
                              "1:00 PM",
                              "1:30 PM",
                              "2:00 PM",
                              "2:30 PM",
                              "3:00 PM",
                              "3:30 PM",
                              "4:00 PM",
                              "4:30 PM",
                              "5:00 PM",
                              "5:30 PM",
                              "6:00 PM",
                              "6:30 PM",
                              "7:00 PM",
                            ].map((slot) => {
                              const isBooked = bookedSlots.has(slot);
                              return (
                                <SelectItem
                                  key={slot}
                                  value={slot}
                                  disabled={isBooked}
                                  className={
                                    isBooked
                                      ? "text-cream/30 font-sans line-through cursor-not-allowed"
                                      : "text-cream font-sans focus:bg-gold/15 focus:text-cream"
                                  }
                                >
                                  {isBooked ? `${slot} — Booked` : slot}
                                </SelectItem>
                              );
                            });
                          })()}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold h-13 text-base tracking-wide transition-all duration-300 shadow-gold hover:shadow-gold-lg disabled:opacity-60"
                        data-ocid="contact.submit_button"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          "Request Session"
                        )}
                      </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground font-sans">
                      ₹1,500 per session · Home service within 15 km of
                      Chandapura
                    </p>
                    <p className="text-center text-xs text-muted-foreground font-sans">
                      Or email us at{" "}
                      <a
                        href="mailto:pranaayurvedichome@gmail.com"
                        className="text-gold hover:text-gold-bright transition-colors underline underline-offset-2"
                        data-ocid="contact.link"
                      >
                        pranaayurvedichome@gmail.com
                      </a>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Contact Info */}
          <div className="space-y-8">
            <FadeUp delay={0.1}>
              <div className="bg-charcoal border border-gold/15 rounded-xl p-6">
                <h3 className="font-display text-lg text-cream mb-5">
                  Get in Touch
                </h3>
                <div className="space-y-5">
                  {/* Phone */}
                  <a
                    href="tel:9845304711"
                    className="flex items-center gap-4 group"
                    data-ocid="contact.link"
                  >
                    <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200 shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
                        Phone
                      </div>
                      <div className="text-cream font-sans text-base group-hover:text-gold transition-colors duration-200">
                        +91 9845304711
                      </div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919845304711"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                    data-ocid="contact.link"
                  >
                    <div
                      className="w-11 h-11 rounded-lg border flex items-center justify-center group-hover:opacity-90 transition-all duration-200 shrink-0"
                      style={{
                        backgroundColor: "#25D36615",
                        borderColor: "#25D36640",
                      }}
                    >
                      <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
                        WhatsApp
                      </div>
                      <div className="text-cream font-sans text-base group-hover:text-gold transition-colors duration-200">
                        +91 9845304711
                      </div>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/prana_aayurvedic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                    data-ocid="contact.link"
                  >
                    <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200 shrink-0">
                      <Instagram className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
                        Instagram
                      </div>
                      <div className="text-cream font-sans text-base group-hover:text-gold transition-colors duration-200">
                        @prana__aayurvedic
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:pranaayurvedichome@gmail.com"
                    className="flex items-center gap-4 group"
                    data-ocid="contact.link"
                  >
                    <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200 shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
                        Email
                      </div>
                      <div className="text-cream font-sans text-sm group-hover:text-gold transition-colors duration-200 break-all">
                        pranaayurvedichome@gmail.com
                      </div>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
                        Service Area
                      </div>
                      <div className="text-cream font-sans text-base">
                        Within 15 km of Chandapura, Bangalore
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Service Area Policy */}
            <FadeUp delay={0.15}>
              <div className="rounded-xl overflow-hidden border border-gold/15">
                {/* Green header — free zone */}
                <div className="bg-forest/25 border-b border-forest/40 px-6 py-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-forest/40 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-gold font-display text-base font-semibold">
                      Within 15 km — Free Home Visit
                    </p>
                    <p className="text-cream/80 font-sans text-sm mt-1 leading-relaxed">
                      We cover all homes within{" "}
                      <strong className="text-gold">
                        15 km of Chandapura, Bangalore
                      </strong>{" "}
                      at no extra charge. Your ₹1,500 session fee is all you
                      pay.
                    </p>
                  </div>
                </div>
                {/* Amber footer — beyond zone */}
                <div className="bg-amber/8 px-6 py-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-amber font-display text-base font-semibold">
                      Beyond 15 km — Travel Charge Applies
                    </p>
                    <p className="text-cream/70 font-sans text-sm mt-1 leading-relaxed">
                      Locations outside the 15 km radius will incur an
                      additional travel/service charge. Contact us to confirm
                      pricing for your area.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Service Area Map */}
            <FadeUp delay={0.2}>
              <div className="bg-charcoal border border-gold/15 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gold" />
                  <h3 className="font-display text-base text-cream">
                    15 km Service Radius — Chandapura, Bangalore
                  </h3>
                </div>
                <Suspense
                  fallback={
                    <div className="w-full h-[320px] rounded-xl bg-charcoal-mid border border-gold/10 flex items-center justify-center">
                      <span className="text-muted-foreground font-sans text-sm">
                        Loading map...
                      </span>
                    </div>
                  }
                >
                  <ServiceAreaMap
                    mapInstanceRef={mapInstanceRef}
                    userPinRef={userPinRef}
                  />
                </Suspense>
                <p className="text-xs text-muted-foreground font-sans mt-3 text-center">
                  Free home visit within the highlighted zone · Travel charge
                  beyond 15 km
                </p>
                <ZoneChecker
                  mapInstanceRef={mapInstanceRef}
                  userPinRef={userPinRef}
                />
              </div>
            </FadeUp>

            {/* Pricing info */}
            <FadeUp delay={0.25}>
              <div className="bg-charcoal border border-gold/15 rounded-xl p-6">
                <h3 className="font-display text-lg text-cream mb-4">
                  Session Pricing
                </h3>
                <div className="space-y-3">
                  {SERVICES.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0"
                    >
                      <span className="text-muted-foreground font-sans text-sm">
                        {s.name}
                      </span>
                      <span className="text-gold font-display text-base">
                        ₹1,500
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-4 leading-relaxed">
                  All sessions include premium medicated herbal oils. Free home
                  service within 15 km of Chandapura, Bangalore. Travel charges
                  apply beyond 15 km.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTimestamp(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  const date = new Date(ms);
  const now = Date.now();
  const diffMs = now - ms;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

// ── Star Rating Display ────────────────────────────────────────────────────────
function StarDisplay({
  rating,
  size = "sm",
}: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${cls} transition-colors ${i <= rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

// ── Star Rating Picker ─────────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <fieldset
      className="flex items-center gap-1.5 border-0 p-0 m-0"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          data-ocid="review_modal.toggle"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded transition-transform active:scale-90"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            className={`w-8 h-8 transition-colors duration-100 ${
              i <= (hovered || value)
                ? "text-gold fill-gold"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </fieldset>
  );
}

// ── Leave a Review Modal ───────────────────────────────────────────────────────
function ReviewModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitReview, isPending } = useSubmitReview();

  const handleClose = () => {
    onOpenChange(false);
    // reset after close animation
    setTimeout(() => {
      setName("");
      setRating(0);
      setComment("");
      setSubmitted(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }
    submitReview(
      { name: name.trim(), rating: BigInt(rating), comment: comment.trim() },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-charcoal border border-gold/20 text-cream max-w-md rounded-2xl p-0 overflow-hidden"
        data-ocid="review_modal.dialog"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold/5 blur-2xl pointer-events-none" />
        <div className="relative p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                <Star className="w-5 h-5 text-gold fill-gold/40" />
              </div>
              <DialogTitle className="font-display text-xl text-cream">
                Share Your Experience
              </DialogTitle>
            </div>
            <p className="text-muted-foreground font-sans text-sm">
              Your honest feedback helps others discover healing.
            </p>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
                data-ocid="review_modal.success_state"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-gold" />
                </motion.div>
                <h3 className="font-display text-2xl text-cream mb-2">
                  Thank You!
                </h3>
                <p className="text-muted-foreground font-sans text-sm mb-6">
                  Your feedback has been published and helps others discover
                  healing.
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold"
                  data-ocid="review_modal.close_button"
                >
                  Close
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <Label className="text-cream/80 font-sans text-sm">
                    Your Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold/60 h-11 font-sans"
                    data-ocid="review_modal.input"
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1.5">
                  <Label className="text-cream/80 font-sans text-sm">
                    Rating
                  </Label>
                  <StarPicker value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <p className="text-gold/70 font-sans text-xs">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          rating
                        ]
                      }
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <Label className="text-cream/80 font-sans text-sm">
                    Your Experience
                  </Label>
                  <Textarea
                    placeholder="Tell us about your session… (min 10 characters)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="bg-charcoal-light border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold/60 font-sans resize-none"
                    data-ocid="review_modal.textarea"
                    required
                  />
                  <p className="text-muted-foreground/50 font-sans text-xs text-right">
                    {comment.length} chars
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gold/20 text-muted-foreground hover:text-cream hover:border-gold/50 font-sans"
                    data-ocid="review_modal.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold shadow-gold transition-all duration-300"
                    data-ocid="review_modal.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Review Card ────────────────────────────────────────────────────────────────
function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group bg-charcoal border border-gold/10 rounded-xl p-6 hover:border-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col gap-4"
      data-ocid={`reviews.item.${index + 1}`}
    >
      {/* Stars + date row */}
      <div className="flex items-start justify-between gap-2">
        <StarDisplay rating={Number(review.rating)} />
        <span className="text-muted-foreground/60 font-sans text-xs shrink-0">
          {formatTimestamp(review.timestamp)}
        </span>
      </div>

      {/* Comment */}
      <p className="text-cream/85 font-sans text-sm leading-relaxed flex-1 line-clamp-5">
        "{review.comment}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-gold/8">
        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/20 flex items-center justify-center shrink-0">
          <span className="text-gold font-display text-sm font-semibold uppercase">
            {review.name.charAt(0)}
          </span>
        </div>
        <span className="text-cream/90 font-sans text-sm font-medium">
          {review.name}
        </span>
      </div>
      {review.adminReply && (
        <div className="mt-3 pt-3 border-t border-gold/10 bg-charcoal-mid/40 rounded-lg px-4 py-3">
          <p className="text-gold/80 font-sans text-xs font-semibold uppercase tracking-wider mb-1">
            Response from Prana Ayurvedic
          </p>
          <p className="text-cream/75 font-sans text-sm leading-relaxed">
            {review.adminReply}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── Reviews Section ────────────────────────────────────────────────────────────
function ReviewsSection({
  onOpenReviewModal,
}: {
  onOpenReviewModal: () => void;
}) {
  const { data: reviews, isLoading } = useGetAllReviews();
  const allReviews = reviews ?? [];

  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        allReviews.length
      : 0;

  return (
    <section
      id="reviews"
      className="py-24 md:py-32 bg-charcoal-mid relative overflow-hidden"
      data-ocid="reviews.section"
    >
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          label="What Our Clients Say"
          title="Real Experiences, Real Healing"
          subtitle="Discover what our clients feel after every session — authentic stories of restoration and wellness."
        />

        {/* Average rating summary */}
        {!isLoading && allReviews.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-4 bg-charcoal border border-gold/20 rounded-2xl px-7 py-4 shadow-gold">
                <div className="text-center">
                  <div className="font-display text-4xl text-gold leading-none mb-1">
                    {avgRating.toFixed(1)}
                  </div>
                  <div className="text-muted-foreground font-sans text-xs tracking-wide">
                    Average
                  </div>
                </div>
                <div className="h-10 w-px bg-gold/15" />
                <div>
                  <StarDisplay rating={Math.round(avgRating)} size="md" />
                  <div className="text-muted-foreground font-sans text-xs mt-1.5">
                    Based on {allReviews.length}{" "}
                    {allReviews.length === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            data-ocid="reviews.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-charcoal border border-gold/10 rounded-xl p-6 space-y-4"
              >
                <Skeleton className="h-4 w-24 bg-gold/10" />
                <Skeleton className="h-16 w-full bg-gold/10" />
                <Skeleton className="h-4 w-32 bg-gold/10" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 gap-5 mb-12"
            data-ocid="reviews.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center">
              <Star className="w-7 h-7 text-gold/50" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl text-cream mb-2">
                Be the first to share your experience
              </p>
              <p className="text-muted-foreground font-sans text-sm">
                Your honest review helps others on their wellness journey.
              </p>
            </div>
            <Button
              onClick={onOpenReviewModal}
              className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold gap-2 shadow-gold"
              data-ocid="reviews.primary_button"
            >
              <Star className="w-4 h-4 fill-charcoal" />
              Leave a Review
            </Button>
          </motion.div>
        )}

        {/* Reviews grid */}
        {!isLoading && allReviews.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allReviews.map((review, index) => (
              <ReviewCard
                key={Number(review.id)}
                review={review}
                index={index}
              />
            ))}
          </div>
        )}

        {/* CTA button */}
        {!isLoading && allReviews.length > 0 && (
          <FadeUp delay={0.2}>
            <div className="flex justify-center">
              <Button
                onClick={onOpenReviewModal}
                className="bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold gap-2.5 px-8 h-12 shadow-gold hover:shadow-gold-lg transition-all duration-300"
                data-ocid="reviews.primary_button"
              >
                <Star className="w-4 h-4 fill-charcoal" />
                Leave a Review
              </Button>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal border-t border-gold/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/prana-logo-transparent.png"
              alt="Prana Ayurvedic"
              className="h-24 w-auto object-contain mb-4"
            />
            <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xs">
              Ancient Healing. Delivered to Your Doorstep. Authentic Kerala
              Ayurveda, brought to the comfort of your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-cream text-base mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                "hero",
                "about",
                "services",
                "gallery",
                "reviews",
                "contact",
              ].map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left text-sm text-muted-foreground font-sans hover:text-gold transition-colors capitalize"
                  data-ocid="footer.link"
                >
                  {id === "hero"
                    ? "Home"
                    : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-cream text-base mb-5">Contact</h4>
            <div className="space-y-3">
              <a
                href="tel:9845304711"
                className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-sans"
                data-ocid="footer.link"
              >
                <Phone className="w-4 h-4 text-gold/60" />
                +91 9845304711
              </a>
              <a
                href="https://wa.me/919845304711"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-sans"
                data-ocid="footer.link"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                Chat on WhatsApp
              </a>
              <a
                href="https://instagram.com/prana_aayurvedic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-sans"
                data-ocid="footer.link"
              >
                <Instagram className="w-4 h-4 text-gold/60" />
                @prana__aayurvedic
              </a>
              <a
                href="mailto:pranaayurvedichome@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-sans"
                data-ocid="footer.link"
              >
                <Mail className="w-4 h-4 text-gold/60" />
                pranaayurvedichome@gmail.com
              </a>
              <div className="flex items-start gap-2 text-muted-foreground text-sm font-sans">
                <MapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                Within 15 km of Chandapura, Bangalore
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-sans">
          <span>© {year} Prana Ayurvedic. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Built with ❤ using caffeine.ai
            </a>
            <a
              href="?admin"
              className="inline-flex items-center gap-1.5 text-muted-foreground/25 hover:text-muted-foreground/60 transition-colors text-[10px] tracking-widest uppercase"
              data-ocid="footer.link"
            >
              Admin
              <span
                className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── WhatsApp SVG Icon ──────────────────────────────────────────────────────────
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const isAdmin =
    typeof window !== "undefined" && window.location.search.includes("admin");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-charcoal">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(var(--charcoal-mid))",
            border: "1px solid oklch(var(--gold) / 0.3)",
            color: "oklch(var(--cream))",
          },
        }}
      />
      <Navbar />
      <main>
        <CountdownBanner />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ReviewsSection onOpenReviewModal={() => setReviewModalOpen(true)} />
        <ContactSection />
      </main>
      <Footer />

      {/* Floating WhatsApp button — bottom-left */}
      <motion.a
        href="https://wa.me/919845304711"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 text-white font-sans font-semibold text-sm px-5 py-3 rounded-full shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 4px 20px #25D36640",
        }}
        data-ocid="whatsapp.primary_button"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">
          Chat on WhatsApp
        </span>
        {/* Tooltip for mobile (icon-only) */}
        <span className="sm:hidden sr-only">Chat on WhatsApp</span>
      </motion.a>

      {/* Floating "Leave a Review" button — bottom-right */}
      <motion.button
        type="button"
        onClick={() => setReviewModalOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gold text-charcoal font-sans font-semibold text-sm px-5 py-3 rounded-full shadow-gold hover:bg-gold-bright transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        data-ocid="review.open_modal_button"
        aria-label="Leave a review"
      >
        <Star className="w-4 h-4 fill-charcoal shrink-0" />
        <span className="hidden sm:inline">Leave a Review</span>
      </motion.button>

      {/* Review Modal */}
      <ReviewModal open={reviewModalOpen} onOpenChange={setReviewModalOpen} />
    </div>
  );
}
