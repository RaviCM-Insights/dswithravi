import Types "../types/portfolio";
import Common "../types/common";
import PortfolioLib "../lib/portfolio";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

mixin (
  projects : List.List<Types.Project>,
  testimonials : List.List<Types.Testimonial>,
  contacts : List.List<Types.ContactSubmission>,
  files : List.List<Types.FileMetadata>,
) {

  var _nextProjectId : Nat = 1;
  var _nextTestimonialId : Nat = 1;
  var _nextContactId : Nat = 1;
  var _nextFileId : Nat = 1;
  var _admin : Principal = Principal.fromText("aaaaa-aa");
  var _seeded : Bool = false;

  // --- Seed sample projects on first use ---
  func _ensureSeeded() {
    if (not _seeded) {
      _nextProjectId := PortfolioLib.seedProjects(projects, _nextProjectId);
      _seeded := true;
    };
  };

  // --- Init: set deployer as admin and seed projects ---
  public shared ({ caller }) func init() : async () {
    if (_admin == Principal.fromText("aaaaa-aa")) {
      _admin := caller;
    };
    _ensureSeeded();
  };

  // --- Projects (public read) ---

  public shared func getProject(id : Common.ProjectId) : async ?Types.Project {
    _ensureSeeded();
    PortfolioLib.incrementViewCount(projects, id);
    PortfolioLib.getProject(projects, id);
  };

  public query func listProjects() : async [Types.Project] {
    PortfolioLib.listProjects(projects);
  };

  public query func listFeaturedProjects() : async [Types.Project] {
    PortfolioLib.listFeaturedProjects(projects);
  };

  public shared func incrementViewCount(id : Common.ProjectId) : async () {
    PortfolioLib.incrementViewCount(projects, id);
  };

  // --- Projects (admin) ---

  public shared ({ caller }) func createProject(input : Types.ProjectInput) : async Types.Project {
    if (caller != _admin) Runtime.trap("Unauthorized");
    let (project, newId) = PortfolioLib.createProject(projects, _nextProjectId, input);
    _nextProjectId := newId;
    project;
  };

  public shared ({ caller }) func updateProject(id : Common.ProjectId, input : Types.ProjectInput) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.updateProject(projects, id, input);
  };

  public shared ({ caller }) func deleteProject(id : Common.ProjectId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.deleteProject(projects, id);
  };

  public shared ({ caller }) func toggleFeatured(id : Common.ProjectId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.toggleFeatured(projects, id);
  };

  // --- Testimonials (public read) ---

  public query func listTestimonials() : async [Types.Testimonial] {
    PortfolioLib.listTestimonials(testimonials);
  };

  // --- Testimonials (admin) ---

  public shared ({ caller }) func createTestimonial(input : Types.TestimonialInput) : async Types.Testimonial {
    if (caller != _admin) Runtime.trap("Unauthorized");
    let (testimonial, newId) = PortfolioLib.createTestimonial(testimonials, _nextTestimonialId, input);
    _nextTestimonialId := newId;
    testimonial;
  };

  public shared ({ caller }) func updateTestimonial(id : Common.TestimonialId, input : Types.TestimonialInput) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.updateTestimonial(testimonials, id, input);
  };

  public shared ({ caller }) func deleteTestimonial(id : Common.TestimonialId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.deleteTestimonial(testimonials, id);
  };

  // --- Contact (public submit) ---

  public shared func submitContact(input : Types.ContactInput) : async Types.ContactSubmission {
    let (submission, newId) = PortfolioLib.submitContact(contacts, _nextContactId, input);
    _nextContactId := newId;
    submission;
  };

  // --- Contact (admin) ---

  public shared ({ caller }) func listContacts() : async [Types.ContactSubmission] {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.listContacts(contacts);
  };

  public shared ({ caller }) func deleteContact(id : Common.ContactId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.deleteContact(contacts, id);
  };

  public shared ({ caller }) func markContactRead(id : Common.ContactId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.markContactRead(contacts, id);
  };

  // --- File Metadata (admin) ---

  public shared ({ caller }) func addFileMetadata(input : Types.FileMetadataInput) : async Types.FileMetadata {
    if (caller != _admin) Runtime.trap("Unauthorized");
    let (meta, newId) = PortfolioLib.addFileMetadata(files, _nextFileId, input);
    _nextFileId := newId;
    meta;
  };

  public shared ({ caller }) func deleteFileMetadata(id : Common.FileId) : async Bool {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.deleteFileMetadata(files, id);
  };

  // --- File Metadata (public read) ---

  public query func getFilesByProject(projectId : Common.ProjectId) : async [Types.FileMetadata] {
    PortfolioLib.getFilesByProject(files, projectId);
  };

  // --- Analytics (admin) ---

  public shared ({ caller }) func getAnalytics() : async Common.Analytics {
    if (caller != _admin) Runtime.trap("Unauthorized");
    PortfolioLib.getAnalytics(projects, contacts);
  };

  // --- Admin management ---

  public shared ({ caller }) func setAdmin(newAdmin : Principal) : async () {
    if (caller != _admin) Runtime.trap("Unauthorized");
    _admin := newAdmin;
  };

  public query func getAdmin() : async Principal {
    _admin;
  };

  public query func isAdmin(p : Principal) : async Bool {
    p == _admin;
  };
};
