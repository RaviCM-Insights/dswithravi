import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Analytics,
  ContactId,
  ContactInput,
  ContactSubmission,
  FileId,
  Project,
  ProjectId,
  ProjectInput,
  Testimonial,
  TestimonialId,
  TestimonialInput,
} from "../types";

// ─── Projects ────────────────────────────────────────────────────────────────

export function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project[]>({
    queryKey: ["projects", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFeaturedProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProject(id: ProjectId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project | null>({
    queryKey: ["project", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useCreateProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Project, Error, ProjectInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createProject(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: ProjectId; input: ProjectInput }>({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProject(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, ProjectId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useToggleFeatured() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, ProjectId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.toggleFeatured(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useIncrementViewCount() {
  const { actor } = useActor(createActor);
  return useMutation<void, Error, ProjectId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.incrementViewCount(id);
    },
  });
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export function useTestimonials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Testimonial, Error, TestimonialInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createTestimonial(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { id: TestimonialId; input: TestimonialInput }
  >({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateTestimonial(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, TestimonialId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export function useSubmitContact() {
  const { actor } = useActor(createActor);
  return useMutation<ContactSubmission, Error, ContactInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitContact(input);
    },
  });
}

export function useContacts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContactSubmission[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkContactRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, ContactId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markContactRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, ContactId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteContact(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ─── Files ───────────────────────────────────────────────────────────────────

export function useProjectFiles(projectId: ProjectId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["files", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === undefined) return [];
      return actor.getFilesByProject(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== undefined,
  });
}

export function useDeleteFile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, FileId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteFileMetadata(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function useAnalytics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Analytics>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}
