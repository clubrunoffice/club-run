#!/bin/bash

# ChatGPT Integration Environment Setup Script
echo "🚀 Setting up ChatGPT Integration Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
fi

# Add ChatGPT configuration to .env
echo "" >> .env
echo "# ChatGPT Integration Configuration" >> .env
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
echo "CHATGPT_ENABLED=true" >> .env
echo "CHATGPT_DAILY_LIMIT_GUEST=0" >> .env
echo "CHATGPT_DAILY_LIMIT_RUNNER=0.50" >> .env
echo "CHATGPT_DAILY_LIMIT_DJ=1.00" >> .env
echo "CHATGPT_DAILY_LIMIT_VERIFIED_DJ=2.00" >> .env
echo "CHATGPT_DAILY_LIMIT_CLIENT=1.50" >> .env
echo "CHATGPT_DAILY_LIMIT_CURATOR=2.50" >> .env
echo "CHATGPT_DAILY_LIMIT_OPERATIONS=5.00" >> .env
echo "CHATGPT_DAILY_LIMIT_PARTNER=3.00" >> .env
echo "CHATGPT_DAILY_LIMIT_ADMIN=10.00" >> .env

echo "✅ Environment variables added to .env file"
echo ""
echo "🔧 Next steps:"
echo "1. Get your OpenAI API key from https://platform.openai.com/api-keys"
echo "2. Replace 'your_openai_api_key_here' in .env with your actual API key"
echo "3. Run 'npm run db:migrate' to create the ChatGPT cost logging table"
echo "4. Restart your server to enable ChatGPT integration"
echo ""
echo "💰 Cost Control Features:"
echo "- Role-based daily limits prevent cost spikes"
echo "- 80% of queries handled locally (FREE)"
echo "- 20% routed to ChatGPT (minimal cost)"
echo "- Automatic fallback system"
echo ""
echo "🔒 Security Features:"
echo "- Input sanitization removes sensitive data"
echo "- User IDs hashed for privacy"
echo "- Rate limiting prevents abuse"
echo "- Server-side only processing"
