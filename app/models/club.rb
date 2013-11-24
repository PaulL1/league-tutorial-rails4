class Club < ActiveRecord::Base
  validates_presence_of :name, :contact_officer
  validates_length_of :name, :in => 5..30
  validates_length_of :contact_officer, :in => 9..25
end
