class PostsController < ApplicationController
  before_action :require_login, only: [:create, :update, :destroy, :like, :unlike]
  before_action :set_post, only: [:show, :update, :destroy, :like, :unlike]
  before_action :check_ownership, only: [:update, :destroy]
  
  def index
    @posts = Post.includes(:user, :comments).order(created_at: :desc)
    render json: @posts.map { |post| 
      {
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user: {
          id: post.user&.id,
          username: post.user&.username
        },
        likes: post.likes.map(&:to_s),
        comments: post.comments.map { |comment|
          {
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user: {
              id: comment.user&.id,
              username: comment.user&.username
            }
          }
        }
      }
    }
  end

  def show
    @post = Post.includes(:user, :comments => :user).find(params[:id])
    render json: {
      id: @post.id,
      content: @post.content,
      created_at: @post.created_at,
      user: {
        id: @post.user&.id,
        username: @post.user&.username
      },
      likes: @post.likes.map(&:to_s),
      comments: @post.comments.map { |comment|
        {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: {
            id: comment.user&.id,
            username: comment.user&.username
          }
        }
      }
    }
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)
    @post.likes = []
    
    if @post.save
      render json: {
        id: @post.id,
        content: @post.content,
        created_at: @post.created_at,
        user: {
          id: @post.user.id,
          username: @post.user.username
        },
        likes: @post.likes.map(&:to_s),
        comments: []
      }, status: :created
    else
      render json: { errors: @post.errors }, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @post.update(post_params)
      render json: { message: "Post updated successfully" }, status: :ok
    else
      render json: { errors: @post.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    render json: { message: "Post deleted successfully" }, status: :ok
  end

  def like
    @post.like_by(current_user.id)
    render json: {
      message: "Post liked successfully",
      likes: @post.likes.map(&:to_s)
    }
  end

  def unlike
    @post.unlike_by(current_user.id)
    render json: {
      message: "Post unliked successfully",
      likes: @post.likes.map(&:to_s)
    }
  end

  # get user posts by user_id
  def user_posts
    @user = User.find_by(id: params[:user_id])
    
    unless @user
      render json: { error: "User not found" }, status: :not_found
      return
    end
    
    @posts = Post.includes(:user, :comments)
                 .where(user_id: @user.id)
                 .order(created_at: :desc)
    
    render json: @posts.map { |post| 
      {
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user: {
          id: post.user&.id,
          username: post.user&.username,
          created_at: post.user&.created_at
        },
        likes: post.likes.map(&:to_s),
        comments: post.comments.map { |comment|
          {
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user: {
              id: comment.user&.id,
              username: comment.user&.username
            }
          }
        }
      }
    }
  end

  # get user liked posts by user_id
  def liked_posts
    @user = User.find_by(id: params[:user_id])
    
    unless @user
      render json: { error: "User not found" }, status: :not_found
      return
    end
    
    @posts = Post.includes(:user, :comments)
                 .where("likes @> ARRAY[?]::integer[]", [@user.id])
                 .order(created_at: :desc)
    
    render json: @posts.map { |post| 
      {
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user: {
          id: post.user&.id,
          username: post.user&.username,
        },
        likes: post.likes.map(&:to_s),
        comments: post.comments.map { |comment|
          {
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user: {
              id: comment.user&.id,
              username: comment.user&.username
            }
          }
        }
      }
    }
  end

  def search
    query = params[:q]&.strip
    
    if query.blank?
      render json: { error: "Search query cannot be empty" }, status: :bad_request
      return
    end
    
    @posts = Post.includes(:user, :comments)
                 .where("content ILIKE ?", "%#{query}%")
                 .order(created_at: :desc)
    
    render json: @posts.map { |post| 
      {
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user: {
          id: post.user&.id,
          username: post.user&.username
        },
        likes: post.likes.map(&:to_s),
        comments: post.comments.map { |comment|
          {
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user: {
              id: comment.user&.id,
              username: comment.user&.username
            }
          }
        }
      }
    }
  end

  private

  def set_post
    @post = Post.find_by(id: params[:id])
    unless @post
      render json: { error: "Post not found" }, status: :not_found
    end
  end

  def post_params
    params.permit(:content)
  end

  def check_ownership
    unless @post.user == current_user
      render json: { error: "You can only modify your own posts" }, status: :forbidden
    end
  end
end