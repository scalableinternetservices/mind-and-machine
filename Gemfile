source "https://rubygems.org"

ruby "3.2.2"

gem 'aws-sdk-s3', '~> 1.174'

gem "bcrypt", "~> 3.1.7"

gem "jwt"

gem "rails", "~> 7.1.2"

gem "sprockets-rails"

gem "pg", "~> 1.3.0"

# Check the latest supported [https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.ruby]
gem "puma", ">= 5.0"

gem "importmap-rails"

gem "turbo-rails"

gem "stimulus-rails"

gem "tzinfo-data", platforms: %i[ windows jruby ]

gem "bootsnap", require: false

gem 'rack-cors', require: 'rack/cors'

group :development, :test do
  gem "debug", platforms: %i[ mri windows ]
end

group :development do
  gem "web-console"
end