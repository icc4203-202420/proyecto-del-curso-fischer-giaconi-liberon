class API::V1::EventPicturesController < ApplicationController
  def index
    event_pictures = EventPicture.where(event_id: params[:event_id])
    
    Rails.logger.debug "Fetching event pictures for event_id: #{params[:event_id]}"
    Rails.logger.debug "Event pictures found: #{event_pictures.count}"

    render json: event_pictures.map { |picture|
      {
        id: picture.id,
        description: picture.description,
        image_url: url_for(picture.image),
        user: {
          id: picture.user.id,
          handle: picture.user.handle,
          name: "#{picture.user.first_name} #{picture.user.last_name}"
        },
        tagged_users: picture.tagged_users.map { |tagged_user| 
          {
            id: tagged_user.id,
            handle: tagged_user.handle,
            name: "#{tagged_user.first_name} #{tagged_user.last_name}"
          }
        }
      }
    }
  end
  
  def create
    event_picture_params = params.require(:event_picture).permit(:image, :event_id, :user_id, :description, tagged_users: [])
    
    # Convert tagged user IDs from strings to User instances
    tagged_users = event_picture_params[:tagged_users].map do |user_id|
      User.find(user_id) if user_id.present?
    end.compact
  
    event_picture = EventPicture.new(
      image: event_picture_params[:image],
      event_id: event_picture_params[:event_id],
      user_id: event_picture_params[:user_id],
      description: event_picture_params[:description]
    )
    
    # Associate tagged users with the event picture
    event_picture.tagged_users << tagged_users if tagged_users.any?
  
    if event_picture.save
      render json: event_picture, status: :created
    else
      render json: event_picture.errors, status: :unprocessable_entity
    end
  end
  
  
    

  private

  def event_picture_params
    params.require(:event_picture).permit(:image, :event_id, :user_id, :description, tagged_users: [])
  end
end
