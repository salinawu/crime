require 'Nokogiri'
require 'json'
require 'open-uri'

class WebScraper < ActiveRecord::Base

	def writeCSV(cols)
		labels = ["incident", "loc", "time", "comments", "disposition"]
		CSV.open("crimesdata.csv", "w", :headers => true) do |csv|
			csv << labels
			cols.each do |col|
				csv << col
			end
		end
	end

	def self.runscript(start_day, start_month, start_year, end_day, end_month, end_year)

		url = 'https://incidentreports.uchicago.edu/incidentReportArchive.php'
		offset = 0
		dates = "?startDate=#{start_day}%2F#{start_month}%2F#{start_year}&endDate=#{end_day}%2F#{end_month}%2F#{end_year}&offset=#{offset}"

		parse_page = Nokogiri::HTML(open(url + dates))
		num_pages = Integer(parse_page.css(".page-count").text.split("/")[1].strip) -1
		table = parse_page.css("tbody td")
		cols = []

		for i in 0..num_pages
			offset = 5*i
			dates = "?startDate=#{start_day}%2F#{start_month}%2F#{start_year}&endDate=#{end_day}%2F#{end_month}%2F#{end_year}&offset=#{offset}"
			parse_page = Nokogiri::HTML(open(url + dates))
			num_pages = Integer(parse_page.css(".page-count").text.split("/")[1].strip) -1
			table = parse_page.css("tbody td")

			j = 0
			col = {}

			table.each { |td|
				if j==6
					cols.push(col)
					j=0
					col= {}
				elsif j == 2
					j+=1
					next
				else
					case j
					when 0
						col[:Incident] = td.text.delete("\n")
					when 1
						col[:Location] = td.text.delete("\n").gsub(/\(.*\)/, "")
					when 3
						col[:Time] = td.text.delete("\n")
					when 4
						col[:Comments] = td.text.delete("\n")
					else
						col[:Disposition] = td.text.delete("\n")
					end
					j+=1

				end
			}

		end

		return cols.to_json
	end

end
