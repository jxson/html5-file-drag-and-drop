require 'sinatra'

get('/') do
  send_file('public/index.html')
end

run Sinatra::Application