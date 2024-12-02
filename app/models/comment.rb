class Comment < ApplicationRecord
  belongs_to :user, optional: true  # Added optional
  belongs_to :post
  
  validates :content, presence: true
  validate :no_election_influence
  
  private
  
  def no_election_influence
    forbidden_words = ['trump', 'harris']
    if forbidden_words.any? { |word| content.downcase.include?(word) }
      errors.add(:content, "cannot contain election-related content")
    end
  end

  validates :user_id, presence: true
  validates :post_id, presence: true
end