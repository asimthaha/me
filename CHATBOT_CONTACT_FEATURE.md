# Chatbot Contact Form Feature

## Overview
The portfolio chatbot includes an integrated contact form feature that allows visitors to submit contact inquiries directly through the conversational interface. This feature provides a natural, user-friendly way to collect contact information while maintaining robust security measures.

## Features

### 1. Conversational Flow
- **Natural Language Processing**: The chatbot detects contact intent from user messages
- **Progressive Data Collection**: Collects name, email, and message step-by-step
- **Real-time Validation**: Validates each field as it's collected with friendly error messages
- **Confirmation Screen**: Shows summary of collected data and requires explicit confirmation
- **Cancel Anytime**: Users can cancel the flow at any point by typing "cancel" or "stop"

### 2. Data Validation

#### Name Validation
- Minimum: 2 characters
- Maximum: 100 characters
- Allowed characters: Letters, spaces, hyphens, apostrophes
- Example: "John Doe", "Mary-Jane O'Brien"

#### Email Validation
- Must be valid email format (user@domain.com)
- Maximum: 255 characters
- Standard RFC email validation

#### Message Validation
- Minimum: 10 characters
- Maximum: 1000 characters
- No URLs allowed (http://, https://, www.)
- No excessive special characters (max 10)
- Spam keyword filtering

### 3. Security Safeguards

#### Rate Limiting
- **Chat Rate Limit**: 10 requests per minute per IP
- **Contact Form Rate Limit**: 3 submissions per hour per IP
- Returns 429 status with retry-after header when exceeded

#### Spam Prevention
- Keyword filtering (blocks common spam terms)
- Special character count validation
- URL detection and blocking
- Message content analysis

#### Duplicate Submission Detection
- Prevents identical submissions within 5-minute window
- Compares email + message combination
- Returns friendly error message if duplicate detected

#### Input Sanitization
- Removes potentially harmful characters
- Trims whitespace
- Strips HTML tags (<, >)

### 4. Data Storage
All contact submissions are saved to the `contact_submissions` table with:
- `id`: UUID (auto-generated)
- `name`: Validated user name
- `email`: Validated email address
- `message`: Validated message content
- `ip_address`: Submitter IP (for rate limiting/security)
- `user_agent`: Set to 'Chatbot' for chatbot submissions
- `status`: Set to 'new' by default
- `created_at`: Timestamp (auto-generated)
- `updated_at`: Timestamp (auto-updated)

### 5. Email Notifications

#### Admin Notification
Sent to portfolio owner containing:
- Sender name
- Sender email
- Message content
- Submission ID
- Timestamp

#### User Confirmation
Sent to user containing:
- Thank you message
- Confirmation of message receipt
- Expected response time

## User Experience Flow

1. **Intent Detection**
   - User mentions contact-related keywords
   - Chatbot enters contact flow mode
   - Progress indicator appears showing 3 steps

2. **Data Collection**
   ```
   Bot: "I'd be happy to help you get in touch! What's your name?"
   User: "John Doe"
   Bot: "Thanks John! What's your email address?"
   User: "john@example.com"
   Bot: "Great! What would you like to say?"
   User: "I'm interested in working together."
   ```

3. **Confirmation**
   ```
   Bot: "Here's what I'll send:
        Name: John Doe
        Email: john@example.com
        Message: I'm interested in working together.
        
        Type 'yes' to confirm, or 'cancel' to cancel."
   User: "yes"
   ```

4. **Success**
   ```
   Bot: "Thank you! Your message has been sent successfully. 
        I'll get back to you soon! 🎉"
   ```

## Error Handling

### Validation Errors
- Clear, specific error messages for each validation failure
- Allows user to retry with corrected information
- Maintains context throughout correction process

### Rate Limit Errors
- Friendly message explaining the limit
- Shows retry-after time
- Automatically exits contact flow

### Duplicate Submission
- Prevents accidental re-submissions
- Clear message explaining 5-minute cooldown
- Maintains good user experience

### System Errors
- Generic error message for unexpected failures
- Errors logged server-side for debugging
- User can retry or exit flow

## Technical Implementation

### Frontend (`src/components/PortfolioChatbot.tsx`)
- React component with state management for contact flow
- Real-time message extraction and validation
- Visual progress indicator
- Cancel button functionality

### Backend (`supabase/functions/portfolio-chat/index.ts`)
- Gemini AI integration for natural language processing
- Comprehensive input validation functions
- Rate limiting with in-memory store
- Duplicate detection via database query
- Supabase integration for data persistence
- EmailJS integration for notifications

## Required Environment Variables

### Supabase Secrets
- `GOOGLE_API_KEY`: Gemini AI API key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `EMAILJS_SERVICE_ID`: EmailJS service ID
- `EMAILJS_TEMPLATE_ID`: Admin notification template ID
- `EMAILJS_TEMPLATE_USER_ID`: User confirmation template ID
- `EMAILJS_PUBLIC_KEY`: EmailJS public key

## Monitoring & Maintenance

### Logs to Monitor
- Contact form submission attempts
- Validation failures
- Rate limit hits
- Duplicate submission attempts
- Email sending failures
- Edge function errors

### Regular Maintenance
1. Review contact submissions in Supabase dashboard
2. Monitor rate limiting effectiveness
3. Update spam keyword list as needed
4. Check email delivery success rates
5. Review and respond to contact submissions

## Future Enhancements
- File attachment support
- Phone number collection (optional)
- Custom validation rules per form
- Integration with CRM systems
- Advanced spam detection (ML-based)
- Multi-language support
- Automated response templates
- Priority/urgency indicators

## Troubleshooting

### Contact Form Not Working
1. Check Supabase edge function logs
2. Verify all environment variables are set
3. Check rate limiting isn't blocking legitimate users
4. Verify EmailJS templates are configured

### Emails Not Sending
1. Verify EmailJS credentials in Supabase secrets
2. Check EmailJS dashboard for failed sends
3. Verify template IDs match configuration
4. Check email template variables match code

### Duplicate Detection Too Strict
1. Adjust 5-minute window in `checkDuplicateSubmission`
2. Consider comparing only email instead of email + message
3. Add override mechanism for legitimate duplicates

## Contact
For issues or questions about this feature, check:
- Edge function logs: [Supabase Dashboard](https://supabase.com/dashboard/project/efznnmazwqlkaxcsgoqy/functions/portfolio-chat/logs)
- Database records: contact_submissions table
- Email delivery: EmailJS dashboard
