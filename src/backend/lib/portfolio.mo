import Types "../types/portfolio";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // --- Projects ---

  public func createProject(
    projects : List.List<Types.Project>,
    nextId : Nat,
    input : Types.ProjectInput,
  ) : (Types.Project, Nat) {
    let project : Types.Project = {
      id = nextId;
      title = input.title;
      description = input.description;
      problemStatement = input.problemStatement;
      datasetDescription = input.datasetDescription;
      approach = input.approach;
      results = input.results;
      insights = input.insights;
      tags = input.tags;
      githubUrl = input.githubUrl;
      liveDemoUrl = input.liveDemoUrl;
      featured = input.featured;
      createdAt = Time.now();
      viewCount = 0;
    };
    projects.add(project);
    (project, nextId + 1);
  };

  public func updateProject(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
    input : Types.ProjectInput,
  ) : Bool {
    var found = false;
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        {
          p with
          title = input.title;
          description = input.description;
          problemStatement = input.problemStatement;
          datasetDescription = input.datasetDescription;
          approach = input.approach;
          results = input.results;
          insights = input.insights;
          tags = input.tags;
          githubUrl = input.githubUrl;
          liveDemoUrl = input.liveDemoUrl;
          featured = input.featured;
        };
      } else { p };
    });
    found;
  };

  public func deleteProject(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
  ) : Bool {
    let before = projects.size();
    let filtered = projects.filter(func(p) { p.id != id });
    projects.clear();
    projects.append(filtered);
    projects.size() < before;
  };

  public func getProject(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
  ) : ?Types.Project {
    projects.find(func(p) { p.id == id });
  };

  public func listProjects(
    projects : List.List<Types.Project>,
  ) : [Types.Project] {
    projects.toArray();
  };

  public func listFeaturedProjects(
    projects : List.List<Types.Project>,
  ) : [Types.Project] {
    projects.filter(func(p) { p.featured }).toArray();
  };

  public func toggleFeatured(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
  ) : Bool {
    var found = false;
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with featured = not p.featured };
      } else { p };
    });
    found;
  };

  public func incrementViewCount(
    projects : List.List<Types.Project>,
    id : Common.ProjectId,
  ) : () {
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        { p with viewCount = p.viewCount + 1 };
      } else { p };
    });
  };

  // --- Testimonials ---

  public func createTestimonial(
    testimonials : List.List<Types.Testimonial>,
    nextId : Nat,
    input : Types.TestimonialInput,
  ) : (Types.Testimonial, Nat) {
    let testimonial : Types.Testimonial = {
      id = nextId;
      name = input.name;
      role = input.role;
      company = input.company;
      quote = input.quote;
      imageUrl = input.imageUrl;
      approved = input.approved;
    };
    testimonials.add(testimonial);
    (testimonial, nextId + 1);
  };

  public func updateTestimonial(
    testimonials : List.List<Types.Testimonial>,
    id : Common.TestimonialId,
    input : Types.TestimonialInput,
  ) : Bool {
    var found = false;
    testimonials.mapInPlace(func(t) {
      if (t.id == id) {
        found := true;
        {
          t with
          name = input.name;
          role = input.role;
          company = input.company;
          quote = input.quote;
          imageUrl = input.imageUrl;
          approved = input.approved;
        };
      } else { t };
    });
    found;
  };

  public func deleteTestimonial(
    testimonials : List.List<Types.Testimonial>,
    id : Common.TestimonialId,
  ) : Bool {
    let before = testimonials.size();
    let filtered = testimonials.filter(func(t) { t.id != id });
    testimonials.clear();
    testimonials.append(filtered);
    testimonials.size() < before;
  };

  public func listTestimonials(
    testimonials : List.List<Types.Testimonial>,
  ) : [Types.Testimonial] {
    testimonials.toArray();
  };

  // --- Contact Submissions ---

  public func submitContact(
    contacts : List.List<Types.ContactSubmission>,
    nextId : Nat,
    input : Types.ContactInput,
  ) : (Types.ContactSubmission, Nat) {
    let submission : Types.ContactSubmission = {
      id = nextId;
      name = input.name;
      email = input.email;
      subject = input.subject;
      message = input.message;
      createdAt = Time.now();
      read = false;
    };
    contacts.add(submission);
    (submission, nextId + 1);
  };

  public func listContacts(
    contacts : List.List<Types.ContactSubmission>,
  ) : [Types.ContactSubmission] {
    contacts.toArray();
  };

  public func deleteContact(
    contacts : List.List<Types.ContactSubmission>,
    id : Common.ContactId,
  ) : Bool {
    let before = contacts.size();
    let filtered = contacts.filter(func(c) { c.id != id });
    contacts.clear();
    contacts.append(filtered);
    contacts.size() < before;
  };

  public func markContactRead(
    contacts : List.List<Types.ContactSubmission>,
    id : Common.ContactId,
  ) : Bool {
    var found = false;
    contacts.mapInPlace(func(c) {
      if (c.id == id) {
        found := true;
        { c with read = true };
      } else { c };
    });
    found;
  };

  // --- File Metadata ---

  public func addFileMetadata(
    files : List.List<Types.FileMetadata>,
    nextId : Nat,
    input : Types.FileMetadataInput,
  ) : (Types.FileMetadata, Nat) {
    let meta : Types.FileMetadata = {
      id = nextId;
      projectId = input.projectId;
      filename = input.filename;
      fileType = input.fileType;
      fileKey = input.fileKey;
      uploadedAt = Time.now();
    };
    files.add(meta);
    (meta, nextId + 1);
  };

  public func deleteFileMetadata(
    files : List.List<Types.FileMetadata>,
    id : Common.FileId,
  ) : Bool {
    let before = files.size();
    let filtered = files.filter(func(f) { f.id != id });
    files.clear();
    files.append(filtered);
    files.size() < before;
  };

  public func getFilesByProject(
    files : List.List<Types.FileMetadata>,
    projectId : Common.ProjectId,
  ) : [Types.FileMetadata] {
    files.filter(func(f) { f.projectId == projectId }).toArray();
  };

  // --- Analytics ---

  public func getAnalytics(
    projects : List.List<Types.Project>,
    contacts : List.List<Types.ContactSubmission>,
  ) : Common.Analytics {
    let projectCount = projects.size();
    let contactCount = contacts.size();
    let featuredCount = projects.filter(func(p) { p.featured }).size();
    let totalViews = projects.foldLeft(0, func(acc : Nat, p : Types.Project) : Nat { acc + p.viewCount });
    {
      projectCount;
      contactCount;
      featuredCount;
      totalViews;
    };
  };

  // --- Seed ---

  public func seedProjects(
    projects : List.List<Types.Project>,
    nextId : Nat,
  ) : Nat {
    let now = Time.now();

    let p1 : Types.Project = {
      id = nextId;
      title = "House Price Prediction";
      description = "An end-to-end machine learning pipeline to predict house prices using regression models on real-world housing data.";
      problemStatement = "Predicting house prices accurately is a key challenge in the real estate industry. Buyers, sellers, and agents need reliable price estimates to make informed decisions.";
      datasetDescription = "The dataset contains 79 features including lot area, neighborhood, building type, year built, overall quality, and sale price for 1,460 residential homes.";
      approach = "Applied feature engineering, handled missing values, encoded categorical variables, and trained Linear Regression, Ridge, and XGBoost models. Used cross-validation to select the best model.";
      results = "XGBoost achieved RMSE of 0.117 on log-transformed prices, outperforming baseline by 34%. R² score: 0.91.";
      insights = "Neighborhood, overall quality, and total living area are the top three predictors. Renovated homes sell for ~12% more than non-renovated homes of similar characteristics.";
      tags = ["Machine Learning", "Regression", "Python", "XGBoost", "Feature Engineering"];
      githubUrl = ?"https://github.com/dswithravi/house-price-prediction";
      liveDemoUrl = null;
      featured = true;
      createdAt = now;
      viewCount = 0;
    };

    let p2 : Types.Project = {
      id = nextId + 1;
      title = "Customer Churn Analysis";
      description = "A comprehensive data analysis project to identify customers at risk of churning using behavioral and demographic data from a telecom company.";
      problemStatement = "Customer churn costs telecom companies millions annually. Identifying at-risk customers early allows targeted retention campaigns before customers leave.";
      datasetDescription = "7,043 customer records with 21 features: contract type, tenure, monthly charges, internet service, payment method, and churn label from a telecom provider.";
      approach = "Conducted EDA to identify churn patterns, engineered features like customer lifetime value, and trained Logistic Regression and Random Forest classifiers. Applied SMOTE for class imbalance.";
      results = "Random Forest achieved 82% accuracy and 0.85 AUC-ROC. Precision: 0.78, Recall: 0.79 for churn class.";
      insights = "Month-to-month contract customers churn 3x more than annual contract customers. High monthly charges above $65 correlate strongly with churn within the first 12 months.";
      tags = ["Data Analysis", "Classification", "Python", "Pandas", "Scikit-learn"];
      githubUrl = ?"https://github.com/dswithravi/customer-churn-analysis";
      liveDemoUrl = null;
      featured = true;
      createdAt = now;
      viewCount = 0;
    };

    let p3 : Types.Project = {
      id = nextId + 2;
      title = "Twitter Sentiment Analysis";
      description = "NLP pipeline to classify tweet sentiment (positive, negative, neutral) in real-time using transformer-based models and topic modeling.";
      problemStatement = "Understanding public sentiment on social media is critical for brand management, crisis detection, and market research. Manual monitoring of millions of tweets is impractical.";
      datasetDescription = "1.6 million tweets from the Sentiment140 dataset, labeled positive/negative. Additional 10,000 manually labeled neutral tweets added for 3-class classification.";
      approach = "Preprocessed tweets (tokenization, stopword removal, hashtag normalization), fine-tuned a DistilBERT model on the dataset, and applied LDA for topic modeling on negative sentiment clusters.";
      results = "DistilBERT achieved 91.3% accuracy on the test set. F1-score: 0.90 macro-average. Processing speed: ~2,000 tweets/second on inference.";
      insights = "Negative sentiment spikes correlate with product outages and PR events. 73% of complaints contain actionable keywords that can be routed to support automatically.";
      tags = ["NLP", "Sentiment Analysis", "Python", "Transformers", "BERT"];
      githubUrl = ?"https://github.com/dswithravi/twitter-sentiment-analysis";
      liveDemoUrl = null;
      featured = true;
      createdAt = now;
      viewCount = 0;
    };

    projects.add(p1);
    projects.add(p2);
    projects.add(p3);

    nextId + 3;
  };
};
