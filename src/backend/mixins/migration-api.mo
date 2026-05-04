import Debug "mo:core/Debug";
import Types "../types/migration";
import List "mo:core/List";

mixin (
  users : List.List<Types.User>,
  businesses : List.List<Types.Business>,
  audits : List.List<Types.Audit>,
  leads : List.List<Types.Lead>,
  subscriptions : List.List<Types.Subscription>,
  invoices : List.List<Types.Invoice>,
  contacts : List.List<Types.Contact>,
  nextUserId : Nat,
  nextBusinessId : Nat,
  nextAuditId : Nat,
  nextLeadId : Nat,
  nextSubscriptionId : Nat,
  nextInvoiceId : Nat,
  nextContactId : Nat,
) {
  // --- User API ---

  public shared ({ caller }) func createUser(
    input : Types.CreateUserInput
  ) : async Types.UserPublic {
    Debug.todo();
  };

  public query func getUser(id : Nat) : async ?Types.UserPublic {
    Debug.todo();
  };

  public shared ({ caller }) func updateUser(
    id : Nat,
    name : Text,
    email : Text,
    phone : Text,
    country : Text,
  ) : async Bool {
    Debug.todo();
  };

  public shared ({ caller }) func updateUserRole(
    id : Nat,
    role : Types.UserRole,
  ) : async Bool {
    Debug.todo();
  };

  public query func listUsers() : async [Types.UserPublic] {
    Debug.todo();
  };

  // --- Business API ---

  public shared ({ caller }) func createBusiness(
    input : Types.CreateBusinessInput
  ) : async Types.Business {
    Debug.todo();
  };

  public query func getBusiness(id : Nat) : async ?Types.Business {
    Debug.todo();
  };

  public query func getBusinessByUser(userId : Nat) : async ?Types.Business {
    Debug.todo();
  };

  // --- Audit API ---

  public shared ({ caller }) func createAudit(
    input : Types.CreateAuditInput
  ) : async Types.Audit {
    Debug.todo();
  };

  public query func getAuditsByUser(userId : Nat) : async [Types.Audit] {
    Debug.todo();
  };

  // --- Lead API ---

  public shared ({ caller }) func createLead(
    input : Types.CreateLeadInput
  ) : async Types.LeadPublic {
    Debug.todo();
  };

  public query func getLeadsByBusiness(businessId : Nat) : async [Types.LeadPublic] {
    Debug.todo();
  };

  public query func listLeads() : async [Types.LeadPublic] {
    Debug.todo();
  };

  // --- Subscription API ---

  public shared ({ caller }) func createSubscription(
    input : Types.CreateSubscriptionInput
  ) : async Types.SubscriptionPublic {
    Debug.todo();
  };

  public query func getSubscriptionByUser(userId : Nat) : async ?Types.SubscriptionPublic {
    Debug.todo();
  };

  public shared ({ caller }) func updateSubscription(
    id : Nat,
    status : Types.SubscriptionStatus,
  ) : async Bool {
    Debug.todo();
  };

  // --- Invoice API ---

  public shared ({ caller }) func createInvoice(
    input : Types.CreateInvoiceInput
  ) : async Types.Invoice {
    Debug.todo();
  };

  public query func getInvoicesByUser(userId : Nat) : async [Types.Invoice] {
    Debug.todo();
  };

  // --- Contact API ---

  public shared ({ caller }) func createContact(
    input : Types.CreateContactInput
  ) : async Types.Contact {
    Debug.todo();
  };

  public query func listContacts() : async [Types.Contact] {
    Debug.todo();
  };
};
