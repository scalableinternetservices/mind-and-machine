# Mind and Machine Social Platform

A modern social networking platform built with Ruby on Rails and Next.js, featuring real-time messaging, post sharing, and user interactions.

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

## API Endpoints

The frontend communicates with a Ruby on Rails backend API running on `http://localhost:3000`. Key endpoints include:

- Authentication: `/api/login`, `/api/signup`
- Posts: `/api/posts`
- Comments: `/api/posts/:id/comments`
- Likes: `/api/posts/:id/like`
- Search: `/api/search/posts`, `/api/search/users`
- Messages: `/api/chats`