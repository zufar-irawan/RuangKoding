"use server";

// Export all server actions from this directory
export { deleteUserAccount } from "./AccountActions";
export type { DeleteAccountResult } from "./AccountActions";

export {
  createFeedbackRequest,
  associateRequestTags,
  uploadProjectIcon,
} from "./FeedbackRequestAction";

export {
  getRequestById,
  getFeedbacksByRequestId,
  createFeedback,
  getFeedbackComments,
  createFeedbackComment,
  deleteFeedbackComment,
  deleteFeedback,
  checkUserFeedbackVote,
  handleFeedbackVote,
  getFeedbackVoteCount,
  checkUserRequestVote,
  handleRequestVote,
  getRequestVoteCount,
} from "./FeedbackAction";

export type { FeedbackDetailItem, RequestDetailItem } from "./FeedbackAction";
