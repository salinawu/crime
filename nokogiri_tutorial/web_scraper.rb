require 'HTTParty'
require 'Nokogiri'
require 'JSON'
require 'Pry'
require 'csv'
#comment
page = HTTParty.get('https://incidentreports.uchicago.edu/incidentReportArchive.php' + '?startDate=04%2F11%2F2016&endDate=04%2F14%2F2016')
parse_page = Nokogiri::HTML(page)
Pry.start(binding)
