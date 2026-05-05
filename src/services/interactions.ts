import api from '../utils/api';

export interface CommentPayload {
  text: string;
}

export interface RatingPayload {
  score: number;
}

export interface ReportPayload {
  reason: 'inappropriate' | 'spam' | 'harassment' | 'other';
}

// comments
// GET all comments / POST new comment
export const getComments = (projectId: number) =>
  api.get(`interactions/projects/${projectId}/comments/`);

export const addComment = (projectId: number, data: CommentPayload) =>
  api.post(`interactions/projects/${projectId}/comments/`, data);

// DELETE or UPDATE single comment
export const deleteComment = (projectId: number, commentId: number) =>
  api.delete(`interactions/projects/${projectId}/comments/${commentId}/`);

// replies
// GET replies / POST reply
export const getReplies = (projectId: number, commentId: number) =>
  api.get(`interactions/projects/${projectId}/comments/${commentId}/replies/`);

export const addReply = (projectId: number, commentId: number, data: CommentPayload) =>
  api.post(`interactions/projects/${projectId}/comments/${commentId}/replies/`, data);

// DELETE reply
export const deleteReply = (projectId: number, commentId: number, replyId: number) =>
  api.delete(`interactions/projects/${projectId}/comments/${commentId}/replies/${replyId}/`);

// ratings
// POST rating / GET ratings
export const rateProject = (projectId: number, data: RatingPayload) =>
  api.post(`interactions/projects/${projectId}/ratings/`, data);

export const getProjectRating = (projectId: number) =>
  api.get(`interactions/projects/${projectId}/ratings/`);

// reports
// Project report
export const reportProject = (projectId: number, data: ReportPayload) =>
  api.post(`interactions/projects/${projectId}/reports/`, data);

// Comment report
export const reportComment = (projectId: number, commentId: number, data: ReportPayload) =>
  api.post(`interactions/projects/${projectId}/comments/${commentId}/reports/`, data);

// Reply report
export const reportReply = (
  projectId: number,
  commentId: number,
  replyId: number,
  data: ReportPayload
) =>
  api.post(
    `interactions/projects/${projectId}/comments/${commentId}/replies/${replyId}/reports/`,
    data
  );
