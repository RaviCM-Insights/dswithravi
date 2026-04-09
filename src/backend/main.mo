import Types "types/portfolio";
import List "mo:core/List";
import PortfolioMixin "mixins/portfolio-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";

actor {
  // --- Shared list state (passed to mixin by reference) ---
  let projects = List.empty<Types.Project>();
  let testimonials = List.empty<Types.Testimonial>();
  let contacts = List.empty<Types.ContactSubmission>();
  let files = List.empty<Types.FileMetadata>();

  // --- Extensions ---
  include MixinObjectStorage();

  // --- Domain API (owns admin, counters, seeding internally) ---
  include PortfolioMixin(
    projects,
    testimonials,
    contacts,
    files,
  );
};
