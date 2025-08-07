# Pacific MMA - Firebase Cloud Functions

Firebase Cloud Functions for Pacific MMA notification system and backend operations.

## 🚀 Setup

### Prerequisites
- Node.js 18 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- SendGrid account for email services

### Installation
```bash
cd functions
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Set Firebase config:
```bash
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set email.admin="admin@pacificmma.com"
firebase functions:config:set email.from="notifications@pacificmma.com"
```

3. Get config for local development:
```bash
firebase functions:config:get > .runtimeconfig.json
```

## 📁 Structure

```
functions/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/               # Configuration files
│   │   └── firebase.ts       # Firebase admin setup
│   ├── notify/               # Notification functions
│   │   ├── notifyMe.ts       # Handle notify requests
│   │   ├── notifyAvailability.ts # Update destination availability
│   │   └── scheduledNotifications.ts # Scheduled batch notifications
│   └── utils/                # Utility functions
│       ├── email.ts          # Email sending utilities
│       └── validation.ts     # Input validation
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔧 Available Functions

### HTTP Callable Functions

#### `notifyMe`
Handles user notification requests when tours are unavailable.

**Payload:**
```typescript
{
  name: string;
  email: string;
  phone: string;
  destinationCountry: string;
  destinationTitle: string;
}
```

#### `notifyAvailability`
Updates destination availability and triggers notifications (Admin only).

**Payload:**
```typescript
{
  destinationId: string;
  available: boolean;
  price?: number;
  startDate?: string;
  endDate?: string;
  spots?: number;
}
```

#### `getNotificationStats`
Returns notification statistics for all destinations (Admin only).

### Scheduled Functions

#### `scheduledNotificationCheck`
Runs daily at 9 AM PST to check for newly available destinations and send batch notifications.

## 🧪 Local Development

### Run emulators:
```bash
npm run serve
```

### Test functions locally:
```bash
npm run shell
```

### Deploy to production:
```bash
npm run deploy
```

## 📝 Database Collections

The functions interact with these Firestore collections:

- `notify_requests` - Stores user notification requests
- `destinations` - Tour destination information
- `email_logs` - Email sending history
- `activity_logs` - Admin activity logs

## 📧 Email Templates

SendGrid templates used:
- `notify_confirmation` - Confirmation email when user signs up for notifications
- `tour_available` - Notification when tour becomes available
- `admin_notification` - Alert to admin for new requests

## 🔒 Security

- All admin functions require authentication and custom claims
- Input validation on all user-submitted data
- Rate limiting on public endpoints
- Sanitization of user inputs

## 📊 Monitoring

View function logs:
```bash
firebase functions:log
```

Monitor in Firebase Console:
- Functions dashboard for execution metrics
- Firestore for data inspection
- Logs Explorer for detailed debugging

## 🚨 Troubleshooting

### Common Issues

1. **SendGrid not sending emails**
   - Check API key configuration
   - Verify sender email is authenticated in SendGrid

2. **Functions timeout**
   - Check function memory allocation
   - Optimize database queries

3. **Permission denied errors**
   - Verify Firebase Admin SDK initialization
   - Check Firestore security rules

## 📚 Additional Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)