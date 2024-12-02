class Post < ApplicationRecord
  belongs_to :user, optional: true  # Added optional
  has_many :comments, dependent: :destroy
  
  validates :content, presence: true
  validate :no_election_influence
  
  def like_by(user_id)
    unless self.likes.include?(user_id)
      self.likes << user_id
      self.save
    end
  end

  def unlike_by(user_id)
    if self.likes.include?(user_id)
      self.likes.delete(user_id)
      self.save
    end
  end
  
  private
  
  def no_election_influence
    forbidden_words = ['trump', 'harris']
    if forbidden_words.any? { |word| content.downcase.include?(word) }
      errors.add(:content, "cannot contain election-related content")
    end
  end
end