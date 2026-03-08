import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Inquiry = {
    name : Text;
    phone : Text;
    service : Text;
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      switch (Text.compare(inquiry1.name, inquiry2.name)) {
        case (#equal) { Text.compare(inquiry1.phone, inquiry2.phone) };
        case (order) { order };
      };
    };
  };

  let inquiries = Map.empty<Text, Inquiry>();

  // Review type definition
  type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      Int.compare(review2.timestamp, review1.timestamp);
    };
  };

  let reviews = Map.empty<Nat, Review>();
  var nextReviewId = 0;

  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, service : Text) : async () {
    if (inquiries.containsKey(phone)) {
      Runtime.trap("Inquiry with this phone number already exists");
    };
    let newInquiry : Inquiry = {
      name;
      phone;
      service;
    };
    inquiries.add(phone, newInquiry);
  };

  public shared ({ caller }) func getAllInquiries() : async [Inquiry] {
    let entries = inquiries.values().toArray();
    entries.sort();
  };

  // Reviews/Feedback System

  public shared ({ caller }) func submitReview(name : Text, rating : Nat, comment : Text) : async Nat {
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
