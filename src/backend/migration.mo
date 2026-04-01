import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // v1 Inquiry
  type InquiryV1 = {
    name : Text;
    phone : Text;
    service : Text;
  };

  // v2 Inquiry
  type InquiryV2 = {
    name : Text;
    phone : Text;
    service : Text;
    preferredDate : Text;
  };

  // v3 Inquiry
  type Inquiry = {
    name : Text;
    phone : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
  };

  // Old Review (no adminReply)
  type OldReview = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  // New Review (with adminReply)
  type NewReview = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
    adminReply : ?Text;
  };

  // Old actor state
  type OldActor = {
    inquiries : Map.Map<Text, InquiryV1>;
    inquiriesV2 : Map.Map<Text, InquiryV2>;
    inquiriesV3 : Map.Map<Text, Inquiry>;
    inquiryMigrationDone : Bool;
    inquiryMigrationV3Done : Bool;
    reviews : Map.Map<Nat, OldReview>;
    nextReviewId : Nat;
  };

  // New actor state
  type NewActor = {
    inquiries : Map.Map<Text, Inquiry>;
    reviews : Map.Map<Nat, NewReview>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    // v1 → v2 migration
    let inquiriesV2 = if (not old.inquiryMigrationDone) {
      old.inquiries.map<Text, InquiryV1, InquiryV2>(
        func(_k, v) {
          {
            name = v.name;
            phone = v.phone;
            service = v.service;
            preferredDate = "";
          };
        }
      );
    } else {
      old.inquiriesV2;
    };
    // v2 → v3 migration
    let inquiries = if (not old.inquiryMigrationV3Done) {
      inquiriesV2.map<Text, InquiryV2, Inquiry>(
        func(_k, v) {
          {
            name = v.name;
            phone = v.phone;
            service = v.service;
            preferredDate = v.preferredDate;
            preferredTime = "";
          };
        }
      );
    } else {
      old.inquiriesV3;
    };
    let reviews = old.reviews.map<Nat, OldReview, NewReview>(
      func(_id, oldReview) {
        {
          oldReview with adminReply = null;
        };
      }
    );
    {
      inquiries;
      reviews;
      nextId = old.nextReviewId;
    };
  };
};
