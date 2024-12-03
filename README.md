# Tweet - Final Project for Team Mind-and-Machine

**Tweet** - a modern social networking platform built with Ruby on Rails and Next.js, featuring real-time messaging, post sharing, and user interactions.

<img width="1624" alt="Screenshot 2024-12-02 at 6 03 49 PM" src="https://github.com/user-attachments/assets/b8ea80b0-9ed6-4de8-aa4b-244766bbe698">

<img width="1624" alt="Screenshot 2024-12-02 at 6 03 58 PM" src="https://github.com/user-attachments/assets/d7cffa7a-353c-4192-8bde-3850be33dbe7">

<img width="1624" alt="Screenshot 2024-12-02 at 6 09 04 PM" src="https://github.com/user-attachments/assets/971e4bae-69c3-4a7e-9b96-bdf391ecae8d">

## Tech Stack

### Backend
- Ruby on Rails 7.0
- PostgreSQL
- Docker & Docker Compose

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS

## Features
- User authentication
- Real-time messaging
- Post creation and interaction
- Like and comment system
- User profiles
- Post search functionality
- Responsive design

## Prerequisites
- Docker
- Docker Compose
- Make

## Quick Start

1. Clone the repository
```bash
https://github.com/scalableinternetservices/mind-and-machine.git
cd mind-and-machine
```

2. Run the application
```bash
make run
```

## Project Structure
```bash
mind-and-machine/
├── Dockerfile
├── Gemfile
├── Makefile
├── README.md
├── Rakefile
├── app (backend Rails app)
├── bin
├── config (backend Rails config)
├── db (PostgreSQL database)
├── docker-compose.yml
├── lib (backend Rails lib)
├── react (frontend Next.js app)
├── storage
└── vendor
```

## API Endpoints

The frontend communicates with a Ruby on Rails backend API running on `http://localhost:3000`. Key endpoints include:

- Authentication: `/api/login`, `/api/signup`
- Posts: `/api/posts`
- Comments: `/api/posts/:id/comments`
- Likes: `/api/posts/:id/like`
- Search: `/api/search/posts`, `/api/search/users`
- Messages: `/api/chats`
