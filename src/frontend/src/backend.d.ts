import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactInput {
    subject: string;
    name: string;
    email: string;
    message: string;
}
export type Timestamp = bigint;
export interface FileMetadata {
    id: FileId;
    fileType: string;
    filename: string;
    projectId: ProjectId;
    uploadedAt: Timestamp;
    fileKey: ExternalBlob;
}
export interface ContactSubmission {
    id: ContactId;
    subject: string;
    name: string;
    createdAt: Timestamp;
    read: boolean;
    email: string;
    message: string;
}
export interface TestimonialInput {
    name: string;
    role: string;
    quote: string;
    company: string;
    imageUrl?: string;
    approved: boolean;
}
export interface ProjectInput {
    insights: string;
    title: string;
    featured: boolean;
    tags: Array<string>;
    description: string;
    githubUrl?: string;
    results: string;
    liveDemoUrl?: string;
    datasetDescription: string;
    approach: string;
    problemStatement: string;
}
export interface FileMetadataInput {
    fileType: string;
    filename: string;
    projectId: ProjectId;
    fileKey: ExternalBlob;
}
export interface Analytics {
    totalViews: bigint;
    contactCount: bigint;
    projectCount: bigint;
    featuredCount: bigint;
}
export type ProjectId = bigint;
export type FileId = bigint;
export type ContactId = bigint;
export interface Project {
    id: ProjectId;
    insights: string;
    title: string;
    featured: boolean;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    githubUrl?: string;
    results: string;
    liveDemoUrl?: string;
    datasetDescription: string;
    viewCount: bigint;
    approach: string;
    problemStatement: string;
}
export type TestimonialId = bigint;
export interface Testimonial {
    id: TestimonialId;
    name: string;
    role: string;
    quote: string;
    company: string;
    imageUrl?: string;
    approved: boolean;
}
export interface backendInterface {
    addFileMetadata(input: FileMetadataInput): Promise<FileMetadata>;
    createProject(input: ProjectInput): Promise<Project>;
    createTestimonial(input: TestimonialInput): Promise<Testimonial>;
    deleteContact(id: ContactId): Promise<boolean>;
    deleteFileMetadata(id: FileId): Promise<boolean>;
    deleteProject(id: ProjectId): Promise<boolean>;
    deleteTestimonial(id: TestimonialId): Promise<boolean>;
    getAdmin(): Promise<Principal>;
    getAnalytics(): Promise<Analytics>;
    getFilesByProject(projectId: ProjectId): Promise<Array<FileMetadata>>;
    getProject(id: ProjectId): Promise<Project | null>;
    incrementViewCount(id: ProjectId): Promise<void>;
    init(): Promise<void>;
    isAdmin(p: Principal): Promise<boolean>;
    listContacts(): Promise<Array<ContactSubmission>>;
    listFeaturedProjects(): Promise<Array<Project>>;
    listProjects(): Promise<Array<Project>>;
    listTestimonials(): Promise<Array<Testimonial>>;
    markContactRead(id: ContactId): Promise<boolean>;
    setAdmin(newAdmin: Principal): Promise<void>;
    submitContact(input: ContactInput): Promise<ContactSubmission>;
    toggleFeatured(id: ProjectId): Promise<boolean>;
    updateProject(id: ProjectId, input: ProjectInput): Promise<boolean>;
    updateTestimonial(id: TestimonialId, input: TestimonialInput): Promise<boolean>;
}
