# 🎓 Graduation Portal - RSVP Survey

A dynamic RSVP survey site for graduation ceremonies with email notification capabilities. Built with Next.js, Supabase, and EmailJS.

## ✨ Features

- **RSVP Form**: Beautiful, responsive form for graduation RSVPs
- **Email Notifications**: Automatic confirmation emails and bulk notifications
- **Admin Dashboard**: Manage RSVPs and send updates to all attendees
- **Data Export**: Export RSVP data to CSV format
- **Real-time Updates**: Live statistics and data management
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + Bootstrap-inspired design
- **Backend**: Supabase (PostgreSQL database)
- **Email Service**: EmailJS
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- EmailJS account

### 1. Clone the Repository

```bash
git clone https://github.com/P3klgh/Graduation-Portal.git
cd Graduation-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID=your_emailjs_bulk_template_id
```

### 4. Set Up Supabase Database

1. Create a new Supabase project
2. Create the following table in your Supabase database:

```sql
-- Create RSVP submissions table
CREATE TABLE rsvp_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name TEXT,
  graduation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you should implement proper authentication
CREATE POLICY "Allow all operations" ON rsvp_submissions
  FOR ALL USING (true);
```

### 5. Set Up EmailJS

1. Create an EmailJS account at [emailjs.com](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create email templates for:
   - RSVP confirmation emails
   - Bulk notification emails
4. Note down your Service ID, Template IDs, and Public Key

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the RSVP form.

## 📱 Pages

- **Home Page** (`/`): Main RSVP form
- **Admin Dashboard** (`/admin`): Manage RSVPs and send notifications

## 🎨 Customization

### Styling

The design is based on a Bootstrap contact form template. You can customize:

- Colors and fonts in `src/app/globals.css`
- Form fields in `src/components/RSVPForm.tsx`
- Layout in `src/app/page.tsx`

### Form Fields

Edit the RSVP form fields in `src/components/RSVPForm.tsx`:

```typescript
const [formData, setFormData] = useState<RSVPData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  dietary_restrictions: '',
  plus_one: false,
  plus_one_name: '',
  graduation_date: ''
})
```

### Email Templates

Customize email templates in EmailJS dashboard or modify the email functions in `src/lib/emailjs.ts`.

## 📊 Admin Features

The admin dashboard (`/admin`) provides:

- **Statistics**: Total RSVPs, guests, dietary restrictions
- **Bulk Notifications**: Send emails to all RSVP attendees
- **Data Export**: Download RSVP data as CSV
- **RSVP Management**: View all submissions in a table

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID`

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin dashboard page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── RSVPForm.tsx   # Main RSVP form
│   └── AdminDashboard.tsx # Admin dashboard
└── lib/               # Utility libraries
    ├── supabase.ts    # Supabase client
    └── emailjs.ts     # EmailJS functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help setting up or have questions:

1. Check the [Issues](https://github.com/P3klgh/Graduation-Portal/issues) page
2. Create a new issue with your question
3. Contact: graduation@university.edu

---

**Happy Graduation! 🎓✨** 
