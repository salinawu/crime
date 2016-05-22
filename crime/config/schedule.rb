#this is not needed since we are not generating files
require 'clockwork'

module Clockwork
  handler do |job|
    # puts "Running #{job}"
    # %x(ruby web_scraper.rb)
    system( "ruby web_scraper.rb" )
  end

  # handler receives the time when job is prepared to run in the 2nd argument
  # handler do |job, time|
  #   puts "Running #{job}, at #{time}"
  # end

  every(5.seconds, 'hello')
end
