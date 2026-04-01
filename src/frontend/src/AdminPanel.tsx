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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Leaf,
  Loader2,
  Lock,
  LogOut,
  MessageSquareReply,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  useDeleteReview,
  useGetAllInquiries,
  useGetAllReviews,
  useReplyToReview,
} from "./hooks/useQueries";

const ADMIN_PASSWORD = "prana2024";
const SEEN_COUNT_KEY = "prana_admin_seen_count";
const SEEN_REVIEWS_KEY = "prana_admin_seen_reviews";

// ── New Bookings Count Hook ────────────────────────────────────────────────────
function useNewBookingsCount(totalCount: number) {
  const lastSeen = Number.parseInt(
    localStorage.getItem(SEEN_COUNT_KEY) ?? "0",
    10,
  );
  return Math.max(0, totalCount - lastSeen);
}

function markBookingsAsSeen(count: number) {
  localStorage.setItem(SEEN_COUNT_KEY, String(count));
}

function useNewReviewsCount(totalCount: number) {
  const lastSeen = Number.parseInt(
    localStorage.getItem(SEEN_REVIEWS_KEY) ?? "0",
    10,
  );
  return Math.max(0, totalCount - lastSeen);
}

function markReviewsAsSeen(count: number) {
  localStorage.setItem(SEEN_REVIEWS_KEY, String(count));
}

// ── Star Display ───────────────────────────────────────────────────────────────
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-gold fill-gold" : "text-muted-foreground/20"}`}
        />
      ))}
    </div>
  );
}

