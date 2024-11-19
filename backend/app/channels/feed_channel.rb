class FeedChannel < ApplicationCable::Channel
  def subscribed
    logger.info "User #{params[:userid]} connected to FeedChannel"
    # stream_from "feed_channel#{params[:user_id]}"
    stream_from "feed_channel"
  end

  def unsubscribed
    logger.info "User #{params[:user_id]} disconnected from FeedChannel"
  end
end
