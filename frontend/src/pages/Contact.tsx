import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Send
} from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-tech-black pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-tech-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Have questions about Club Run? Want to learn more? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="tech-input"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="tech-input"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="tech-input"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select className="tech-input">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Feature Request</option>
                    <option>Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    className="tech-input h-32 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button type="submit" className="tech-button-primary w-full">
                  <Send className="w-4 h-4 mr-2 inline" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-text-secondary mb-8">
                  Reach out to us through any of these channels. We're here to help you get the most out of your running journey.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tech-cyan bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-tech-cyan" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-text-secondary">hello@clubrun.ai</p>
                    <p className="text-text-secondary text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tech-green bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-tech-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-text-secondary">+1 (555) 123-4567</p>
                    <p className="text-text-secondary text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tech-purple bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-tech-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-text-secondary">San Francisco, CA</p>
                    <p className="text-text-secondary text-sm">Visit our office by appointment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tech-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-tech-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-text-secondary">Available 24/7</p>
                    <p className="text-text-secondary text-sm">Get instant help from our AI assistant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-tech-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary">
              Find answers to common questions about Club Run
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">How does AI coaching work?</h3>
              <p className="text-text-secondary text-sm">
                Our AI analyzes your running data, goals, and progress to create personalized training plans and provide real-time feedback.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">Is Club Run free to use?</h3>
              <p className="text-text-secondary text-sm">
                We offer both free and premium plans. The free plan includes basic features, while premium unlocks advanced AI coaching and analytics.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">Can I sync with my fitness tracker?</h3>
              <p className="text-text-secondary text-sm">
                Yes! Club Run integrates with popular fitness trackers and apps including Apple Watch, Garmin, Strava, and more.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">How do community challenges work?</h3>
              <p className="text-text-secondary text-sm">
                Join challenges with friends or other runners, compete on leaderboards, and earn rewards for achieving milestones together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;