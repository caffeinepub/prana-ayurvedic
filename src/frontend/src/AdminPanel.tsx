import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Leaf, Loader2, Lock, LogOut, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useGetAllInquiries } from "./hooks/useQueries";

const ADMIN_PASSWORD = "prana2024";

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-amber/3 blur-3xl pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--gold)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Card */}
        <div className="bg-charcoal-mid border border-gold/15 rounded-2xl p-8 shadow-gold">
          {/* Logo / Icon area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-4 shadow-gold">
              <Lock className="w-7 h-7 text-gold" />
            </div>
            <h1 className="font-display text-2xl text-cream tracking-tight">
              Prana Admin
            </h1>
            <p className="text-muted-foreground font-sans text-sm mt-1.5 tracking-wide">
              Sign in to view bookings
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gold/10" />
            <Leaf className="w-3 h-3 text-gold/40" />
            <div className="h-px flex-1 bg-gold/10" />
          </div>

          <motion.form
            onSubmit={handleSubmit}
            animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-cream/70 font-sans text-xs tracking-widest uppercase"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="bg-charcoal border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold/60 focus:ring-gold/20 h-12 font-sans"
                data-ocid="admin.input"
                autoComplete="current-password"
              />
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-red-400 font-sans flex items-center gap-2"
                  data-ocid="admin.error_state"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  Incorrect password
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full bg-gold text-charcoal hover:bg-gold-bright font-sans font-semibold h-12 text-sm tracking-widest uppercase transition-all duration-300 shadow-gold hover:shadow-gold-lg"
              data-ocid="admin.submit_button"
            >
              Sign In
            </Button>
          </motion.form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-xs text-muted-foreground font-sans">
          <a
            href="/"
            className="hover:text-gold transition-colors underline underline-offset-4"
          >
            ← Back to Prana website
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// ── Bookings View ──────────────────────────────────────────────────────────────
function BookingsView({ onLogout }: { onLogout: () => void }) {
  const { data: inquiries, isLoading, isError } = useGetAllInquiries();

  const bookings = inquiries ?? [];

  return (
    <div className="min-h-screen bg-charcoal relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/3 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="bg-charcoal-mid border-b border-gold/10 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-cream text-lg leading-none">
                Admin
              </h1>
              <p className="text-muted-foreground font-sans text-xs mt-0.5">
                Bookings Panel
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-gold/25 text-muted-foreground hover:text-cream hover:border-gold/60 hover:bg-gold/5 font-sans text-xs tracking-wide gap-2 transition-all duration-200"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Page heading */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">
                Prana Ayurvedic
              </span>
              <h2 className="font-display text-3xl text-cream mt-1">
                Customer Bookings
              </h2>
            </div>
            {!isLoading && !isError && (
              <div className="inline-flex items-center gap-2 bg-charcoal-mid border border-gold/15 rounded-lg px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-cream font-sans text-sm">
                  <span className="font-semibold text-gold">
                    {bookings.length}
                  </span>{" "}
                  {bookings.length === 1 ? "booking" : "bookings"} total
                </span>
              </div>
            )}
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gold/10" />
            <Leaf className="w-3 h-3 text-gold/40" />
            <div className="h-px flex-1 bg-gold/10" />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-muted-foreground font-sans text-sm">
                Loading bookings…
              </p>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xl">!</span>
              </div>
              <p className="text-muted-foreground font-sans text-sm">
                Failed to load bookings. Please try again.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center py-24 gap-4 bg-charcoal-mid border border-gold/10 rounded-xl"
              data-ocid="admin.empty_state"
            >
              <div className="w-14 h-14 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-gold/50" />
              </div>
              <div className="text-center">
                <p className="text-cream font-display text-lg mb-1">
                  No bookings yet.
                </p>
                <p className="text-muted-foreground font-sans text-sm">
                  Customer bookings will appear here once submitted.
                </p>
              </div>
            </motion.div>
          )}

          {/* Bookings table */}
          {!isLoading && !isError && bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-charcoal-mid border border-gold/10 rounded-xl overflow-hidden"
            >
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-b border-gold/10 hover:bg-transparent">
                    <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4 pl-6 w-8">
                      #
                    </TableHead>
                    <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4">
                      Name
                    </TableHead>
                    <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4">
                      Phone
                    </TableHead>
                    <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4 pr-6">
                      Service
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow
                      key={`${booking.name}-${booking.phone}-${booking.service}-${index}`}
                      className="border-b border-gold/5 last:border-0 hover:bg-gold/3 transition-colors duration-150"
                      data-ocid={`admin.row.${index + 1}`}
                    >
                      <TableCell className="text-muted-foreground font-sans text-sm py-4 pl-6 w-8">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-cream font-sans text-sm py-4 font-medium">
                        {booking.name}
                      </TableCell>
                      <TableCell className="py-4">
                        <a
                          href={`tel:${booking.phone}`}
                          className="text-gold font-sans text-sm hover:text-gold-bright transition-colors underline underline-offset-4"
                        >
                          {booking.phone}
                        </a>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <span className="inline-flex items-center gap-1.5 bg-gold/8 border border-gold/20 rounded-md px-2.5 py-1 text-gold font-sans text-xs font-medium">
                          <Leaf className="w-3 h-3 opacity-70" />
                          {booking.service}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 mt-4">
        <div className="h-px bg-gold/8 mb-6" />
        <p className="text-center text-xs text-muted-foreground/40 font-sans">
          Prana Ayurvedic Admin Panel · Private access only
        </p>
      </footer>
    </div>
  );
}

// ── AdminPanel (entry) ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginScreen onLogin={() => setIsAuthenticated(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="bookings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BookingsView onLogout={() => setIsAuthenticated(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
