import type {
  Analytics as BackendAnalytics,
  ContactInput as BackendContactInput,
  ContactSubmission as BackendContactSubmission,
  FileMetadata as BackendFileMetadata,
  FileMetadataInput as BackendFileMetadataInput,
  Project as BackendProject,
  ProjectInput as BackendProjectInput,
  Testimonial as BackendTestimonial,
  TestimonialInput as BackendTestimonialInput,
  ContactId,
  FileId,
  ProjectId,
  TestimonialId,
  Timestamp,
} from "../backend.d.ts";

export type { ProjectId, TestimonialId, ContactId, FileId, Timestamp };

export type Project = BackendProject;
export type ProjectInput = BackendProjectInput;
export type Testimonial = BackendTestimonial;
export type TestimonialInput = BackendTestimonialInput;
export type ContactSubmission = BackendContactSubmission;
export type ContactInput = BackendContactInput;
export type FileMetadata = BackendFileMetadata;
export type FileMetadataInput = BackendFileMetadataInput;
export type Analytics = BackendAnalytics;

export type ProjectCategory =
  | "Machine Learning"
  | "Data Analysis"
  | "NLP"
  | "Visualization"
  | "All";

export interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

export type Theme = "dark" | "light";
