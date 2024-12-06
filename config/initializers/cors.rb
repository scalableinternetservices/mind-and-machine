Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:8000',
            /\Ahttp:\/\/.*\.elasticbeanstalk\.com\z/
          
    resource '/api/posts',
      headers: :any,
      methods: [:get, :post],
      credentials: false

    resource '/api/comments',
      headers: :any,
      methods: [:get, :post],
      credentials: false

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end 