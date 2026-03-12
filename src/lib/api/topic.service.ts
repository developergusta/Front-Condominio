import { fetchApi } from './client';
import { 
  CreateVoteTopicRequest, 
  RegisterVoteRequest, 
  VoteResponse, 
  VoteTopicResponse, 
  VotingResultResponse,
  HasVotedResponse,
  TopicReportResponse,
  TopicVoteDetailResponse
} from '@/types';

export const topicService = {
  create: (data: CreateVoteTopicRequest) => 
    fetchApi<VoteTopicResponse>('/topics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => 
    fetchApi<VoteTopicResponse[]>('/topics'),

  getById: (id: string) => 
    fetchApi<VoteTopicResponse>(`/topics/${id}`),

  vote: (topicId: string, data: RegisterVoteRequest) => 
    fetchApi<VoteResponse>(`/topics/${topicId}/vote`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getResults: (topicId: string) => 
    fetchApi<VotingResultResponse>(`/topics/${topicId}/result`),

  hasVoted: (topicId: string) => 
    fetchApi<HasVotedResponse>(`/topics/${topicId}/has-voted`),

  getReport: (topicId: string) =>
    fetchApi<TopicReportResponse>(`/topics/${topicId}/report`),

  getVotes: (topicId: string) =>
    fetchApi<TopicVoteDetailResponse[]>(`/topics/${topicId}/votes`),
};
