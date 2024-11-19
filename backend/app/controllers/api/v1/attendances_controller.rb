class API::V1::AttendancesController < ApplicationController
    include Authenticable
    before_action :set_event
    #check in de los users
    def create
      @attendance = Attendance.create(user: current_user, event: @event, checked_in: true)
      puts("ATTENDANCE:", @attendance.as_json)
      if @attendance.save
        puts("A")
        render json: { attendance: @attendance.as_json }, status: :ok
      else
        render json: { error: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def index
      attendances = @event.attendances.includes(:user)
      render json: attendances.map { |u| { user_id: u.user.id, first_name: u.user.first_name, last_name: u.user.last_name, handle: u.user.handle, checked_in: u.checked_in } }
    end

    private

    def set_event
      @event = Event.find(params[:event_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Evento no encontrado" }, status: :not_found
    end
  end