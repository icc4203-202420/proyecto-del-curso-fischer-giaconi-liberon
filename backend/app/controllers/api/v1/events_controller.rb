class API::V1::EventsController < ApplicationController
    include ImageProcessing
    include Authenticable

    respond_to :json
    before_action :verify_jwt_token, only: [:create, :update, :destroy]
    before_action :set_event, only: [:show, :update, :destroy]
    before_action :set_bar, only: [:index]

    def index
        events = @bar.events
        
        render json: { events: events }, status: :ok 
    end

    def show
        if @event.flyer.attached?
            render json: @event.as_json.merge({
                image_url: url_for(@event.image),
                thumbnail_url: url_for(@event.thumbnail)}),
                status: :ok
        else
            render json: { event: @event.as_json }, status: :ok
        end
    end

    def create
        @event = Event.new(event_params.except(:image_base64))
        handle_image_attachment if event_params[:image_base64]

        if @event.save
            render json: { event: @event, message: 'Event created successfully.' }, status: :created
        else
            render json: @event.errors, status: :unprocessable_entity
        end
    end

    def update
        handle_image_attachment if event_params[:image_base64]

        if @event.update(event_params.except(:image_base64))
            render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
        else
            render json: @event.errors, status: :unprocessable_entity
        end
    end

    def destroy
        if @event.destroy
            render json: { message: 'Event successfully deleted.' }, status: :no_content
        else
            render json: @event.errors, status: :unprocessable_entity
        end
    end


    private
    def set_bar
        @bar = Bar.find(params[:bar_id])
        render json: { error: 'Bar not found' }, status: :not_found if @bar.nil?
    end
    def set_event
        @event = Event.find_by(id: params[:id])
        render json: { error: 'Event not found' }, status: :not_found if @event.nil?
    end

    def event_params
        params.require(:event).permit(:name, :description, :bar_id, :image_base64)
    end

    def handle_image_attachment
        decode_image = decode_image(event_params[:image_base64])
        @event.flyer.attach(io: decoded_image[:io],
            filename: decode_image[:filename],
            content_type: decoded_image[:content_type]
        )
    end

    def verify_jwt_token
        authenticate_user!
        head :unauthorized unless current_user
    end
end