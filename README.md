# Auto Tweet App

**Auto Tweet** is a web application that allows users to post and schedule tweets directly from a dashboard. It also supports AI-generated tweets using HuggingFace models. Built with **Next.js**, **NextAuth.js**, **Prisma**, and **Twitter API v2**, this app offers a seamless experience for tech enthusiasts, content creators, and marketers.

---

## Features

- **User Authentication** with Twitter via NextAuth.js
- **Create Tweets** manually or with AI assistance
- **Schedule Tweets** for later posting
- **Dashboard** to view your posts and scheduled tweets
- **Responsive UI** with modern design and animations
- **Serverless Deployment** on Vercel

---

## Screenshots

### Main Page (Login)

![Main Page](https://github.com/Nishchal-ll/AutoTweet/blob/092fd3a6440fb6d3ddc21457a44e6cd6416812da/homepage.png)
*Login with your Twitter account to start posting.*

### Dashboard

![Dashboard](https://github.com/Nishchal-ll/AutoTweet/blob/092fd3a6440fb6d3ddc21457a44e6cd6416812da/dashboard.png)  
*View all your posted and scheduled tweets.*

### Create Page

![Create Page](https://github.com/Nishchal-ll/AutoTweet/blob/092fd3a6440fb6d3ddc21457a44e6cd6416812da/createpost.png)  
*Compose a new tweet manually or generate one using AI. Optionally schedule it for later.*

---

## Tech Stack

- **Frontend:** Next.js 13, React, TailwindCSS  
- **Backend:** Next.js API Routes, Prisma, PostgreSQL  
- **Authentication:** NextAuth.js with Twitter OAuth  
- **AI Integration:** HuggingFace API (Chat Completions)  
- **Deployment:** Vercel  

---

## Setup & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/Nishchal-ll/auto-tweet.git
cd auto-tweet

2. **Install Dependencies**
npm install
Setup .env

3. **Create a .env file in the root and add:""

env
Copy code
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=<your-random-generated-secret>
TWITTER_CLIENT_ID=<your-twitter-client-id>
TWITTER_CLIENT_SECRET=<your-twitter-client-secret>
HF_TOKEN=<your-huggingface-api-token>
Run Prisma migrations

bash
Copy code
npx prisma migrate dev
Start the development server

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser.
