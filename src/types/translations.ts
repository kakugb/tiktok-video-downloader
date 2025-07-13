export interface CommonTranslations {
  heroSection: {
    title: string;
    description: string;
    inputPlaceholder: string;
    pasteButton: string;
    downloadButton: string;
  };
  appDownloadSection: {
    title: string;
    description: string;
  };
  introductionSection: {
    title: string;
    paragraphs: string[];
  };
  howToDownloadSection: {
    title: string;
    description: string;
    steps: { title: string; description: string; image: string }[];
  };
  whyNeedDownloaderSection: {
    title: string;
    paragraphs: string[];
  };
  downloadOnAndroidSection: {
    title: string;
    description: string;
    steps: string[];
  };
  downloadOnPCSection: {
    title: string;
    description: string;
  };
  downloadOnIOSSection: {
    title: string;
    paragraphs: string[];
    steps: string[];
  };
  downloadMP3Section: {
    title: string;
    paragraphs: string[];
    steps: string[];
  };
  prosAndConsSection: {
    title: string;
    pros: {
      title: string;
      items: string[];
    };
    cons: {
      title: string;
      items: string[];
    };
  };
  comparisonSection: {
    title: string;
    paragraphs: string[];
    benefits: string[];
  };
  userReviewsSection: {
    title: string;
    reviews: { name: string; flag: string; stars: string; comment: string }[];
  };
  otherContentSection: {
    title: string;
    photoSlideshow: {
      title: string;
      paragraphs: string[];
    };
    stories: {
      title: string;
      paragraphs: string[];
    };
  };
  responsibleUseSection: {
    title: string;
    paragraphs: string[];
    tips: { title: string; description: string }[];
  };
  faqSection: {
    title: string;
    note: string;
    questions: string[];
    answers: string[];
  };
  general: {
    saveTiktokVideo: string;
    tiktokMp3: string;
    appName: string;
    home: string;
    contactUs: string;
    termsOfUse: string;
    privacyPolicy: string;
    footerText: string;
    welcome: string;
    homeDescription: string;
    note: string;
  };
}