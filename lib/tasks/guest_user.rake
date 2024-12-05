namespace :guest do
  desc "Create guest user if it doesn't exist"
  task create: :environment do
    if User.guest.nil?
      guest = User.new(
        username: '[Guest]',
        password: SecureRandom.hex(32),
        is_guest: true
      )
      
      if guest.save
        puts "Guest user created successfully"
      else
        puts "Failed to create guest user: #{guest.errors.full_messages.join(', ')}"
      end
    else
      puts "Guest user already exists"
    end
  end

  desc "Ensure guest user exists and is properly configured"
  task ensure: :environment do
    guest = User.guest
    
    if guest
      # Update guest user if needed
      guest.update(
        username: '[Guest]',
        is_guest: true
      ) unless guest.username == '[Guest]'
      puts "Guest user verified"
    else
      Rake::Task['guest:create'].execute
    end
  end
end 