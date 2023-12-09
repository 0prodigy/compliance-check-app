## Getting Started

Clone the repo and install dependencies:

```bash
git clone
cd compliance-check-app
yarn install
```

## Running the app

# Prequsites

- Node.js
- Yarn
- Docker

# Please set environment variables

```bash
# .env
NEXT_PUBLIC_OPENAI_API_KEY=your_chatnbx_api_key
NEXT_PUBLIC_OPENAI_BASE_URL=https://https://chat.nbox.ai/apis
NEXT_PUBLIC_MODEL=yi-chat-34b-16k-4bit
```

# Note above env variables are set for demo purpose only. Please use your own open ai api key and model name to run the app if you want to use chat.nbox.ai apis. sign up at https://chat.nbox.ai to get your own api key and model name.

<!-- add a note that open env can be set as open ai value -->

```bash
# development
yarn start
```

# If you prefer running the app in docker container

```bash
docker build -t compliance-check-app .
docker run -p 3000:3000 compliance-check-app
```

# there is a make file to run the docker container

```bash
make build
make start
make stop
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
