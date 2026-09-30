'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User, Resource, Booking, MaintenanceIssue, AuditLog, Opportunity, OpportunityRecommendation, StudentProject, BookingStatus, IssueStatus } from '@/types';
import { DEMO_USERS, MOCK_RESOURCES, INITIAL_BOOKINGS, INITIAL_ISSUES, MOCK_OPPORTUNITIES, STUDENT_PROJECTS_LIST, INITIAL_PROGRESS, INITIAL_AUDIT_LOGS } from '@/lib/mockData';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  initAnalytics,
  type FirebaseUser
} from '@/lib/firebase';

interface SmartMatchResult {
  resource: Resource;
  matchScore: number;
  reasons: string[];
  isAvailable: boolean;
  conflictReason?: string;
}

interface BookingRequestInput {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: 'Class' | 'Project' | 'Research' | 'Hackathon' | 'Other';
  additionalItems?: string[];
  numberOfStudents?: number;
}

interface BookingEngineResult {
  success: boolean;
  booking?: Booking;
  error?: string;
  alternatives?: Resource[];
}

interface ResoraContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  resources: Resource[];
  bookings: Booking[];
  issues: MaintenanceIssue[];
  auditLogs: AuditLog[];
  opportunities: Opportunity[];
  projects: StudentProject[];
  progress: typeof INITIAL_PROGRESS;
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
  
  // Firebase Auth State & Actions
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  loginWithEmail: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    extra?: { rollNumber?: string; department?: string; academicYear?: number; title?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;

  // Actions
  createBooking: (input: BookingRequestInput) => BookingEngineResult;
  approveBooking: (bookingId: string, notes?: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  requestChangesBooking: (bookingId: string, commentNote: string) => void;
  checkInBooking: (bookingCode: string) => { success: boolean; message: string; booking?: Booking };
  toggleMaintenance: (resourceId: string, reason?: string) => void;
  resolveIssue: (issueId: string) => void;
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (resourceId: string, updates: Partial<Resource>) => void;
  enableResourceSharing: (resourceId: string, targetDepartments: string[]) => void;
  toggleSaveOpportunity: (oppId: string) => void;
  applyToOpportunity: (oppId: string) => void;
  addOpportunity: (oppData: Omit<Opportunity, 'id'>) => void;
  updateOpportunity: (oppId: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (oppId: string) => void;
  recommendOpportunity: (oppId: string, customMessage?: string) => { success: boolean; message: string };
  removeRecommendation: (oppId: string) => void;
  updateRecommendationMessage: (oppId: string, newMessage: string) => void;
  addProject: (projectData: Omit<StudentProject, 'id'>) => void;
  deleteProject: (projectId: string) => void;
  parseSmartQuery: (queryText: string) => {
    extractedRequirements: { people: number; durationHours: number; wifi: boolean; arduino: boolean; projector: boolean };
    matches: SmartMatchResult[];
  };
}

const ResoraContext = createContext<ResoraContextType | undefined>(undefined);

const STORAGE_KEY = 'resora_campus_mvp_state_v3';

export const ResoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.STUDENT);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [issues, setIssues] = useState<MaintenanceIssue[]>(INITIAL_ISSUES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [projects, setProjects] = useState<StudentProject[]>(STUDENT_PROJECTS_LIST);
  const [progress] = useState(INITIAL_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Booking Approved',
      message: 'Your request for Innovation Lab today 2 PM - 6 PM is approved!',
      date: '10 mins ago',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Hackathon Deadline',
      message: 'Smart India Hackathon registrations close in 3 days.',
      date: '2 hours ago',
      read: true,
    },
  ]);

  // Format friendly error messages from Firebase error codes
  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This campus account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your credentials or create an account.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify and try again.';
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Access temporarily disabled. Please try again later.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  // Firebase Auth State Observer
  useEffect(() => {
    initAnalytics();

    const unsubscribe = onAuthStateChanged(auth, (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const stored = localStorage.getItem(`resora_user_${fUser.uid}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setCurrentUser(parsed);
            if (parsed.role) setCurrentRole(parsed.role);
          } else {
            const newProfile: User = {
              id: fUser.uid,
              name: fUser.displayName || fUser.email?.split('@')[0] || 'Campus Member',
              email: fUser.email || '',
              role: 'STUDENT',
              avatar: fUser.photoURL || DEMO_USERS.STUDENT.avatar,
              department: 'Computer Science & Engineering',
              rollNumber: '21CS104',
              academicYear: 3,
              academicYearLabel: '3rd Year',
            };
            setCurrentUser(newProfile);
            setCurrentRole('STUDENT');
            localStorage.setItem(`resora_user_${fUser.uid}`, JSON.stringify(newProfile));
          }
        } catch (e) {
          console.error('Error synchronizing Firebase user profile:', e);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.issues) setIssues(parsed.issues);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
        if (parsed.opportunities && Array.isArray(parsed.opportunities)) {
          const sanitized = parsed.opportunities.map((storedOpp: Opportunity) => {
            const mock = MOCK_OPPORTUNITIES.find(m => m.id === storedOpp.id);
            if (mock) {
              return {
                ...storedOpp,
                applicationUrl: mock.applicationUrl,
                officialWebsiteUrl: mock.officialWebsiteUrl,
              };
            }
            return storedOpp;
          });
          setOpportunities(sanitized);
        }
      }
    } catch (e) {
      console.error('Failed to load state from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist state to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          resources,
          bookings,
          issues,
          auditLogs,
          opportunities,
          projects,
        })
      );
    } catch (e) {
      console.error('Failed to save state to storage', e);
    }
  }, [resources, bookings, issues, auditLogs, opportunities, isLoaded]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    if (!firebaseUser) {
      setCurrentUser(DEMO_USERS[role]);
    } else {
      setCurrentUser(prev => {
        const updated = {
          ...prev,
          role,
          avatar: prev.avatar || DEMO_USERS[role]?.avatar,
          department: prev.department || (role === 'ADMIN' ? 'Dean Office / Operations' : 'Computer Science & Engineering'),
          title: role === 'FACULTY' ? (prev.title || 'Associate Professor') : role === 'ADMIN' ? (prev.title || 'Campus Administrator') : undefined,
          rollNumber: role === 'STUDENT' ? (prev.rollNumber || '21CS104') : undefined,
          academicYear: role === 'STUDENT' ? (prev.academicYear || 3) : undefined,
          academicYearLabel: role === 'STUDENT' ? (prev.academicYearLabel || '3rd Year') : undefined,
        };
        try {
          localStorage.setItem(`resora_user_${firebaseUser.uid}`, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  };

  const loginWithEmail = async (email: string, pass: string, role?: UserRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fUser = userCredential.user;
      const targetRole = role || currentRole;

      let profile: User;
      const stored = localStorage.getItem(`resora_user_${fUser.uid}`);
      if (stored) {
        profile = JSON.parse(stored);
        if (role) profile.role = role;
      } else {
        profile = {
          id: fUser.uid,
          name: fUser.displayName || email.split('@')[0],
          email: fUser.email || email,
          role: targetRole,
          avatar: fUser.photoURL || DEMO_USERS[targetRole]?.avatar,
          department: targetRole === 'ADMIN' ? 'Dean Office / Operations' : 'Computer Science & Engineering',
          rollNumber: targetRole === 'STUDENT' ? '21CS104' : undefined,
          academicYear: targetRole === 'STUDENT' ? 3 : undefined,
          academicYearLabel: targetRole === 'STUDENT' ? '3rd Year' : undefined,
          title: targetRole === 'FACULTY' ? 'Associate Professor' : targetRole === 'ADMIN' ? 'Campus Admin' : undefined,
        };
      }
      setCurrentRole(profile.role);
      setCurrentUser(profile);
      localStorage.setItem(`resora_user_${fUser.uid}`, JSON.stringify(profile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    extra?: { rollNumber?: string; department?: string; academicYear?: number; title?: string }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fUser = userCredential.user;

      await updateProfile(fUser, { displayName: name });

      const newProfile: User = {
        id: fUser.uid,
        name: name,
        email: email,
        role: role,
        avatar: DEMO_USERS[role]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        department: extra?.department || (role === 'ADMIN' ? 'Dean Office / Operations' : 'Computer Science & Engineering'),
        rollNumber: extra?.rollNumber || (role === 'STUDENT' ? '24CS' + Math.floor(100 + Math.random() * 900) : undefined),
        academicYear: extra?.academicYear || (role === 'STUDENT' ? 1 : undefined),
        academicYearLabel: role === 'STUDENT' ? (extra?.academicYear ? `${extra.academicYear}th Year` : '1st Year') : undefined,
        title: extra?.title || (role === 'FACULTY' ? 'Assistant Professor' : role === 'ADMIN' ? 'Campus Administrator' : undefined),
      };

      setCurrentRole(role);
      setCurrentUser(newProfile);
      localStorage.setItem(`resora_user_${fUser.uid}`, JSON.stringify(newProfile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  const loginWithGoogle = async (role?: UserRole) => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fUser = userCredential.user;
      const targetRole = role || currentRole;

      let profile: User;
      const stored = localStorage.getItem(`resora_user_${fUser.uid}`);
      if (stored) {
        profile = JSON.parse(stored);
        if (role) profile.role = role;
      } else {
        profile = {
          id: fUser.uid,
          name: fUser.displayName || 'Google User',
          email: fUser.email || '',
          role: targetRole,
          avatar: fUser.photoURL || DEMO_USERS[targetRole]?.avatar,
          department: targetRole === 'ADMIN' ? 'Dean Office / Operations' : 'Computer Science & Engineering',
          rollNumber: targetRole === 'STUDENT' ? '23CS' + Math.floor(100 + Math.random() * 900) : undefined,
          academicYear: targetRole === 'STUDENT' ? 2 : undefined,
          academicYearLabel: targetRole === 'STUDENT' ? '2nd Year' : undefined,
          title: targetRole === 'FACULTY' ? 'Faculty Member' : targetRole === 'ADMIN' ? 'Campus Administrator' : undefined,
        };
      }
      setCurrentRole(profile.role);
      setCurrentUser(profile);
      localStorage.setItem(`resora_user_${fUser.uid}`, JSON.stringify(profile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Error during Firebase sign out:', e);
    }
    setFirebaseUser(null);
    setCurrentUser(DEMO_USERS.STUDENT);
    setCurrentRole('STUDENT');
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  // Helper to log audit actions
  const logAudit = (action: string, resource: string, status: string, details?: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
      role: currentUser.role,
      action,
      resource,
      status,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Deterministic Booking Engine with Dependency Graph Verification
  const createBooking = (input: BookingRequestInput): BookingEngineResult => {
    const targetResource = resources.find(r => r.id === input.resourceId);

    if (!targetResource) {
      return { success: false, error: 'Resource not found in campus database.' };
    }

    // 1. Maintenance Check
    if (targetResource.status === 'MAINTENANCE') {
      return {
        success: false,
        error: `${targetResource.name} is currently under maintenance and cannot be reserved.`,
        alternatives: resources.filter(r => r.type === targetResource.type && r.status === 'AVAILABLE' && r.id !== targetResource.id),
      };
    }

    // 2. Capacity Check
    if (input.numberOfStudents && input.numberOfStudents > targetResource.capacity) {
      return {
        success: false,
        error: `Requested capacity (${input.numberOfStudents}) exceeds ${targetResource.name} limit of ${targetResource.capacity}.`,
      };
    }

    // 3. Time Conflict & Overlap Check
    const overlapping = bookings.find(b => {
      if (b.resourceId !== input.resourceId) return false;
      if (b.date !== input.date) return false;
      if (['REJECTED', 'CANCELLED', 'NO_SHOW'].includes(b.status)) return false;

      // Check time overlap: (StartA < EndB) AND (EndA > StartB)
      return input.startTime < b.endTime && input.endTime > b.startTime;
    });

    if (overlapping) {
      const alternatives = resources.filter(
        r => r.type === targetResource.type && r.id !== targetResource.id && r.status === 'AVAILABLE'
      );
      return {
        success: false,
        error: `Resource unavailable for this time window. Overlaps with an existing reservation (${overlapping.startTime} - ${overlapping.endTime}).`,
        alternatives,
      };
    }

    // 4. Dependency Check
    if (targetResource.requiredDependencies && targetResource.requiredDependencies.length > 0) {
      for (const depName of targetResource.requiredDependencies) {
        const depRes = resources.find(r => r.name.toLowerCase().includes(depName.toLowerCase()));
        if (depRes && depRes.status === 'MAINTENANCE') {
          const alternatives = resources.filter(r => r.type === targetResource.type && r.status === 'AVAILABLE' && r.id !== targetResource.id);
          return {
            success: false,
            error: `Required dependency item "${depRes.name}" is currently under maintenance.`,
            alternatives,
          };
        }
      }
    }

    // Success! Generate Booking
    const bookingCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      bookingCode,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      resourceId: targetResource.id,
      resourceName: targetResource.name,
      resourceType: targetResource.type,
      location: `${targetResource.building} · ${targetResource.floor}`,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      purpose: input.purpose,
      status: currentUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
      additionalItems: input.additionalItems,
      qrCodeUrl: `${bookingCode}-${currentUser.role}-${targetResource.name.replace(/\s+/g, '-').toUpperCase()}`,
      approvalStep: currentUser.role === 'ADMIN' ? 'Approved' : 'Faculty',
    };

    setBookings(prev => [newBooking, ...prev]);

    logAudit(
      `Requested Booking #${bookingCode}`,
      targetResource.name,
      currentUser.role === 'ADMIN' ? 'Approved' : 'Pending',
      `Date: ${input.date}, Time: ${input.startTime}-${input.endTime}`
    );

    return { success: true, booking: newBooking };
  };

  const approveBooking = (bookingId: string, notes?: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit(`Approved Booking #${b.bookingCode}`, b.resourceName, 'Approved', notes || 'Approved by faculty');
          
          setNotifications(n => [
            {
              id: `notif_${Date.now()}`,
              title: 'Booking Approved ✓',
              message: `Your booking #${b.bookingCode} for ${b.resourceName} has been approved!`,
              date: 'Just now',
              read: false,
            },
            ...n,
          ]);

          return { ...b, status: 'APPROVED' as BookingStatus, approvalStep: 'Approved' };
        }
        return b;
      })
    );
  };

  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit(`Rejected Booking #${b.bookingCode}`, b.resourceName, 'Rejected', reason || 'Slot conflict');
          return { ...b, status: 'REJECTED' as BookingStatus, rejectionReason: reason || 'Not approved by department.' };
        }
        return b;
      })
    );
  };

  const requestChangesBooking = (bookingId: string, commentNote: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          logAudit(`Requested Changes for #${b.bookingCode}`, b.resourceName, 'Changes Requested', commentNote);
          return { ...b, status: 'CHANGES_REQUESTED' as BookingStatus, requestChangesNote: commentNote };
        }
        return b;
      })
    );
  };

  const checkInBooking = (bookingCode: string) => {
    const cleanCode = bookingCode.trim().toUpperCase();
    const booking = bookings.find(b => b.bookingCode.toUpperCase() === cleanCode || b.qrCodeUrl?.includes(cleanCode));

    if (!booking) {
      return { success: false, message: 'Invalid or unknown QR Booking Pass Code.' };
    }

    if (booking.status === 'CHECKED_IN') {
      return { success: true, message: `User already checked in for ${booking.resourceName}. Access Pass active!`, booking };
    }

    if (booking.status !== 'APPROVED') {
      return { success: false, message: `Booking status is currently "${booking.status}". Only APPROVED bookings can check in.` };
    }

    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBookings(prev =>
      prev.map(b => (b.id === booking.id ? { ...b, checkedInAt: checkInTime, status: 'CHECKED_IN' as BookingStatus } : b))
    );

    setResources(prev =>
      prev.map(r => (r.id === booking.resourceId ? { ...r, status: 'IN_USE' } : r))
    );

    logAudit(`Checked in via QR Scanner`, booking.resourceName, 'Checked-In', `Booking #${booking.bookingCode} by ${booking.userName}`);

    return {
      success: true,
      message: `Check-in Verified! ${booking.userName} checked into ${booking.resourceName} successfully.`,
      booking,
    };
  };

  const toggleMaintenance = (resourceId: string, reason?: string) => {
    setResources(prev =>
      prev.map(r => {
        if (r.id === resourceId) {
          const newStatus = r.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
          logAudit(
            newStatus === 'MAINTENANCE' ? `Placed under maintenance` : `Restored to service`,
            r.name,
            newStatus,
            reason || 'Routine inspection'
          );

          if (newStatus === 'MAINTENANCE') {
            setIssues(iss => [
              {
                id: `iss_${Date.now()}`,
                resourceId: r.id,
                resourceName: r.name,
                resourceType: r.type,
                reportedBy: currentUser.name,
                issueDescription: reason || 'System maintenance & hardware repair',
                priority: 'HIGH',
                status: 'IN_REPAIR',
                reportedDate: new Date().toISOString().split('T')[0],
              },
              ...iss,
            ]);
          }

          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  const resolveIssue = (issueId: string) => {
    setIssues(prev =>
      prev.map(i => {
        if (i.id === issueId) {
          setResources(res => res.map(r => r.id === i.resourceId ? { ...r, status: 'AVAILABLE' } : r));
          logAudit(`Issue resolved`, i.resourceName, 'Resolved', `Repaired issue: ${i.issueDescription}`);
          return { ...i, status: 'RESOLVED' as IssueStatus };
        }
        return i;
      })
    );
  };

  const addResource = (newResInput: Omit<Resource, 'id'>) => {
    const newRes: Resource = {
      ...newResInput,
      id: `res_${Date.now()}`,
      resourceCode: newResInput.resourceCode || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setResources(prev => [newRes, ...prev]);
    logAudit('Created new campus resource', newRes.name, 'Available', `Location: ${newRes.building}`);
  };

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    setResources(prev =>
      prev.map(r => {
        if (r.id === resourceId) {
          logAudit('Updated resource configuration', r.name, 'Updated', `Fields updated: ${Object.keys(updates).join(', ')}`);
          return { ...r, ...updates };
        }
        return r;
      })
    );
  };

  const enableResourceSharing = (resourceId: string, targetDepartments: string[]) => {
    setResources(prev =>
      prev.map(r => {
        if (r.id === resourceId) {
          logAudit('Enabled cross-department sharing', r.name, 'Shared', `Shared with: ${targetDepartments.join(', ')}`);
          return { ...r, isShared: true, sharedWith: targetDepartments };
        }
        return r;
      })
    );
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setOpportunities(prev =>
      prev.map(o => (o.id === oppId ? { ...o, saved: !o.saved } : o))
    );
  };

  const applyToOpportunity = (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    setOpportunities(prev =>
      prev.map(o => (o.id === oppId ? { ...o, applied: true } : o))
    );
    logAudit(
      'APPLICATION_LINK_OPENED',
      opp?.title || oppId,
      'Opened Link',
      `Student ${currentUser.name} (${currentUser.id}) opened application link for ${opp?.type || 'opportunity'}: ${opp?.applicationUrl || 'External Link'}`
    );
  };

  const addOpportunity = (oppData: Omit<Opportunity, 'id'>) => {
    const newOpp: Opportunity = {
      ...oppData,
      id: `opp_${Date.now()}`,
      saved: false,
      applied: false,
      createdAt: new Date().toISOString(),
    };
    setOpportunities(prev => [newOpp, ...prev]);
    logAudit('Created Opportunity', newOpp.title, 'Published', `Created ${newOpp.type}: ${newOpp.title}`);
  };

  const updateOpportunity = (oppId: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev =>
      prev.map(o => (o.id === oppId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o))
    );
    logAudit('Updated Opportunity', oppId, 'Updated', `Updated opportunity ${oppId}`);
  };

  const deleteOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== oppId));
    logAudit('Deleted Opportunity', oppId, 'Deleted', `Deleted opportunity ${oppId}`);
  };

  const recommendOpportunity = (oppId: string, customMessage?: string): { success: boolean; message: string } => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return { success: false, message: 'Opportunity not found.' };

    const targetYear = currentUser.teachingYear || currentUser.academicYear || 3;
    const yearLabel = `${targetYear}${targetYear === 1 ? 'st' : targetYear === 2 ? 'nd' : targetYear === 3 ? 'rd' : 'th'} Year`;

    // Duplicate Prevention Check (Requirement #13)
    const existingRecs = opp.recommendations || [];
    const alreadyRecommended = existingRecs.some(
      r => r.facultyId === currentUser.id && r.targetYear === targetYear && r.isActive
    );

    if (alreadyRecommended) {
      return { success: false, message: `Already recommended to ${yearLabel} students.` };
    }

    const newRecommendation: OpportunityRecommendation = {
      id: `rec_${Date.now()}`,
      opportunityId: oppId,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      targetYear,
      targetYearLabel: `${yearLabel} Students`,
      message: customMessage || `Recommended for students interested in emerging technologies and career growth.`,
      recommendedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: true,
    };

    setOpportunities(prev =>
      prev.map(o => {
        if (o.id === oppId) {
          const updatedRecs = [...(o.recommendations || []), newRecommendation];
          return {
            ...o,
            visibility: 'RECOMMENDED',
            recommendations: updatedRecs,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    // Notification for all students in target academic year (Requirement #14 & #15)
    setNotifications(n => [
      {
        id: `notif_${Date.now()}`,
        title: '🎯 New Opportunity Recommended',
        message: `${currentUser.name} recommended "${opp.title}" for ${yearLabel} students.`,
        date: 'Just now',
        read: false,
      },
      ...n,
    ]);

    logAudit(
      'RECOMMEND_OPPORTUNITY',
      opp.title,
      'Recommended',
      `Faculty ${currentUser.name} recommended opportunity to ${yearLabel} students`
    );

    return { success: true, message: `Recommended to all ${yearLabel} students.` };
  };

  const removeRecommendation = (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    setOpportunities(prev =>
      prev.map(o => {
        if (o.id === oppId) {
          const remainingRecs = (o.recommendations || []).filter(r => r.facultyId !== currentUser.id);
          const nextVisibility = remainingRecs.length > 0 ? 'RECOMMENDED' : 'FACULTY_ONLY';
          return {
            ...o,
            visibility: nextVisibility,
            recommendations: remainingRecs,
          };
        }
        return o;
      })
    );
    if (opp) {
      logAudit('REMOVE_RECOMMENDATION', opp.title, 'Removed', `Faculty ${currentUser.name} removed recommendation`);
    }
  };

  const updateRecommendationMessage = (oppId: string, newMessage: string) => {
    setOpportunities(prev =>
      prev.map(o => {
        if (o.id === oppId) {
          const updatedRecs = (o.recommendations || []).map(r => {
            if (r.facultyId === currentUser.id) {
              return { ...r, message: newMessage };
            }
            return r;
          });
          return { ...o, recommendations: updatedRecs };
        }
        return o;
      })
    );
  };

  const addProject = (projectData: Omit<StudentProject, 'id'>) => {
    const newProject: StudentProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);
    logAudit('Created Student Project', newProject.title, 'Active', `Mentor: ${newProject.mentor}`);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    logAudit('Deleted Student Project', projectId, 'Deleted');
  };

  // AI Smart Resource Finder NLP Engine (Requirement #7)
  const parseSmartQuery = (queryText: string) => {
    const text = queryText.toLowerCase();

    // Extract people count
    let people = 8;
    const peopleMatch = text.match(/(\d+)\s*(students|people|members|users|seats)/);
    if (peopleMatch) people = parseInt(peopleMatch[1], 10);

    // Extract duration
    let durationHours = 4;
    const durMatch = text.match(/(\d+)\s*(hours|hrs|hr)/);
    if (durMatch) durationHours = parseInt(durMatch[1], 10);

    // Extract feature flags
    const wifi = text.includes('wi-fi') || text.includes('wifi') || text.includes('internet');
    const arduino = text.includes('arduino') || text.includes('microcontroller') || text.includes('kit');
    const projector = text.includes('projector') || text.includes('screen') || text.includes('display');

    const extractedRequirements = { people, durationHours, wifi, arduino, projector };

    // Match algorithm over resources
    const matches: SmartMatchResult[] = resources.map(res => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Capacity match
      if (res.capacity >= people) {
        score += 25;
        reasons.push(`Capacity of ${res.capacity} comfortably accommodates ${people} people.`);
      } else {
        score -= 20;
        reasons.push(`Capacity of ${res.capacity} is less than ${people} requested.`);
      }

      // Feature matching
      const hasWifi = res.features.some(f => f.toLowerCase().includes('wi-fi') || f.toLowerCase().includes('wifi'));
      const hasArduino = res.features.some(f => f.toLowerCase().includes('arduino') || f.toLowerCase().includes('raspberry'));
      const hasProjector = res.features.some(f => f.toLowerCase().includes('projector'));

      if (wifi && hasWifi) {
        score += 15;
        reasons.push('High-speed Wi-Fi network available.');
      }
      if (arduino && hasArduino) {
        score += 15;
        reasons.push('Equipped with Arduino & IoT hardware prototyping kits.');
      }
      if (projector && hasProjector) {
        score += 15;
        reasons.push('Features 4K Projector & presentation screen.');
      }

      if (res.status === 'MAINTENANCE') {
        score = 0;
        reasons.push('Currently UNDER MAINTENANCE - unavailable for booking.');
      }

      const isAvailable = res.status === 'AVAILABLE';

      return {
        resource: res,
        matchScore: Math.min(Math.max(score, 10), 98),
        reasons,
        isAvailable,
        conflictReason: res.status === 'MAINTENANCE' ? 'Under Repair' : undefined,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return { extractedRequirements, matches };
  };

  return (
    <ResoraContext.Provider
      value={{
        currentUser,
        setRole,
        firebaseUser,
        authLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        resources,
        bookings,
        issues,
        auditLogs,
        opportunities,
        projects,
        progress,
        notifications,
        createBooking,
        approveBooking,
        rejectBooking,
        requestChangesBooking,
        checkInBooking,
        toggleMaintenance,
        resolveIssue,
        addResource,
        updateResource,
        enableResourceSharing,
        toggleSaveOpportunity,
        applyToOpportunity,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        recommendOpportunity,
        removeRecommendation,
        updateRecommendationMessage,
        addProject,
        deleteProject,
        parseSmartQuery,
      }}
    >
      {children}
    </ResoraContext.Provider>
  );
};

export const useResora = () => {
  const context = useContext(ResoraContext);
  if (!context) {
    throw new Error('useResora must be used within a ResoraProvider');
  }
  return context;
};
