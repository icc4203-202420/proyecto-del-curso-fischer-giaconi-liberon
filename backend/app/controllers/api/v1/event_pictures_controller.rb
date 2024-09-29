class API::V1::EventPicturesController < ApplicationController
  def index
    event_pictures = EventPicture.where(event_id: params[:event_id])
    render json: event_pictures, status: :ok
  end
  
  def create
    puts("PARAMS:", event_picture_params)
    event_picture = EventPicture.new(event_picture_params)
    puts("PENEEEEEEEEEE", event_picture)
    if event_picture.save
      render json: event_picture, status: :created
    else
      render json: event_picture.errors, status: :unprocessable_entity
    end
  end

  private

  def event_picture_params
    params.require(:event_picture).permit(:image, :event_id, :user_id, :handle)
  end
end
