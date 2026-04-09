import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Project = {
    id : Common.ProjectId;
    title : Text;
    description : Text;
    problemStatement : Text;
    datasetDescription : Text;
    approach : Text;
    results : Text;
    insights : Text;
    tags : [Text];
    githubUrl : ?Text;
    liveDemoUrl : ?Text;
    featured : Bool;
    createdAt : Common.Timestamp;
    viewCount : Nat;
  };

  public type ProjectInput = {
    title : Text;
    description : Text;
    problemStatement : Text;
    datasetDescription : Text;
    approach : Text;
    results : Text;
    insights : Text;
    tags : [Text];
    githubUrl : ?Text;
    liveDemoUrl : ?Text;
    featured : Bool;
  };

  public type Testimonial = {
    id : Common.TestimonialId;
    name : Text;
    role : Text;
    company : Text;
    quote : Text;
    imageUrl : ?Text;
    approved : Bool;
  };

  public type TestimonialInput = {
    name : Text;
    role : Text;
    company : Text;
    quote : Text;
    imageUrl : ?Text;
    approved : Bool;
  };

  public type ContactSubmission = {
    id : Common.ContactId;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    createdAt : Common.Timestamp;
    read : Bool;
  };

  public type ContactInput = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
  };

  public type FileMetadata = {
    id : Common.FileId;
    projectId : Common.ProjectId;
    filename : Text;
    fileType : Text;
    fileKey : Storage.ExternalBlob;
    uploadedAt : Common.Timestamp;
  };

  public type FileMetadataInput = {
    projectId : Common.ProjectId;
    filename : Text;
    fileType : Text;
    fileKey : Storage.ExternalBlob;
  };
};
