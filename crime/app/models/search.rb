class Search < ActiveRecord::Base
	include ActiveModel::Validations
  	# include ActiveModel::Conversion

	validates_presence_of :address, :if => :start, presence: true
	attr_accessor :address, :key_words, :start, :end
 	
end
