require "Date"
require "json"
require "set"


class WelcomeController < ApplicationController
#displays the index page
  def index
  end

  def search
  	address = params[:address]
  	key_words = params[:key_words]
  	date_format = "%m/%d/%Y"
  	sdate = Date.today - 7
	edate = Date.today

	if (address.present?)
		render :json => {:address => address}
		return
	end


	if (params[:start].present? || params[:end].present?)
		sdate = params[:start].present? ? Date.strptime(params[:start], date_format) : sdate
		if (params[:end].present?)
			edate = Date.strptime(params[:end], date_format)
		elsif (params[:start].present? && !params[:end].present?)
			edate = sdate + 7
		end

		today = Date.today
		if (sdate > today || edate > today)
			render :json => {:timetraveling => "<h5>The future is unknown! </br> 
				(Gotta put in a date that's today or from the past) </h5>".html_safe }
			return
		end

	end

	if (key_words.present?)
		kw_array = key_words.split(" ")
		json_addresses = WebScraper.runscript(sdate.month, sdate.day, sdate.year,
		 edate.month, edate.day, edate.year)
		to_ret = Set.new([])

		json_addresses.each do |addr|
			kw_array.each do |kw|
				if (addr[:Comments].downcase().include?(kw.downcase()) || 
					addr[:Incident].downcase().include?(kw.downcase()))
					to_ret.add(addr)
				end
			end
		end
		render :json => to_ret.to_a.map { |o| Hash[o.each_pair.to_a] }.to_json
		return
	end

	render :json => WebScraper.runscript(sdate.month, sdate.day, sdate.year,
		 		edate.month, edate.day, edate.year).map { |o| Hash[o.each_pair.to_a] }.to_json
	
  end

end
