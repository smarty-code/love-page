# Love Page 💕

A beautiful, interactive Valentine's page creator built with React and TypeScript. Create personalized Valentine pages for your loved ones and share them via unique URLs!

## Features

- 💖 Animated floating hearts background
- 🎨 Beautiful romantic gradient design
- 📸 Photo upload with Cloudinary integration
- 📝 Customizable name for your loved one
- 🔗 Shareable unique URLs
- 🎭 Interactive proposal modal with playful animations
- 📱 Fully responsive design
- ✨ Live preview while creating

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Image Storage**: Cloudinary
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun
- Cloudinary account (free tier available)

### Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
3. Note your **Cloud Name** from the dashboard
4. Create an unsigned upload preset:
   - Go to **Settings** → **Upload** → **Upload presets**
   - Click **Add upload preset**
   - Set **Signing Mode** to **Unsigned**
   - (Optional) Set a folder name like `valentine-pages`
   - Save and note the **preset name**

### Installation

```bash
# Clone the repository
git clone https://github.com/amitt/love-page.git

# Navigate to the project directory
cd love-page

# Install dependencies
bun install
# or
npm install

# Copy environment file and configure
cp .env.example .env
```

Edit `.env` with your Cloudinary credentials:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Start the development server:
```bash
bun run dev
# or
npm run dev
```

### How It Works

1. **Visit the app** - Go to `/create` to start
2. **Enter details** - Add your loved one's name and upload their photo
3. **Generate URL** - Click "Create Valentine Page" to upload and generate a unique URL
4. **Share** - Copy and share the URL with your loved one!
5. **View** - Recipients see a beautiful personalized Valentine page
6. **Create more** - A floating button lets anyone create their own page

### URL Structure

Generated URLs look like:
```
https://yoursite.com/?name=YourLove&image=https://res.cloudinary.com/...
```

## Building for Production

```bash
bun run build
# or
npm run build
```

## Testing

```bash
bun run test
# or
npm run test
```

## License

MIT License

## Author

Amit
