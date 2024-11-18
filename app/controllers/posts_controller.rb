class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :check_ownership, only: [:edit, :update, :destroy]
  
  def index
    @posts = if params[:username].present?
      User.find_by(username: params[:username])&.posts || Post.none
    else
      Post.all
    end
    @posts = @posts.order(created_at: :desc)
  end
  
  def show
    @comment = Comment.new
  end
  
  def new
    @post = Post.new
  end
  
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      redirect_to root_path, notice: 'Post was successfully created.'
    else
      render :new
    end
  end
  
  def edit
  end
  
  def update
    if @post.update(post_params)
      redirect_to @post, notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end
  
  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post was successfully deleted.'
  end
  
  private
  
  def set_post
    @post = Post.find_by(id: params[:id])
    render file: 'public/404.html', status: :not_found unless @post
  end
  
  def post_params
    params.require(:post).permit(:content)
  end
  
  def check_ownership
    unless @post.user == current_user
      redirect_to root_path, alert: 'You can only modify your own posts.'
    end
  end
end