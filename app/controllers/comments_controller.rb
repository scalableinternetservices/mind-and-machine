class CommentsController < ApplicationController
  before_action :require_login, only: [:update, :destroy]
  before_action :set_post
  before_action :set_comment, only: [:update, :destroy]
  before_action :check_ownership, only: [:update, :destroy]

  def create
    @comment = if current_user
                @post.comments.build(comment_params.merge(user: current_user))
              else
                guest_user = ensure_guest_user
                if guest_user
                  @post.comments.build(comment_params.merge(user: guest_user))
                else
                  render json: { error: "Failed to create guest user" }, status: :internal_server_error
                  return
                end
              end

    if @comment.save
      render json: {
        id: @comment.id,
        content: @comment.content,
        created_at: @comment.created_at,
        user: {
          id: @comment.user.id,
          username: @comment.user.username,
          is_guest: @comment.user.is_guest?
        }
      }, status: :created
    else
      render json: { errors: @comment.errors }, status: :unprocessable_entity
    end
  end

  def post_comments
    @comments = Comment.all
                       .where(post_id: params[:post_id])
                       .order(created_at: :desc)

    # use stale? to conditionally render
    if stale?(etag: @comments, last_modified: @comments.maximum(:updated_at), public: true)
      render json: @comments.map { |comment|
        {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: {
            id: comment.user.id,
            username: comment.user.username
          }
        }
      }
    end
  end

  def update
    if @comment.update(comment_params)
      render json: {
        id: @comment.id,
        content: @comment.content,
        created_at: @comment.created_at,
        updated_at: @comment.updated_at,
        user: {
          id: @comment.user.id,
          username: @comment.user.username
        }
      }, status: :ok
    else
      render json: { errors: @comment.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @comment.destroy
    render json: { message: "Comment deleted successfully" }, status: :ok
  end

  private

  def set_post
    @post = Post.find_by(id: params[:post_id])
    unless @post
      render json: { error: "Post not found" }, status: :not_found
    end
  end

  def set_comment
    @comment = @post.comments.find_by(id: params[:id])
    unless @comment
      render json: { error: "Comment not found" }, status: :not_found
    end
  end

  def comment_params
    params.permit(:content)
  end

  def check_ownership
    unless @comment.user == current_user
      render json: { error: "You can only modify your own comments" }, status: :forbidden
    end
  end
end