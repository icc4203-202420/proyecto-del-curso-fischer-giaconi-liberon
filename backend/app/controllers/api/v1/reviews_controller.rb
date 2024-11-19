class API::V1::ReviewsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_beer, only: [:create]
  before_action :set_user, only: [:create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index

    if params[:beer_id]
      @beer = Beer.find(params[:beer_id])
      @reviews = Review.where(beer: @beer)
      render json: { reviews: @reviews }, status: :ok
    else
      friend_ids = Friendship.where(user_id: params[:user_id]).pluck(:friend_id)
      @reviews = Review.where(user_id: friend_ids)
      reviews_with_beers = @reviews.map do |review|
        {
          id: review.id,
          text: review.text,
          rating: review.rating,
          created_at: review.created_at,
          user_id: review.user_id,
          beer_id: review.beer.id,
          user: {
            id: review.user.id,
            first_name: review.user.first_name,
            last_name: review.user.last_name,
            handle: review.user.handle
          },
          beer: {
            id: review.beer.id,
            name: review.beer.name,
            style: review.beer.style,
            avg_rating: review.beer.avg_rating
          },
          bars: review.beer.bars.map do |bar|
            {
              id: bar.id,
              name: bar.name,
              latitude: bar.latitude,
              longitude: bar.longitude,
              address: {
                id: bar.address.id,
                line1: bar.address.line1,
                line2: bar.address.line2,
                city: bar.address.city,
                country: bar.address.country
              }
            }
          end
        }
      end
      render json: { reviews: reviews_with_beers}, status: :ok
    end
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @user.reviews.build(
      id: params[:id], 
      rating: params[:review][:rating], 
      text: params[:review][:text], 
      beer_id: @beer.id
    )
    @review.user = User.find(params[:user_id])
  
    if @review.save
      # Prepara los datos en el mismo formato que en index
      review_data = {
        id: @review.id,
        text: @review.text,
        rating: @review.rating,
        created_at: @review.created_at.strftime('%H:%M'),
        user_id: @review.user_id,
        beer_id: @review.beer.id,
        user: {
          id: @review.user.id,
          first_name: @review.user.first_name,
          last_name: @review.user.last_name,
          handle: @review.user.handle
        },
        beer: {
          id: @review.beer.id,
          name: @review.beer.name,
          style: @review.beer.style,
          avg_rating: @review.beer.avg_rating
        },
        bars: @review.beer.bars.map do |bar|
          {
            id: bar.id,
            name: bar.name,
            latitude: bar.latitude,
            longitude: bar.longitude,
            address: {
              id: bar.address.id,
              line1: bar.address.line1,
              line2: bar.address.line2,
              city: bar.address.city,
              country: bar.address.country
            }
          }
        end
      }

      # Envía los datos a través de WebSocket
      ActionCable.server.broadcast("feed_channel", {
        type: 'review',
        review: review_data
      })
      
      render json: @review.as_json(include: :user), status: :created, location: api_v1_review_url(@review)
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
  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end