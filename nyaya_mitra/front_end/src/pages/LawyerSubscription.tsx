
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const LawyerSubscription = () => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePaymentComplete = () => {
    // In a real application, this would verify the payment with Stripe
    toast.success("Payment verified successfully!");
    setPaymentCompleted(true);
  };

  const handleSubmitForReview = () => {
    setSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Profile submitted for review!");
    }, 1500);
  };

  return (
    <PageLayout>
      <SEO title="Complete Your Registration" description="Finalize your lawyer profile by completing payment" />
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Complete Your Registration</h1>
          
          {submitted ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
              <p className="text-gray-700 mb-8">
                Your profile is under review. After evaluation, your listing will appear on the 'Find a Lawyer' page.
                This process typically takes 1-2 business days. We'll notify you by email when your profile is approved.
              </p>
              <div className="border-t border-gray-200 pt-6 mt-4">
                <h3 className="font-medium mb-3">What happens next?</h3>
                <ol className="text-left text-gray-600 space-y-2">
                  <li>1. Our team reviews your profile and credentials</li>
                  <li>2. You'll receive an email when approved</li>
                  <li>3. Your profile will be published in our directory</li>
                  <li>4. You can login to update your information anytime</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold mb-6">Please Complete Your Payment</h2>
                <p className="text-gray-700 mb-8">
                  To activate your profile and make it visible to potential clients, please complete the payment process below.
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm mb-10">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">Lawyer Directory Listing - Annual Subscription</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Annual Subscription Fee</span>
                    <span className="font-medium">$299.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">$19.99</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center font-medium text-lg">
                    <span>Total</span>
                    <span>$318.99</span>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-medium mb-4">What you get:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <span className="text-gray-700">Featured profile in our Lawyer Directory for one year</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <span className="text-gray-700">Direct inquiries from potential clients</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <span className="text-gray-700">Profile analytics and visibility insights</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                {!paymentCompleted ? (
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Simulate Payment (In real app: "Proceed to Payment")
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitForReview}
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {submitting ? 'Submitting...' : 'Payment Done – Submit Profile for Review'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LawyerSubscription;
