# Soliate - Web3 Marketing Automation Platform

Soliate is a Next.js-based web application that automates Web3 marketing campaigns, leveraging the power of blockchain technology to enhance engagement and growth.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/soliatev2.git
   cd soliatev2
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_api_key
   HELIUS_API_KEY=your_helius_api_key
   ```

2. Replace `your_solana_rpc_endpoint` with your actual Solana RPC endpoint.

## Running the Development Server

To start the development server: 
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Building for Production

To create a production build:
```
npm run build
```

To start the production server:
```
npm start
```

## Project Structure

- `/src/app`: Contains the main application pages and API routes
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and configurations
- `/public`: Static assets

## Key Features

- Web3 wallet integration
- Campaign creation and management
- Automated token distribution
- Real-time analytics dashboard

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository or contact our support team at support@soliate.xyz.
