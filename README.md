# SailerAI Challenge Web Application

This is the web application for the SailerAI challenge. It includes a variety of features designed to create and manage chats efficiently using a native WebSocket implementation.

## Functionalities Implemented

- **User Registration**: Allows new users to create an account.
- **User Login**: Authenticates users to access their accounts.
- **Create Chat**: Enables users to create new chat sessions.
- **List Created Chats**: Displays a list of chats created by the user.
- **Send Chat Message**: Facilitates sending text messages in a chat.
- **List Chat Messages**: Displays all messages in a chat.
- **Send Image as Chat Message**: Allows users to send images in chats.
- **Send Audio as Chat Message**: Enables sending audio messages in chats.
- **Mark Chat as Read**: Marks a chat as read for a user.
- **Update User Presence in Chat**: Updates the online/offline presence of a user in a chat.
- **Native WebSocket Implementation**: Efficient real-time communication using WebSocket.

## Prerequisites

- **Node.js Version**: v20.18.0
- **Important**: The original API from the challenge was modified. Use the updated API available at: [SailerAI Challenge API](https://github.com/alanjunqueira/SailerAI-challenge-api).

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/alanjunqueira/SailerAI-challenge.git
```

Navigate to the project directory:

```bash
cd SailerAI-challenge
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project by copying the `.env.example` file:


Update the variables in `.env.local` with your specific configuration.

### 3. Install Dependencies

Install the required dependencies using one of the following package managers:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 4. Build the Project

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### 5. Start the Application

Start the application in production mode:

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

### 6. Open in Browser

Open your browser and navigate to:

```text
http://localhost:3000
```

You should see the application running.

## API Integration

This web application interacts with the SailerAI Challenge API. Ensure the API is set up and running by following the instructions in its [repository](https://github.com/alanjunqueira/SailerAI-challenge-api).

## Additional Notes

- Ensure your environment variables are configured correctly to connect the application to the API.
- The application uses a native WebSocket implementation for real-time communication. Make sure your environment supports WebSocket connections.

## License

This project is licensed under the MIT License.

