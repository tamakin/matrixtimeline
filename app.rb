require "sinatra/base"
require "sinatra/rocketio"
require "erb"
#require "sinatra/reloader" if Sinatra::Base.development?

require "json"
require "tweetstream"


p dev: Sinatra::Base.development?
require "pp"

Dir[File.join(File.dirname(__FILE__), "./lib", "*.rb")].each do |f|
  require f
end

module MatrixTweet

  class App < Sinatra::Base
    register Sinatra::RocketIO
    io = Sinatra::RocketIO

    configure do
      set :sessions, true
      set :logging, true
      set :dump_errors, false
    end
    configure :development do
#      register Sinatra::Reloader
    end

    before do
    end

    get '/' do
      erb :index
    end

    io.on :start do |message, client|
      p "> receive '#{message}' from #{client}"
      if message
        TweetStream.configure do |config|
          config.consumer_key = ENV['CONSUMER_KEY']
          config.consumer_secret = ENV['CONSUMER_SECRET']
          config.oauth_token = ENV['OAUTH_TOKEN']
          config.oauth_token_secret = ENV['OAUTH_SECRET']
          config.auth_method = :oauth
        end
        ts = TweetStream::Client.new
        ts.userstream do |status|
          tweet = {}
          twstatus = !status.retweeted_status ? status : status.retweeted_status
          tweet[:name] = twstatus.user.screen_name
          tweet[:id] = twstatus.id
          tweet[:image] = twstatus.user.profile_image_url
          tweet[:text] = twstatus.text
          tweet[:protected] = twstatus.user.protected
          tweet[:retweet] = status.retweeted_status ? true : false
          p "#{client.session} => @#{tweet[:name]} : #{tweet[:image]}"
          io.push :mes, {:value => tweet.to_json}, {:to => client.session}
        end
        p "start"
      end
    end

    io.on :disconnect do |client|
      p "client disconnected <#{client.session}> type:#{client.type}"
    end

    helpers do
    end

  end

end
