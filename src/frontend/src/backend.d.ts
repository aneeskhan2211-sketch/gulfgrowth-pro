import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface UserPublic {
    id: bigint;
    principal: Principal;
    country: string;
    name: string;
    createdAt: Timestamp;
    plan: Plan;
    role: UserRole;
    email: string;
    phone: string;
}
export interface LeadPublic {
    id: bigint;
    status: LeadStatus;
    leadType: LeadType;
    source: LeadSource;
    businessId: bigint;
    createdAt: Timestamp;
}
export interface CreateUserInput {
    principal: Principal;
    country: string;
    name: string;
    email: string;
    phone: string;
}
export interface CreateLeadInput {
    leadType: LeadType;
    source: LeadSource;
    businessId: bigint;
}
export interface CreateInvoiceInput {
    status: InvoiceStatus;
    date: Timestamp;
    subscriptionId: bigint;
    currency: string;
    amount: bigint;
}
export interface Invoice {
    id: bigint;
    status: InvoiceStatus;
    date: Timestamp;
    createdAt: Timestamp;
    subscriptionId: bigint;
    currency: string;
    amount: bigint;
}
export interface Contact {
    id: bigint;
    service: string;
    country: string;
    ownerName: string;
    city: string;
    createdAt: Timestamp;
    businessName: string;
    whatsapp: string;
    budget: string;
}
export interface Business {
    id: bigint;
    city: string;
    userId: bigint;
    instagram: string;
    name: string;
    createdAt: Timestamp;
    whatsapp: string;
    description: string;
    category: string;
    googleMaps: string;
}
export interface CreateBusinessInput {
    city: string;
    userId: bigint;
    instagram: string;
    name: string;
    whatsapp: string;
    description: string;
    category: string;
    googleMaps: string;
}
export interface CreateContactInput {
    service: string;
    country: string;
    ownerName: string;
    city: string;
    businessName: string;
    whatsapp: string;
    budget: string;
}
export interface CreateAuditInput {
    businessId: bigint;
    userId: bigint;
    instagramScore: bigint;
    leadScore: bigint;
    websiteScore: bigint;
    whatsappScore: bigint;
    googleScore: bigint;
}
export interface CreateSubscriptionInput {
    endDate: Timestamp;
    stripeSubscriptionId: string;
    userId: bigint;
    plan: Plan;
    startDate: Timestamp;
}
export interface SubscriptionPublic {
    id: bigint;
    status: SubscriptionStatus;
    endDate: Timestamp;
    stripeSubscriptionId: string;
    userId: bigint;
    createdAt: Timestamp;
    plan: Plan;
    startDate: Timestamp;
}
export interface Audit {
    id: bigint;
    businessId: bigint;
    userId: bigint;
    createdAt: Timestamp;
    instagramScore: bigint;
    leadScore: bigint;
    websiteScore: bigint;
    whatsappScore: bigint;
    googleScore: bigint;
}
export enum InvoiceStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum LeadSource {
    instagram = "instagram",
    whatsapp = "whatsapp",
    google = "google",
    website = "website"
}
export enum LeadStatus {
    new_ = "new",
    contacted = "contacted",
    converted = "converted"
}
export enum LeadType {
    call = "call",
    inquiry = "inquiry",
    booking = "booking"
}
export enum Plan {
    growth = "growth",
    starter = "starter",
    premium = "premium",
    none = "none"
}
export enum SubscriptionStatus {
    active = "active",
    canceled = "canceled",
    expired = "expired"
}
export enum UserRole {
    admin = "admin",
    user = "user"
}
export interface backendInterface {
    createAudit(input: CreateAuditInput): Promise<Audit>;
    createBusiness(input: CreateBusinessInput): Promise<Business>;
    createContact(input: CreateContactInput): Promise<Contact>;
    createInvoice(input: CreateInvoiceInput): Promise<Invoice>;
    createLead(input: CreateLeadInput): Promise<LeadPublic>;
    createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionPublic>;
    createUser(input: CreateUserInput): Promise<UserPublic>;
    getAuditsByUser(userId: bigint): Promise<Array<Audit>>;
    getBusiness(id: bigint): Promise<Business | null>;
    getBusinessByUser(userId: bigint): Promise<Business | null>;
    getInvoicesByUser(userId: bigint): Promise<Array<Invoice>>;
    getLeadsByBusiness(businessId: bigint): Promise<Array<LeadPublic>>;
    getSubscriptionByUser(userId: bigint): Promise<SubscriptionPublic | null>;
    getUser(id: bigint): Promise<UserPublic | null>;
    listContacts(): Promise<Array<Contact>>;
    listLeads(): Promise<Array<LeadPublic>>;
    listUsers(): Promise<Array<UserPublic>>;
    updateSubscription(id: bigint, status: SubscriptionStatus): Promise<boolean>;
    updateUser(id: bigint, name: string, email: string, phone: string, country: string): Promise<boolean>;
    updateUserRole(id: bigint, role: UserRole): Promise<boolean>;
}
