class WelcomeController < ApplicationController
#displays the index page
  def index
  	address = params[:address]
  	key_words = params["key_words"]
  	start_date = params["start"]
	end_date = params["end"]



	#DO NOT FORGET TO SANITIZE INPUT DATA AND VALIDATE
	#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


  end
end