// ── Format timestamp (nanoseconds → readable) ─────────────────────────────────
function formatTimestamp(timestampNs: bigint): string {
  const ms = Number(timestampNs / 1_000_000n);
  const date = new Date(ms);
  const now = Date.now();
  const diffDays = Math.floor((now - ms) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

// ── Bookings Tab ───────────────────────────────────────────────────────────────
function BookingsTab() {
  const { data: inquiries, isLoading, isError } = useGetAllInquiries();
  const bookings = inquiries ?? [];
  const newCount = useNewBookingsCount(bookings.length);

  useEffect(() => {
    if (!isLoading && !isError && inquiries !== undefined) {
      markBookingsAsSeen(bookings.length);
    }
  }, [bookings.length, isLoading, isError, inquiries]);

  return (
    <div>
      {/* Section heading */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl text-cream">
            Customer Bookings
          </h2>
          <AnimatePresence>
            {newCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="bg-amber/20 border border-amber/40 text-amber text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full"
                data-ocid="admin.badge"
              >
                +{newCount} new
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {!isLoading && !isError && (
          <div className="inline-flex items-center gap-2 bg-charcoal-mid border border-gold/15 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-cream font-sans text-sm">
              <span className="font-semibold text-gold">{bookings.length}</span>{" "}
              {bookings.length === 1 ? "booking" : "bookings"} total
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-muted-foreground font-sans text-sm">
            Loading bookings…
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-3"
          data-ocid="admin.error_state"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-muted-foreground font-sans text-sm">
            Failed to load bookings. Please try again.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 gap-4 bg-charcoal-mid border border-gold/10 rounded-xl"
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

      {/* Table */}
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
                <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4">
                  Service
                </TableHead>
                <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4">
                  Preferred Date
                </TableHead>
                <TableHead className="text-gold/70 font-sans text-xs tracking-widest uppercase py-4 pr-6">
                  Preferred Time
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
                  <TableCell className="py-4">
                    <span className="inline-flex items-center gap-1.5 bg-gold/8 border border-gold/20 rounded-md px-2.5 py-1 text-gold font-sans text-xs font-medium">
                      <Leaf className="w-3 h-3 opacity-70" />
                      {booking.service}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-cream/80 font-sans text-sm">
                    {booking.preferredDate
                      ? new Date(booking.preferredDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-cream/80 font-sans text-sm">
                    {booking.preferredTime || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}

// ── Reviews Tab ────────────────────────────────────────────────────────────────
function ReviewsTab() {
  const { data: reviews, isLoading, isError } = useGetAllReviews();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutate: replyToReview, isPending: isReplying } = useReplyToReview();
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const allReviews = reviews ?? [];
  const newCount = useNewReviewsCount(allReviews.length);

  useEffect(() => {
    if (!isLoading && !isError && reviews !== undefined) {
      markReviewsAsSeen(allReviews.length);
    }
  }, [allReviews.length, isLoading, isError, reviews]);

  // Pre-fill reply inputs from existing adminReply
  useEffect(() => {
    if (reviews) {
      setReplyInputs((prev) => {
        const next = { ...prev };
        for (const r of reviews) {
          const key = String(r.id);
          if (!(key in next) && r.adminReply) {
            next[key] = r.adminReply;
          }
        }
        return next;
      });
    }
  }, [reviews]);

  const handleDelete = (id: bigint, name: string) => {
    if (
      window.confirm(`Delete review from "${name}"? This cannot be undone.`)
    ) {
      deleteReview(id);
    }
  };

  const handleReply = (id: bigint) => {
    const reply = replyInputs[String(id)] ?? "";
    replyToReview({ id, reply });
  };

  return (
    <div>
      {/* Section heading */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl text-cream">Customer Reviews</h2>
          <AnimatePresence>
            {newCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="bg-amber/20 border border-amber/40 text-amber text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full"
                data-ocid="admin.badge"
              >
                +{newCount} new
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {!isLoading && !isError && (
          <div className="inline-flex items-center gap-2 bg-charcoal-mid border border-gold/15 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-cream font-sans text-sm">
              <span className="font-semibold text-gold">
                {allReviews.length}
              </span>{" "}
              {allReviews.length === 1 ? "review" : "reviews"} total
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-muted-foreground font-sans text-sm">
            Loading reviews…
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-3"
          data-ocid="admin.error_state"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-muted-foreground font-sans text-sm">
            Failed to load reviews. Please try again.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && allReviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 gap-4 bg-charcoal-mid border border-gold/10 rounded-xl"
          data-ocid="admin.empty_state"
        >
          <div className="w-14 h-14 rounded-full bg-gold/8 border border-gold/15 flex items-center justify-center">
            <Star className="w-6 h-6 text-gold/50" />
          </div>
          <div className="text-center">
            <p className="text-cream font-display text-lg mb-1">
              No reviews yet.
            </p>
            <p className="text-muted-foreground font-sans text-sm">
              Customer reviews will appear here once submitted.
            </p>
          </div>
        </motion.div>
      )}

      {/* Review Cards */}
      {!isLoading && !isError && allReviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          {allReviews.map((review, index) => (
            <motion.div
              key={Number(review.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-charcoal-mid border border-gold/15 rounded-xl p-5 flex flex-col gap-4"
              data-ocid={`admin.row.${index + 1}`}
            >
              {/* Top row: name, stars, date, delete */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-cream font-sans font-semibold text-sm">
                    {review.name}
                  </span>
                  <StarDisplay rating={Number(review.rating)} />
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-muted-foreground font-sans text-xs">
                    {formatTimestamp(review.timestamp)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleDelete(review.id, review.name)}
                    className="border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 font-sans text-xs gap-1.5 transition-all duration-200 h-8"
                    data-ocid={`admin.delete_button.${index + 1}`}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Comment */}
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {review.comment}
              </p>

              {/* Existing reply display */}
              {review.adminReply && (
                <div className="bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
                  <p className="text-gold/80 font-sans text-xs font-semibold uppercase tracking-wider mb-1">
                    Your Response
                  </p>
                  <p className="text-cream/75 font-sans text-sm leading-relaxed">
                    {review.adminReply}
                  </p>
                </div>
              )}

              {/* Reply area */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gold/8">
                <span className="text-gold/70 font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquareReply className="w-3.5 h-3.5" />
                  {review.adminReply ? "Edit Your Reply" : "Add a Reply"}
                </span>
                <Textarea
                  value={replyInputs[String(review.id)] ?? ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [String(review.id)]: e.target.value,
                    }))
                  }
                  placeholder="Write your response to this customer…"
                  className="bg-charcoal border-gold/20 text-cream placeholder:text-muted-foreground/50 font-sans text-sm resize-none min-h-[80px] focus:border-gold/40"
                  data-ocid={`admin.textarea.${index + 1}`}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={
                      isReplying || !replyInputs[String(review.id)]?.trim()
                    }
                    onClick={() => handleReply(review.id)}
                    className="bg-gold text-charcoal hover:bg-gold/90 font-sans text-xs font-semibold gap-1.5 h-8 transition-all duration-200"
                    data-ocid={`admin.save_button.${index + 1}`}
                  >
                    {isReplying ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <MessageSquareReply className="w-3 h-3" />
                    )}
                    Save Reply
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ── Admin View (after login) ───────────────────────────────────────────────────
function AdminView({ onLogout }: { onLogout: () => void }) {
  const { data: inquiries } = useGetAllInquiries();
  const { data: reviews } = useGetAllReviews();

  const bookingsCount = inquiries?.length ?? 0;
  const reviewsCount = reviews?.length ?? 0;
  const newBookingsCount = useNewBookingsCount(bookingsCount);
  const newReviewsCount = useNewReviewsCount(reviewsCount);
  const totalNew = newBookingsCount + newReviewsCount;

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
                Prana Ayurvedic
              </p>
            </div>
            {/* Header notification badge */}
            <AnimatePresence>
              {totalNew > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-1.5 bg-amber/15 border border-amber/35 rounded-full px-2.5 py-1"
                  data-ocid="admin.badge"
                >
                  <Bell className="w-3 h-3 text-amber" />
                  <span className="text-amber text-xs font-sans font-semibold">
                    +{totalNew} new
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
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
          <div className="mb-8">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">
              Prana Ayurvedic
            </span>
            <h2 className="font-display text-3xl text-cream mt-1">Dashboard</h2>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gold/10" />
            <Leaf className="w-3 h-3 text-gold/40" />
            <div className="h-px flex-1 bg-gold/10" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings">
            <TabsList className="bg-charcoal-mid border border-gold/15 rounded-xl p-1 mb-8 w-full sm:w-auto">
              <TabsTrigger
                value="bookings"
                className="font-sans text-sm data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-lg transition-all duration-200 gap-2"
                data-ocid="admin.tab"
              >
                Bookings
                {newBookingsCount > 0 && (
                  <span className="ml-1 bg-amber/30 text-amber text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    {newBookingsCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="font-sans text-sm data-[state=active]:bg-gold data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-lg transition-all duration-200 gap-2"
                data-ocid="admin.tab"
              >
                Reviews
                {newReviewsCount > 0 && (
                  <span className="ml-1 bg-amber/30 text-amber text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    {newReviewsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <BookingsTab />
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
          </Tabs>
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
          key="admin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminView onLogout={() => setIsAuthenticated(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
