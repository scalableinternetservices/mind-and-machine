namespace :db do
  desc "Seed database with sample users and posts"
  task seed_sample_data: :environment do
    puts "start seeding..."

    # first create guest user
    guest = User.new(
      username: '[Guest]',
      password: SecureRandom.hex(32),
      is_guest: true
    )
    puts "created guest user"

    # create 100 users rails00-rails99
    100.times do |i|
      username = format('rails%02d', i)
      User.create!(
        username: username,
        password: 'aaaaaaaa',
        password_confirmation: 'aaaaaaaa'
      )
      print "." if i % 10 == 0
    end
    puts "\ncreated 100 users"

    # get all user ids (including guest user)
    all_users = User.all.pluck(:id)

    # create 1000 posts
    1000.times do |i|
      Post.create!(
        content: SecureRandom.alphanumeric(18),
        user_id: all_users.sample,  # random select a user id
        created_at: rand(30.days).seconds.ago  # random time
      )
      print "." if i % 100 == 0
    end
    puts "\ncreated 1000 posts"

    puts "data injection completed!"
    puts "total users: #{User.count}"
    puts "total posts: #{Post.count}"
  end

  desc "Reset and seed database with sample data"
  task reset_and_seed: :environment do
    puts "reset database..."
    Rake::Task['db:reset'].invoke
    Rake::Task['db:seed_sample_data'].invoke
  end
end 