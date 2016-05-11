require 'Nokogiri'
require 'JSON'
# require 'Pry'
require 'csv'
require 'open-uri'
# require "whenever"

require 'clockwork'

#gets the type of incident, time of occurence, further explaination (comments), and disposition
def extract(column)
	array = []
	i = 0
	column.each { |a|
		if i == 2 || i==6
			i+=1
			next
		end
			i+=1
			array.push(a.text.delete("\n"))
	}
	return array
end

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
table = parse_page.css("tr")
cols = []

for i in 0..num_pages
	offset = 5*i
	dates = "?startDate=#{start_day}%2F#{start_month}%2F#{start_year}&endDate=#{end_day}%2F#{end_month}%2F#{end_year}&offset=#{offset}"
	parse_page = Nokogiri::HTML(open(url + dates))
	num_pages = Integer(parse_page.css(".page-count").text.split("/")[1].strip) -1
	table = parse_page.css("tr")
	print table
	table.each { |tr| 
		# puts "1"
		# puts table
		cols.push(extract(tr.css("td"))) 
	}
	
end
# Pry.start(binding)

CSV.open("crimesdata.csv", "w") do |csv|
	cols.each do |col|
		csv << col
	end
end

# puts "hello i'm salina \n"
# print(cols)
# Pry.start(binding)

