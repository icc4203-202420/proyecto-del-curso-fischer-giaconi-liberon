class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_beer, only: [:index, :create]
  before_action :set_user, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    @reviews = Review.where(beer: @beer)
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @user.reviews.build(id: params[:id], rating: params[:review][:rating], text: params[:review][:text], beer_id: @beer.id)
    @review.user = current_user
    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = User.find(params[:user_id]) 
  end

  def set_beer
    @beer = Beer.find(params[:beer_id])
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
