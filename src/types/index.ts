export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ResourceStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'IN_USE';

export type BookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CHANGES_REQUESTED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CHECKED_IN';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'OPEN' | 'IN_REPAIR' | 'SCHEDULED' | 'RESOLVED';

export type OpportunityType = 'HACKATHON' | 'INTERNSHIP' | 'COMPETITION' | 'WORKSHOP' | 'SCHOLARSHIP' | 'RESEARCH';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  rollNumber?: string;
  department: string;
  title?: string;
  academicYear?: number;     // e.g. 3 for 3rd Year
  teachingYear?: number;     // e.g. 3 for 3rd Year
  academicYearLabel?: string; // "3rd Year"
}

export interface ResourceFeature {
  id: string;
  feature: string;
}

export interface ResourceBookingRules {
  maxDurationHours?: number;
  advanceNoticeHours?: number;
  cancellationDeadlineHours?: number;
  gracePeriodMinutes?: number;
  approvalRequired?: boolean;
}

export interface Resource {
  id: string;
  resourceCode?: string;
  name: string;
  type: 'Lab' | 'Room' | 'Equipment' | 'Facility' | 'Bundle';
  building: string;
  floor: string;
  roomNumber?: string;
  campusZone?: string;
  capacity: number;
  minCapacity?: number;
  status: ResourceStatus;
  department: string;
  manager?: string;
  imageUrl: string;
  features: string[];
  requiredDependencies?: string[]; // e.g. ["Projector #04", "Arduino Kits"]
  isShared?: boolean;
  sharedWith?: string[];
  operatingHours?: string;
  description?: string;
  bookingRules?: ResourceBookingRules;
  allowedRoles?: UserRole[];
  maintenanceFrequencyDays?: number;
  nextMaintenanceDate?: string;
  bundleItemIds?: string[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: 'Class' | 'Project' | 'Research' | 'Hackathon' | 'Other';
  status: BookingStatus;
  requestedAt: string;
  additionalItems?: string[];
  qrCodeUrl?: string;
  checkedInAt?: string;
  rejectionReason?: string;
  requestChangesNote?: string;
  approvalStep?: 'Faculty' | 'Admin' | 'Approved';
  bundleResourceIds?: string[];
}

export interface WaitlistEntry {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  position: number;
  createdAt: string;
}

export interface MaintenanceIssue {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  reportedBy: string;
  issueDescription: string;
  priority: Priority;
  status: IssueStatus;
  reportedDate: string;
  scheduledDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  resource: string;
  status: string;
  details?: string;
}

export type OpportunityRegistrationStatus = 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'UPCOMING' | 'DRAFT';

export interface OpportunityTimelinePhase {
  phase: string;
  date: string;
  description: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  organizer?: string;
  logoUrl?: string;
  type: OpportunityType;
  category?: string;
  
  // Descriptions
  shortDescription?: string;
  description: string;
  fullDescription?: string;
  
  // Mode & Location
  mode?: string;
  workMode?: string;
  location?: string;
  
  // Dates & Deadlines
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationDeadline?: string;
  applicationDeadline?: string;
  deadline: string;
  submissionDeadline?: string;
  presentationDate?: string;
  resultsDate?: string;
  
  // Hackathon Specific
  teamMinSize?: number;
  teamMaxSize?: number;
  teamSize?: string;
  themes?: string[];
  problemStatements?: string[];
  tracks?: string[];
  prizePool?: string;
  stipendOrPrize?: string;
  judgingCriteria?: string[];
  timeline?: OpportunityTimelinePhase[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  sponsors?: string[];
  mentors?: string[];
  numberOfRounds?: number;
  
  // Internship Specific
  role?: string;
  domain?: string;
  domains?: string[];
  duration?: string;
  stipend?: string;
  currency?: string;
  employmentType?: string;
  experienceRequired?: string;
  selectionProcess?: string[];
  responsibilities?: string[];
  learningOutcomes?: string[];
  certificateAvailable?: boolean;
  certificates?: boolean;
  weeklyHours?: string;
  vacancies?: number;
  mentorProvided?: boolean;
  conversionOpportunity?: boolean;
  applicationInstructions?: string;
  
  // Requirements & Skills
  eligibility?: string;
  eligibleDegrees?: string[];
  eligibleYears?: string[];
  eligibleDepartments?: string[];
  skillsRequired?: string[];
  preferredSkills?: string[];
  technologies?: string[];
  
  // URL Safety & Verification (Critical)
  officialWebsiteUrl?: string;
  applicationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  source?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  registrationStatus?: OpportunityRegistrationStatus;
  
  // State
  saved?: boolean;
  applied?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Visibility & Faculty Recommendations (Section 8 & 9)
  visibility?: 'PUBLIC' | 'FACULTY_ONLY' | 'RECOMMENDED';
  recommendations?: OpportunityRecommendation[];
  
  tags: string[];
}

export interface OpportunityRecommendation {
  id: string;
  opportunityId: string;
  facultyId: string;
  facultyName: string;
  targetYear: number;        // e.g. 3 for 3rd Year
  targetYearLabel: string;   // e.g. "3rd Year"
  message?: string;
  recommendedAt: string;
  isActive: boolean;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  progress: number;
  mentor: string;
  teamMembers: string[];
  requiredResources: string[];
  bookedResourceIds: string[];
  milestones: { title: string; completed: boolean }[];
  status: 'In Progress' | 'Planning' | 'Completed';
}

export interface StudentProgress {
  overallReadiness: number;
  dsaScore: number;
  aptitudeScore: number;
  csFundamentalsScore: number;
  projectsScore: number;
  communicationScore: number;
}
