require "date"
require "json"

class WelcomeController < ApplicationController
#displays the index page
  def index
  end

  def search
  	address = params["address"]
  	key_words = params["key_words"]
  	start_date = params["start"]
	end_date = params["end"]

	# begin 
	# 	Date.parse(start_date)
	# 	Date.parse(end_date)
	# rescue ArgumentError
	# end

	#DO NOT FORGET TO SANITIZE INPUT DATA AND VALIDATE
	#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	addresses = []
	parsed_json = JSON.parse(WebScraper.runscript(4, 11, 2016, 4, 14, 2016))

	render :json => parsed_json

  end

end
