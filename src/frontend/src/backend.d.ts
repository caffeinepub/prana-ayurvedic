import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: bigint;
    name: string;
    comment: string;
    timestamp: bigint;
    rating: bigint;
}
export interface Inquiry {
    service: string;
    name: string;
    phone: string;
}
export interface backendInterface {
    deleteReview(id: bigint): Promise<void>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllReviews(): Promise<Array<Review>>;
    submitInquiry(name: string, phone: string, service: string): Promise<void>;
    submitReview(name: string, rating: bigint, comment: string): Promise<bigint>;
}
