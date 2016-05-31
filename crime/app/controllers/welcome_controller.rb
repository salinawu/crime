require "date"
require "json"


class WelcomeController < ApplicationController
#displays the index page
  def index
  end

  def search
  	logger.debug(params.inspect)
  	address = params[:address]
  	key_words = params[:key_words]
  	start_date = params[:start]
	end_date = params[:end]

	#DO NOT FORGET TO SANITIZE INPUT DATA AND VALIDATE
	#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	date_format = "%m/%d/%Y"

	addresses = []
	parsed_json = JSON.parse(WebScraper.runscript(4, 11, 2016, 4, 14, 2016))

	if (params[:address].present?)
		render :json => {:address => params[:address]}
	elsif (params[:address].present?)
		render plain: "OK"
	else
		render :json => parsed_json
	end

  end

end
