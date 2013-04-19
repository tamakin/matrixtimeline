require "bundler/setup"

app_dir = File.expand_path(File.dirname(__FILE__))
require app_dir + '/app'

MatrixTweet::App.run! host: 'localhost'
