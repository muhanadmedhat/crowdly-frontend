import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api.js';
import withLoading from '../utils/WithLoading.tsx';
import UserAvatar from './UserAvatar';


type Comment = {
  id: number;
  text: string;
  author: {
    id: number;
    username: string;
    profile_picture?: string;
  };
};

type CommunityFeedProps = {
  projectId: string;
  onInteraction?: () => void;
};

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;


function CommunityFeed({ projectId, onInteraction }: CommunityFeedProps) {
  const user = useSelector((state: any) => state.auth.user);
  
  const [commentRefresh, setCommentRefresh] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [reply, setReply] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editingReplyText, setEditingReplyText] = useState('');
  const [commentReports, setCommentReports] = useState<any>({});
  const [replyReports, setReplyReports] = useState<any>({});
  const [activeReplyId, setActiveReplyId] = useState(0);
  const [repliesMap, setRepliesMap] = useState<any>({});
  const [nextPage, setNextPage] = useState<string | null>(null);

  const triggerRefresh = () => {
    setCommentRefresh((prev) => prev + 1);
    if (onInteraction) onInteraction();
  };

  const handleLoadMore = async () => {
    if (!nextPage) return;
    const res = await withLoading(api.get(nextPage));
    const newComments = res.data.results || res.data.result || res.data || [];
    setComments([...comments, ...newComments]);
    setNextPage(res.data.next);
  };

  const handleGetReplies = async (commentId: number) => {
    const res = await withLoading(
      api.get(`${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/replies/`)
    );
    const replies = res.data.results || res.data.result || res.data || [];
    setRepliesMap((prev: any) => ({ ...prev, [commentId]: replies }));
  };

  const handleReplyPost = async (commentId: number) => {
    if (!reply.trim()) return;
    await withLoading(
      api
        .post(`${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/replies/`, {
          text: reply,
        })
        .then(() => {
          handleGetReplies(commentId);
          setReply('');
          setActiveReplyId(0);
          triggerRefresh();
        })
    );
  };

  const handleReportComment = async (commentId: number) => {
    await withLoading(
      api.post(`${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/reports/`, {
        reason: commentReports[commentId] || 'spam',
      })
    );
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentText.trim()) return;
    await withLoading(
      api
        .patch(`${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/`, {
          text: editingCommentText,
        })
        .then(() => {
          setEditingCommentId(null);
          setEditingCommentText('');
          triggerRefresh();
        })
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    await withLoading(
      api
        .delete(`${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/`)
        .then(() => {
          triggerRefresh();
        })
    );
  };

  const handleUpdateReply = async (commentId: number, replyId: number) => {
    if (!editingReplyText.trim()) return;
    await withLoading(
      api
        .patch(
          `${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/replies/${replyId}/`,
          { text: editingReplyText }
        )
        .then(() => {
          setEditingReplyId(null);
          setEditingReplyText('');
          handleGetReplies(commentId);
        })
    );
  };

  const handleDeleteReply = async (commentId: number, replyId: number) => {
    await withLoading(
      api
        .delete(
          `${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/replies/${replyId}/`
        )
        .then(() => {
          handleGetReplies(commentId);
        })
    );
  };

  const handleReportReply = async (commentId: number, replyId: number) => {
    await withLoading(
      api.post(
        `${BASE_URL}/interactions/projects/${projectId}/comments/${commentId}/replies/${replyId}/reports/`,
        { reason: replyReports[replyId] || 'spam' }
      )
    );
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    await withLoading(
      api
        .post(`${BASE_URL}/interactions/projects/${projectId}/comments/`, {
          text: comment,
        })
        .then(() => {
          setComment('');
          triggerRefresh();
        })
    );
  };

  useEffect(() => {
    const getComments = async () => {
      const commentsDB = await api.get(`${BASE_URL}/interactions/projects/${projectId}/comments/`);
      const fetchedComments =
        commentsDB.data.results || commentsDB.data.result || commentsDB.data || [];
      setComments(fetchedComments);
      setNextPage(commentsDB.data.next);
    };
    withLoading(getComments());
  }, [projectId, commentRefresh]);

  return (
    <>
      <h3 className="headline-md mt-8">Community Feed</h3>
      <div className="mt-4 border border-[var(--color-outline-variant)] rounded-lg p-4">
        <div className="flex gap-3 items-start">
          <UserAvatar username={user?.username} />
          <div className="flex-1">

            <p className="label-md text-[var(--color-text-secondary)] mb-2">
              Commenting as {user?.username || 'Loading...'}
            </p>
            <textarea
              rows={4}
              placeholder="Add your voice to the movement..."
              className="w-full bg-[var(--color-surface-low)] rounded-lg p-3 text-sm resize-none outline-none border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)]"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-end mt-2">
              <button className="btn-primary" onClick={handleSubmitComment}>
                Post Insight
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {!comments || comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border-t border-[var(--color-outline-variant)] pt-4">
                {/* Main Comment */}
                <div className="flex gap-3 items-start justify-between">
                  <div className="flex gap-3 items-start">
                    <UserAvatar username={c.author.username} />
                    <div>

                      <span className="font-semibold text-sm">{c.author.username}</span>
                      {editingCommentId === c.id ? (
                        <div className="mt-1 flex gap-2 items-center">
                          <input
                            type="text"
                            className="bg-[var(--color-surface-low)] rounded-md px-2 py-1 text-sm border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none"
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                          />
                          <button
                            className="text-green-600 hover:text-green-800 text-xs font-semibold px-2 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                            onClick={() => handleUpdateComment(c.id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700 text-xs font-semibold px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingCommentText('');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="body-md text-[var(--color-text-secondary)] mt-1">
                          {c.text}
                        </p>
                      )}

                      {/* Reply Button */}
                      <button
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-xs mt-2 flex items-center gap-1 transition-colors"
                        onClick={() => setActiveReplyId(c.id)}
                      >
                        ↩ Reply
                      </button>
                      {/* View Replies Button */}
                      <button
                        className="text-[var(--color-primary)] text-xs mt-1 flex items-center gap-1 hover:underline transition-colors"
                        onClick={() => handleGetReplies(c.id)}
                      >
                        ▾ View Replies
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {user?.id === c.author.id ? (
                      <>
                        {editingCommentId !== c.id && (
                          <button
                            onClick={() => {
                              setEditingCommentId(c.id);
                              setEditingCommentText(c.text);
                            }}
                            className="text-yellow-500 hover:text-yellow-700 text-sm font-semibold px-3 py-1 border border-yellow-200 rounded hover:bg-yellow-50 transition-colors"
                          >
                            Update
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                    <select
                      value={commentReports[c.id] || 'spam'}
                      onChange={(e) =>
                        setCommentReports((prev: any) => ({ ...prev, [c.id]: e.target.value }))
                      }
                    >
                      <option value="spam">Spam</option>
                      <option value="inappropriate">Inappropriate Content</option>
                      <option value="harassment">Harassment</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      onClick={() => handleReportComment(c.id)}
                      className="text-white-500 hover:text-red-700 text-sm font-semibold px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                    >
                      Report
                    </button>
                  </div>
                </div>

                {/* Reply Input */}
                {activeReplyId === c.id ? (
                  <div className="ml-12 mt-3">
                    <div className="flex gap-2 items-start">
                      <UserAvatar username={user?.username} size="w-7 h-7" />
                      <div className="flex-1">

                        <textarea
                          rows={2}
                          value={reply}
                          placeholder="Write a reply..."
                          className="w-full bg-[var(--color-surface-low)] rounded-lg p-2 text-sm resize-none outline-none border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)]"
                          onChange={(e) => setReply(e.target.value)}
                        />
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => handleReplyPost(c.id)}
                            className="btn-primary text-xs py-1 px-3"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Replies List */}
                <div className="ml-12 mt-3 flex flex-col gap-3">
                  {repliesMap[c.id] &&
                    repliesMap[c.id].map((r: any) => (
                      <div key={r.id} className="flex gap-2 items-start">
                        <UserAvatar username={r.author.username} size="w-7 h-7" />
                        <div className="bg-[var(--color-surface-low)] rounded-lg px-3 py-2 flex-1">

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs">{r.author.username}</span>
                            <span className="label-md text-[var(--color-text-secondary)]">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {editingReplyId === r.id ? (
                            <div className="mt-1 flex gap-2 items-center">
                              <input
                                type="text"
                                className="bg-white rounded-md px-2 py-1 text-sm border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none flex-1"
                                value={editingReplyText}
                                onChange={(e) => setEditingReplyText(e.target.value)}
                              />
                              <button
                                className="text-green-600 hover:text-green-800 text-xs font-semibold px-2 py-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                                onClick={() => handleUpdateReply(c.id, r.id)}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-500 hover:text-gray-700 text-xs font-semibold px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                  setEditingReplyId(null);
                                  setEditingReplyText('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              {r.text}
                            </p>
                          )}

                          <div className="flex gap-2 mt-2">
                            {user?.id === r.author.id ? (
                              <>
                                {editingReplyId !== r.id && (
                                  <button
                                    onClick={() => {
                                      setEditingReplyId(r.id);
                                      setEditingReplyText(r.text);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-700 text-[10px] font-semibold px-2 py-0.5 border border-yellow-200 rounded hover:bg-yellow-50 transition-colors"
                                  >
                                    Update
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteReply(c.id, r.id)}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-semibold px-2 py-0.5 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                >
                                  Delete
                                </button>
                              </>
                            ) : null}
                            <select
                              className="text-[10px] p-0.5 border rounded"
                              value={replyReports[r.id] || 'spam'}
                              onChange={(e) =>
                                setReplyReports((prev: any) => ({
                                  ...prev,
                                  [r.id]: e.target.value,
                                }))
                              }
                            >
                              <option value="spam">Spam</option>
                              <option value="inappropriate">Inappropriate</option>
                              <option value="harassment">Harassment</option>
                              <option value="other">Other</option>
                            </select>
                            <button
                              onClick={() => handleReportReply(c.id, r.id)}
                              className="text-gray-500 hover:text-red-700 text-[10px] font-semibold px-2 py-0.5 border border-red-200 rounded hover:bg-red-50 transition-colors"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
          {nextPage && (
            <button
              onClick={handleLoadMore}
              className="w-full mt-4 py-2 label-md text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-outline-variant)] rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              Load More Conversations ↓
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default CommunityFeed;
