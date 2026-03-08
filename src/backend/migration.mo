import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Inquiry = {
    name : Text;
    phone : Text;
    service : Text;
  };

  type OldActor = {
    inquiries : Map.Map<Text, Inquiry>;
  };

  type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
  };

  type NewActor = {
    inquiries : Map.Map<Text, Inquiry>;
    reviews : Map.Map<Nat, Review>;
    nextReviewId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      inquiries = old.inquiries;
      reviews = Map.empty<Nat, Review>();
      nextReviewId = 0;
    };
  };
};
