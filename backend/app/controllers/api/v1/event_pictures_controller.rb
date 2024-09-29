class API::V1::EventPicturesController < ApplicationController
  def index
    event_pictures = EventPicture.where(event_id: params[:event_id])
    render json: event_pictures.map { |picture|
      {
        id: picture.id,
        description: picture.description,
        image_url: url_for(picture.image),
        user: {
          id: picture.user.id,
          handle: picture.user.handle,
          name: picture.user.first_name + " " + picture.user.last_name
        }
      }
    }
  end
  
  def create
    event_picture = EventPicture.new(event_picture_params)
    if event_picture.save
      render json: event_picture, status: :created
    else
      render json: event_picture.errors, status: :unprocessable_entity
    end
  end

  private

  def event_picture_params
    params.require(:event_picture).permit(:image, :event_id, :user_id, :handle, :description)
  end
end
