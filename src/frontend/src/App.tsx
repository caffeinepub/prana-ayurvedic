import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
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
  X,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminPanel from "./AdminPanel";
import { useSubmitInquiry } from "./hooks/useQueries";

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
];

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
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitInquiry, isPending } = useSubmitInquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !service) {
      toast.error("Please fill in all fields");
      return;
    }
    submitInquiry(
      { name: name.trim(), phone: phone.trim(), service },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName("");
          setPhone("");
          setService("");
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
              {["hero", "about", "services", "gallery", "contact"].map((id) => (
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
              className="text-muted-foreground/25 hover:text-muted-foreground/60 transition-colors text-[10px] tracking-widest uppercase"
              data-ocid="footer.link"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const isAdmin =
    typeof window !== "undefined" && window.location.search.includes("admin");

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
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
