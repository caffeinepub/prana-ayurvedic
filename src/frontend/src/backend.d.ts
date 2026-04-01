export interface Inquiry {
    preferredDate: string;
    preferredTime: string;
    name: string;
    phone: string;
    service: string;
}

export interface Review {
    id: bigint;
    name: string;
    rating: bigint;
    comment: string;
    timestamp: bigint;
}

export interface BackendActor {
    getAllInquiries(): Promise<Array<Inquiry>>;
    deleteReview(id: bigint): Promise<void>;
    submitInquiry(name: string, phone: string, service: string, preferredDate: string, preferredTime: string): Promise<void>;
    submitReview(name: string, rating: bigint, comment: string): Promise<bigint>;
    getAllReviews(): Promise<Array<Review>>;
}
