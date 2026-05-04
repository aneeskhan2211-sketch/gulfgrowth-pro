import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  // User types
  public type Plan = { #none; #starter; #growth; #premium };
  public type UserRole = { #user; #admin };
  public type User = {
    id : Nat;
    principal : Principal;
    name : Text;
    email : Text;
    phone : Text;
    country : Text;
    var plan : Plan;
    var role : UserRole;
    createdAt : Timestamp;
  };
  public type UserPublic = {
    id : Nat;
    principal : Principal;
    name : Text;
    email : Text;
    phone : Text;
    country : Text;
    plan : Plan;
    role : UserRole;
    createdAt : Timestamp;
  };

  // Business types
  public type Business = {
    id : Nat;
    userId : Nat;
    name : Text;
    city : Text;
    category : Text;
    whatsapp : Text;
    instagram : Text;
    googleMaps : Text;
    description : Text;
    createdAt : Timestamp;
  };

  // Audit types
  public type Audit = {
    id : Nat;
    userId : Nat;
    businessId : Nat;
    googleScore : Nat;
    instagramScore : Nat;
    whatsappScore : Nat;
    websiteScore : Nat;
    leadScore : Nat;
    createdAt : Timestamp;
  };

  // Lead types
  public type LeadSource = { #whatsapp; #website; #google; #instagram };
  public type LeadType = { #inquiry; #call; #booking };
  public type LeadStatus = { #new_; #contacted; #converted };
  public type Lead = {
    id : Nat;
    businessId : Nat;
    source : LeadSource;
    leadType : LeadType;
    var status : LeadStatus;
    createdAt : Timestamp;
  };
  public type LeadPublic = {
    id : Nat;
    businessId : Nat;
    source : LeadSource;
    leadType : LeadType;
    status : LeadStatus;
    createdAt : Timestamp;
  };

  // Subscription types
  public type SubscriptionStatus = { #active; #canceled; #expired };
  public type Subscription = {
    id : Nat;
    userId : Nat;
    plan : Plan;
    var status : SubscriptionStatus;
    stripeSubscriptionId : Text;
    startDate : Timestamp;
    endDate : Timestamp;
    createdAt : Timestamp;
  };
  public type SubscriptionPublic = {
    id : Nat;
    userId : Nat;
    plan : Plan;
    status : SubscriptionStatus;
    stripeSubscriptionId : Text;
    startDate : Timestamp;
    endDate : Timestamp;
    createdAt : Timestamp;
  };

  // Invoice types
  public type InvoiceStatus = { #paid; #pending; #failed };
  public type Invoice = {
    id : Nat;
    subscriptionId : Nat;
    amount : Nat;
    currency : Text;
    status : InvoiceStatus;
    date : Timestamp;
    createdAt : Timestamp;
  };

  // Contact types
  public type Contact = {
    id : Nat;
    businessName : Text;
    ownerName : Text;
    country : Text;
    city : Text;
    service : Text;
    whatsapp : Text;
    budget : Text;
    createdAt : Timestamp;
  };

  // Input types for creation
  public type CreateUserInput = {
    principal : Principal;
    name : Text;
    email : Text;
    phone : Text;
    country : Text;
  };

  public type CreateBusinessInput = {
    userId : Nat;
    name : Text;
    city : Text;
    category : Text;
    whatsapp : Text;
    instagram : Text;
    googleMaps : Text;
    description : Text;
  };

  public type CreateAuditInput = {
    userId : Nat;
    businessId : Nat;
    googleScore : Nat;
    instagramScore : Nat;
    whatsappScore : Nat;
    websiteScore : Nat;
    leadScore : Nat;
  };

  public type CreateLeadInput = {
    businessId : Nat;
    source : LeadSource;
    leadType : LeadType;
  };

  public type CreateSubscriptionInput = {
    userId : Nat;
    plan : Plan;
    stripeSubscriptionId : Text;
    startDate : Timestamp;
    endDate : Timestamp;
  };

  public type CreateInvoiceInput = {
    subscriptionId : Nat;
    amount : Nat;
    currency : Text;
    status : InvoiceStatus;
    date : Timestamp;
  };

  public type CreateContactInput = {
    businessName : Text;
    ownerName : Text;
    country : Text;
    city : Text;
    service : Text;
    whatsapp : Text;
    budget : Text;
  };
};
