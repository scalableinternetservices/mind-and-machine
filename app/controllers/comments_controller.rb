class CommentsController < ApplicationController
  before_action :set_comment, only: [:edit, :update, :destroy]
  before_action :check_ownership, only: [:edit, :update, :destroy]

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user if current_user # Associate with user if authenticated
    
    if @comment.save
      redirect_to post_path(@post), notice: 'Comment was successfully added.'
    else
      redirect_to post_path(@post), alert: @comment.errors.full_messages.join(', ')
    end
  end

  def edit
  end

  def update
    if @comment.update(comment_params)
      redirect_to post_path(@comment.post), notice: 'Comment was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    post = @comment.post
    @comment.destroy
    redirect_to post_path(post), notice: 'Comment was successfully deleted.'
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content)
  end

  def check_ownership
    unless @comment.user == current_user
      redirect_to root_path, alert: 'You can only modify your own comments.'
    end
  end
end