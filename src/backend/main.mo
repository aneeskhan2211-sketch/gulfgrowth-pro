import Types "types/migration";
import List "mo:core/List";
import Map "mo:core/Map";
import GulfGrowthApi "mixins/migration-api";

actor {
  // Legacy FrameWorks types — preserved for stable upgrade compatibility (M0169)
  type LegacyProject = {
    name : Text;
    lastModified : Int;
    elementCount : Nat;
    state : Text;
  };

  type LegacyPreferences = {
    shellMode : Bool;
    renderMode : Text;
    beginnerMode : Bool;
    highContrast : Bool;
  };

  let users = List.empty<Types.User>();
  let businesses = List.empty<Types.Business>();
  let audits = List.empty<Types.Audit>();
  let leads = List.empty<Types.Lead>();
  let subscriptions = List.empty<Types.Subscription>();
  let invoices = List.empty<Types.Invoice>();
  let contacts = List.empty<Types.Contact>();

  // Legacy FrameWorks stable fields — retained to satisfy M0169 upgrade compatibility
  let userProjects = Map.empty<Principal, Map.Map<Text, LegacyProject>>();
  let userPreferences = Map.empty<Principal, LegacyPreferences>();

  var nextUserId : Nat = 0;
  var nextBusinessId : Nat = 0;
  var nextAuditId : Nat = 0;
  var nextLeadId : Nat = 0;
  var nextSubscriptionId : Nat = 0;
  var nextInvoiceId : Nat = 0;
  var nextContactId : Nat = 0;

  include GulfGrowthApi(
    users,
    businesses,
    audits,
    leads,
    subscriptions,
    invoices,
    contacts,
    nextUserId,
    nextBusinessId,
    nextAuditId,
    nextLeadId,
    nextSubscriptionId,
    nextInvoiceId,
    nextContactId,
  );
};
