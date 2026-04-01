import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

actor {
  // ── Migration: old Inquiry type (v1, no preferredDate) ──────────────────────
  type InquiryV1 = {
    name : Text;
    phone : Text;
    service : Text;
  };

  // ── Migration: v2 type (with preferredDate, no preferredTime) ────────────────
  type InquiryV2 = {
    name : Text;
    phone : Text;
    service : Text;
    preferredDate : Text;
  };

  // ── Current Inquiry type (v3, with preferredDate + preferredTime) ────────────
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

  // Old stable store (v1) — retains the name so runtime can load existing stable data.
  let inquiries = Map.empty<Text, InquiryV1>();

  // v2 stable store.
  let inquiriesV2 = Map.empty<Text, InquiryV2>();

  // v3 stable store (current).
  let inquiriesV3 = Map.empty<Text, Inquiry>();

  // Migration flags.
  var inquiryMigrationDone = false;
  var inquiryMigrationV3Done = false;

  system func postupgrade() {
    // v1 -> v2
    if (not inquiryMigrationDone) {
      for ((k, v) in inquiries.entries()) {
        inquiriesV2.add(k, {
          name = v.name;
          phone = v.phone;
          service = v.service;
          preferredDate = "";
        });
      };
      inquiryMigrationDone := true;
    };
    // v2 -> v3
    if (not inquiryMigrationV3Done) {
      for ((k, v) in inquiriesV2.entries()) {
        inquiriesV3.add(k, {
          name = v.name;
          phone = v.phone;
          service = v.service;
          preferredDate = v.preferredDate;
          preferredTime = "";
        });
      };
      inquiryMigrationV3Done := true;
    };
  };

  // ── Review type ──────────────────────────────────────────────────────────────
  type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  module Review {
    public func compare(r1 : Review, r2 : Review) : Order.Order {
      Int.compare(r2.timestamp, r1.timestamp);
    };
  };

  let reviews = Map.empty<Nat, Review>();
  var nextReviewId = 0;

  // ── Inquiry endpoints ────────────────────────────────────────────────────────

  public shared ({ caller }) func submitInquiry(
    name : Text,
    phone : Text,
    service : Text,
    preferredDate : Text,
    preferredTime : Text,
  ) : async () {
    if (inquiriesV3.containsKey(phone)) {
      Runtime.trap("Inquiry with this phone number already exists");
    };
    inquiriesV3.add(phone, { name; phone; service; preferredDate; preferredTime });
  };

  public shared ({ caller }) func getAllInquiries() : async [Inquiry] {
    let entries = inquiriesV3.values().toArray();
    entries.sort();
  };

  // ── Review endpoints ─────────────────────────────────────────────────────────

  public shared ({ caller }) func submitReview(
    name : Text,
    rating : Nat,
    comment : Text,
  ) : async Nat {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let review : Review = {
      id = nextReviewId;
      name;
      rating;
      comment;
      timestamp = Time.now();
    };
    reviews.add(nextReviewId, review);
    let currentId = nextReviewId;
    nextReviewId += 1;
    currentId;
  };

  public shared ({ caller }) func getAllReviews() : async [Review] {
    let entries = reviews.values().toArray();
    entries.sort();
  };

  public shared ({ caller }) func deleteReview(id : Nat) : async () {
    if (not reviews.containsKey(id)) {
      Runtime.trap("Review does not exist");
    };
    reviews.remove(id);
  };
};
