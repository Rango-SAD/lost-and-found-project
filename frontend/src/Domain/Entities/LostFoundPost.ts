import type { Category, PostStatus, PostType } from "../Types/post";

export type LostFoundPost = {
    id: string;
    type: PostType;
    status: PostStatus;
    category: Category;

    itemName: string;
    tag?: string;
    location: string;

    description?: string;
    imageUrl?: string;

    publisherName?: string;
    publishedAt?: string;

    reportCount?: number;
};
