import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, Phone, Mail, HelpCircle, FileText } from 'lucide-react';

interface DisputeData {
  id: string;
  missionId: string;
  reportedBy: string;
  reportedUser: string;
  category: string;
  description: string;
  evidence: string[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  resolution?: string;
  adminNotes?: string;
}

interface DisputeSupportSystemProps {
  missionId: string;
  userId: string;
  otherUserId: string;
  userRole: 'CLIENT' | 'RUNNER';
  onDisputeSubmitted: (dispute: DisputeData) => void;
  onCancel: () => void;
}

const DisputeSupportSystem: React.FC<DisputeSupportSystemProps> = ({
  missionId,
  userId,
  otherUserId,

  onDisputeSubmitted,
  onCancel
}) => {
  const [disputeCategory, setDisputeCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const disputeCategories = [
    {
      id: 'no_show',
      label: 'No Show / Cancellation',
      description: 'Runner didn\'t show up or client cancelled without notice',
      icon: '🚫'
    },
    {
      id: 'quality_issue',
      label: 'Quality Issue',
      description: 'Service quality didn\'t meet expectations',
      icon: '⚠️'
    },
    {
      id: 'payment_dispute',
      label: 'Payment Dispute',
      description: 'Issues with payment or billing',
      icon: '💰'
    },
    {
      id: 'communication',
      label: 'Communication Problem',
      description: 'Poor communication or unresponsiveness',
      icon: '💬'
    },
    {
      id: 'safety_concern',
      label: 'Safety Concern',
      description: 'Safety or security issues',
      icon: '🛡️'
    },
    {
      id: 'equipment_issue',
      label: 'Equipment Problem',
      description: 'Equipment malfunction or setup issues',
      icon: '🔧'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other issues not listed above',
      icon: '❓'
    }
  ];

  const quickResolutions = [
    {
      id: 'partial_refund',
      label: 'Request Partial Refund',
      description: 'Get a partial refund for the service',
      action: 'refund'
    },
    {
      id: 'reschedule',
      label: 'Reschedule Mission',
      description: 'Reschedule the mission for another time',
      action: 'reschedule'
    },
    {
      id: 'replacement_runner',
      label: 'Request Replacement Runner',
      description: 'Get a different runner for the mission',
      action: 'replacement'
    },
    {
      id: 'credit',
      label: 'Request Platform Credit',
      description: 'Get credit for future missions',
      action: 'credit'
    }
  ];

  const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newEvidence = Array.from(files).map(file => URL.createObjectURL(file));
      setEvidence(prev => [...prev, ...newEvidence]);
    }
  };

  const handleSubmit = async () => {
    if (!disputeCategory || !description.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const disputeData: DisputeData = {
        id: `dispute-${Date.now()}`,
        missionId,
        reportedBy: userId,
        reportedUser: otherUserId,
        category: disputeCategory,
        description,
        evidence,
        status: 'open',
        priority,
        timestamp: new Date().toISOString()
      };

      onDisputeSubmitted(disputeData);
    } catch (error) {
      console.error('Dispute submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const canSubmit = disputeCategory && description.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Report an Issue</h2>
            <p className="text-gray-600 mt-1">
              We're here to help resolve any problems with your mission
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Resolution Options */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Resolution</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Before filing a dispute, you might want to try these quick resolution options:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickResolutions.map((resolution) => (
              <button
                key={resolution.id}
                onClick={() => console.log('Quick resolution clicked')}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium text-gray-900">{resolution.label}</div>
                <div className="text-sm text-gray-600">{resolution.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dispute Category */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What type of issue are you experiencing?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {disputeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setDisputeCategory(category.id)}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  disputeCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{category.label}</div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Level */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How urgent is this issue?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'low', label: 'Low', description: 'Minor issue, not urgent' },
              { value: 'medium', label: 'Medium', description: 'Standard priority' },
              { value: 'high', label: 'High', description: 'Important issue' },
              { value: 'urgent', label: 'Urgent', description: 'Critical issue' }
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setPriority(level.value as any)}
                className={`p-3 rounded-lg border transition-colors ${
                  priority === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getPriorityColor(level.value)}`}>
                    {level.label}
                  </div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe the issue</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide detailed information about what happened, when it occurred, and how it affected your experience..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {description.length}/1000 characters
            </p>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Detailed description</span>
            </div>
          </div>
        </div>

        {/* Evidence Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Evidence (Optional)</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleEvidenceUpload}
              className="hidden"
              id="evidence-upload"
            />
            <label htmlFor="evidence-upload" className="cursor-pointer">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload files</p>
                  <p className="text-sm text-gray-500">Photos, documents, or screenshots</p>
                </div>
              </div>
            </label>
          </div>
          
          {evidence.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Evidence:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {evidence.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setEvidence(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Support Options */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-sm text-gray-600">1-800-CLUB-RUN</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">support@clubrun.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Important Guidelines</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Provide accurate and honest information</li>
                <li>• Include relevant evidence when possible</li>
                <li>• We investigate all reports thoroughly</li>
                <li>• False reports may result in account suspension</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeSupportSystem;
