class API::V1::UsersController < ApplicationController
  respond_to :json
  include Authenticable
  before_action :verify_jwt_token, only: [:create, :update, :friendships, :create_friendship]
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]

  def index
    @users = User.includes(:reviews, :address).all
    render json: @users
  end

  def show
    puts(params)
    @friendship = Friendship.where(user_id: params['id'], friend_id: params['current_user']).first()
    if @friendship
      @event = Event.where(id: @friendship.event_id).first()
      render json: {
        user: @user.as_json(include: [:address, :reviews, :friendships]),
        friendship: @friendship,
        event: @event,
      }
    else
      @events = Event.joins(:attendances).joins("INNER JOIN attendances AS second_attendances ON events.id = second_attendances.event_id").where(attendances: { user_id: params['current_user'] }).where("second_attendances.user_id = ?", params['id'])
      render json: {
        user: @user.as_json(include: [:address, :reviews, :friendships]),
        events: @events,
      }
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def current
    render json: current_user
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  #CAMBIOS PARA FRIENDSHIP
  #GET friendships
  def friendships
    render json: @user.friendships.includes(:friend).map(&:friend)
  end

  #POST friendships
  def create_friendship
    if friendship_params['bar_id']
      @friendship = @user.friendships.new(friendship_params)
      if @friendship.save
        render json: @friendship, status: :created
      else
        render json: @friendship.errors, status: :unprocessable_entity
      end
    else
      event_id = friendship_params['event_id']
      bar_id = Event.find(event_id).bar_id
      id = params['id']
      puts(id)
      puts(friendship_params['friend_id'])
      puts(bar_id)
      puts(event_id)
      @friendship = @user.friendships.new(user_id: params['id'], friend_id: friendship_params['friend_id'], bar_id: bar_id, event_id: event_id)
      if @friendship.save
        render json: @friendship, status: :created
      else
        render json: @friendship.errors, status: :unprocessable_entity
      end
    end
  end

  def search
    if params[:handle].present?
      @users = User.where('handle ILIKE ?', "%#{params[:handle]}%")
    else
      @users = User.all
    end
    render json: @users
  end
  
  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id, :event_id)
  end

end