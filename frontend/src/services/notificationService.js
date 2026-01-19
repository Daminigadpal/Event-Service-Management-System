import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Mock notification service - simulates sending emails and SMS
export const notificationService = {
  // Send email notification
  async sendEmail(data) {
    try {
      // Mock API call - in real implementation, this would call backend
      console.log('📧 Sending Email:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      return {
        success: true,
        messageId: `EMAIL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        recipient: data.to,
        subject: data.subject,
        status: 'sent'
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send SMS notification
  async sendSMS(data) {
    try {
      // Mock API call - in real implementation, this would call backend
      console.log('📱 Sending SMS:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return {
        success: true,
        messageId: `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        recipient: data.to,
        status: 'sent'
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send bulk notifications
  async sendBulkNotifications(notifications) {
    const results = [];
    
    for (const notification of notifications) {
      if (notification.type === 'email') {
        const result = await this.sendEmail(notification.data);
        results.push({ ...notification, result });
      } else if (notification.type === 'sms') {
        const result = await this.sendSMS(notification.data);
        results.push({ ...notification, result });
      }
    }
    
    return results;
  },

  // Get notification templates
  getTemplates() {
    return {
      bookingConfirmation: {
        email: {
          subject: 'Booking Confirmed - Event Management System',
          body: 'Dear {name},\n\nYour booking for {eventType} on {date} has been confirmed.\n\nBooking Details:\n- Event Type: {eventType}\n- Date: {date}\n- Venue: {venue}\n- Budget: {budget}\n\nThank you for choosing our services!\n\nBest regards,\nEvent Management Team'
        },
        sms: 'Your booking for {eventType} on {date} has been confirmed. Booking ID: {bookingId}'
      },
      paymentReminder: {
        email: {
          subject: 'Payment Reminder - Event Management System',
          body: 'Dear {name},\n\nThis is a reminder that payment of {amount} is due for your {eventType} booking.\n\nDue Date: {dueDate}\nAmount: {amount}\nBooking ID: {bookingId}\n\nPlease make the payment to avoid any inconvenience.\n\nBest regards,\nEvent Management Team'
        },
        sms: 'Payment reminder: {amount} due for {eventType} booking by {dueDate}. Booking ID: {bookingId}'
      },
      eventReminder: {
        email: {
          subject: 'Event Reminder - Event Management System',
          body: 'Dear {name},\n\nThis is a reminder about your upcoming {eventType} event scheduled for {date}.\n\nEvent Details:\n- Event Type: {eventType}\n- Date: {date}\n- Time: {time}\n- Venue: {venue}\n\nWe look forward to making your event memorable!\n\nBest regards,\nEvent Management Team'
        },
        sms: 'Reminder: Your {eventType} event is on {date} at {time} at {venue}. Event ID: {eventId}'
      },
      staffAssignment: {
        email: {
          subject: 'New Assignment - Event Management System',
          body: 'Dear {staffName},\n\nYou have been assigned to a new event:\n\nEvent Details:\n- Event Type: {eventType}\n- Date: {date}\n- Time: {time}\n- Venue: {venue}\n- Client: {clientName}\n\nPlease confirm your availability and prepare accordingly.\n\nBest regards,\nEvent Management Team'
        },
        sms: 'New assignment: {eventType} event on {date} at {venue}. Client: {clientName}. Please confirm availability.'
      }
    };
  }
};

export default notificationService;
