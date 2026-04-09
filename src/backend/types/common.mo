module {
  public type Timestamp = Int;
  public type ProjectId = Nat;
  public type TestimonialId = Nat;
  public type ContactId = Nat;
  public type FileId = Nat;

  public type Analytics = {
    projectCount : Nat;
    contactCount : Nat;
    featuredCount : Nat;
    totalViews : Nat;
  };
};
