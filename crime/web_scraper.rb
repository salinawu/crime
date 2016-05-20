require 'Nokogiri'
require 'JSON'
# require 'Pry'
require 'csv'
require 'open-uri'
# require "whenever"

require 'clockwork'

url = 'https://incidentreports.uchicago.edu/incidentReportArchive.php'
start_day = 4
start_month = 11
start_year = 2016
end_day = 4
end_month = 14
end_year = 2016
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
	col = []

	table.each { |td|
		# puts "1"
		# puts table
		if j==6
			cols.push(col)
			j=0
			col=[]
		elsif j == 2
			j+=1
			next
		else
			j+=1
			col.push(td.text.delete("\n"))
		end
	}

end

CSV.open("crimesdata.csv", "w") do |csv|
	cols.each do |col|
		csv << col
	end
end
