class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :chat_room_members, dependent: :destroy
    has_many :chat_rooms, through: :chat_room_members
    has_many :chat_messages, dependent: :destroy
    
    has_secure_password

    # validate username cannot use reserved format
    validates :username, presence: true,
                        uniqueness: true,
                        format: {
                          without: /\A\[.*\]\z/,
                          message: "cannot start with '[' and end with ']'"
                        },
                        unless: :is_guest?

    # get guest user
    def self.guest
        find_by(is_guest: true)
    end

    # check if user is guest
    def guest?
        is_guest?
    end

    # prevent deletion of guest user
    before_destroy :prevent_guest_deletion

    private

    def prevent_guest_deletion
        if is_guest?
            errors.add(:base, "Cannot delete guest user")
            throw :abort
        end
    end
end