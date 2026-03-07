import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

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
};
