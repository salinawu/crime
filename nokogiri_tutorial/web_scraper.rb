require 'HTTParty'
require 'Nokogiri'
require 'JSON'
require 'Pry'
require 'csv'

url = 'https://incidentreports.uchicago.edu/incidentReportArchive.php'
start_day = 4
start_month = 11
start_year = 2016
end_day = 4
end_month = 14
end_year = 2016
offset = 0
dates = "?startDate=#{start_day}%2F#{start_month}%2F#{start_year}&endDate=#{end_day}%2F#{end_month}%2F#{end_year}&offset=#{offset}"

page = HTTParty.get(url + dates)
parse_page = Nokogiri::HTML(page)
data = parse_page.css(".ucpd")
num_pages = parse_page.css(".page-count").text.split("/")[1].strip

Pry.start(binding)
