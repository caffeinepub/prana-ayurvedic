import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Migration "migration"; // separate migration module

// Use the `with` clause to apply the migration logic on upgrade
(with migration = Migration.run)
actor {
  // ── Booking (Inquiry) type ──────────────────────────────────────────────────
  type Inquiry = {
    name : Text;
    phone : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
  };

  module Inquiry {
    public func compare(a : Inquiry, b : Inquiry) : Order.Order {
      switch (Text.compare(a.name, b.name)) {
        case (#equal) { Text.compare(a.phone, b.phone) };
        case (order) { order };
      };
    };
  };

  let inquiries = Map.empty<Text, Inquiry>();

  // ── Review type ──────────────────────────────────────────────────────────────
  type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
    adminReply : ?Text;
  };

  module Review {
    public func compare(r1 : Review, r2 : Review) : Order.Order {
      let timestampOrder = Int.compare(r2.timestamp, r1.timestamp);
      switch (timestampOrder) {
        case (#equal) {
          Nat.compare(r1.id, r2.id);
        };
        case (other) { other };
      };
    };
  };

  let reviews = Map.empty<Nat, Review>();
  var nextId = 0;

  // ── Booking endpoints ──────────────────────────────────────────────────────

  public shared ({ caller }) func submitInquiry(
    name : Text,
    phone : Text,
    service : Text,
    preferredDate : Text,
    preferredTime : Text,
  ) : async () {
    if (inquiries.containsKey(phone)) {
      Runtime.trap("Booking with this phone number already exists");
    };
    inquiries.add(phone, { name; phone; service; preferredDate; preferredTime });
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray().sort();
  };

  // ── Review endpoints ─────────────────────────────────────────────────────────

  public shared ({ caller }) func submitReview(name : Text, rating : Nat, comment : Text) : async Nat {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let id = nextId;
    let review = {
      id;
      name;
      rating;
      comment;
      timestamp = Time.now();
      adminReply = null;
    };
    reviews.add(id, review);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray().sort();
  };

  public shared ({ caller }) func deleteReview(id : Nat) : async () {
    if (not reviews.containsKey(id)) {
      Runtime.trap("Review does not exist");
    };
    reviews.remove(id);
  };

  public shared ({ caller }) func replyToReview(id : Nat, reply : Text) : async () {
    switch (reviews.get(id)) {
      case (null) { Runtime.trap("Review does not exist") };
      case (?existing) {
        reviews.add(id, { existing with adminReply = ?reply });
      };
    };
  };
};

