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

export interface RegisterVoteRequest {
  option: number; // 0 = Yes, 1 = No, 2 = Abstain
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
