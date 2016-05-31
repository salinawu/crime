require "Date"
require "json"


class WelcomeController < ApplicationController
#displays the index page
  def index
  end

  def search
  	logger.debug(params.inspect)
  	address = params[:address]
  	key_words = params[:key_words]
  	date_format = "%m/%d/%Y"
  	start_date = Date.today - 7
	end_date = Date.today

	if (address.present?)
		render :json => {:address => address}
	elsif (key_words.present?)
		render plain: "OK"
	elsif (start_date.present? || end_date.present?)
		sdate = params[:start].present? ? Date.strptime(params[:start], date_format) : start_date
		edate = end_date
		if (params[:end].present?)
			edate = Date.strptime(params[:end])
		elsif (params[:start].present? && !params[:end].present?)
			edate = sdate + 7
		end
		json_addresses = JSON.parse(WebScraper.runscript(sdate.month, sdate.day, sdate.year,
		 edate.month, edate.day, edate.year))
		render :json => json_addresses
	end

  end

end
