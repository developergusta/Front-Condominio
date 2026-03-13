export interface CondominiumResponse {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface CreateCondominiumRequest {
  name: string;
  address: string;
}

export interface ResidentResponse {
  id: string;
  name: string;
  email: string;
  apartmentNumber: string;
  condominiumId: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AdminResidentResponse extends ResidentResponse {
  isBanned: boolean;
}

export interface UpdateResidentRequest {
  name: string;
  apartmentNumber: string;
}

export interface AuthResponse {
  token: string;
  residentId: string;
  name: string;
  condominiumId: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

// Updating to match standard Register flow
export interface CreateResidentRequest {
  name: string;
  email: string;
  password?: string;
  apartmentNumber: string;
  condominiumId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VoteTopicResponse {
  id: string;
  title: string;
  description: string;
  condominiumId: string;
  createdByResidentId: string;
  votingStart: string;
  votingEnd: string;
  status: 'Open' | 'Closed';
  createdAt: string;
}

export interface CreateVoteTopicRequest {
  title: string;
  description: string;
  votingStart: string;
  votingEnd: string;
}

export interface VotingResultResponse {
  topicId: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  status: 'Open' | 'Closed';
}

export interface VoteResponse {
  id: string;
  topicId: string;
  residentId: string;
  option: 'Yes' | 'No' | 'Abstain';
  createdAt: string;
}

export enum VoteOption {
  Yes = 0,
  No = 1,
  Abstain = 2,
}

export interface RegisterVoteRequest {
  option: VoteOption;
  justification?: string;
}

export interface HasVotedResponse {
  hasVoted: boolean;
  currentVote?: 'Yes' | 'No' | 'Abstain' | null;
}

export interface CondominiumDashboardResponse {
  totalResidents: number;
  openTopics: number;
  closedTopics: number;
}

export interface TopicReportResponse {
  topicId: string;
  title: string;
  description: string;
  votingStart: string;
  votingEnd: string;
  status: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

export interface TopicVoteDetailResponse {
  id: string;
  residentName: string;
  residentApartment: string;
  option: 'Yes' | 'No' | 'Abstain';
  justification?: string;
  createdAt: string;
}
