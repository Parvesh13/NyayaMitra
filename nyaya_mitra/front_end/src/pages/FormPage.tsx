
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  legalIssue: string;
  issueCategory: string;
  description: string;
  urgency: string;
  termsAccepted: boolean;
}

const FormPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    legalIssue: '',
    issueCategory: 'civil',
    description: '',
    urgency: 'medium',
    termsAccepted: false,
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Fixed: Properly handle checkbox vs text/select inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked, // Now correctly setting a boolean value for checkboxes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field when user types
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const validateStep = (currentStep: number) => {
    const newErrors: Partial<FormData> = {};
    
    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = 'Name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = 'Enter a valid 10-digit Indian phone number';
      }
      if (!formData.state) newErrors.state = 'State is required';
    }
    
    if (currentStep === 2) {
      if (!formData.legalIssue) newErrors.legalIssue = 'Legal issue title is required';
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = 'Please provide more details (at least 20 characters)';
      }
    }
    
    if (currentStep === 3) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms to proceed';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fix the errors before proceeding");
      
      // Shake animation for form
      const formElement = document.getElementById('legal-form');
      formElement?.classList.add('animate-shake');
      setTimeout(() => {
        formElement?.classList.remove('animate-shake');
      }, 500);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(3)) {
      // Save form data to localStorage for the PDF Generator page
      localStorage.setItem('legalFormData', JSON.stringify(formData));
      
      toast.success("Form submitted successfully!");
      
      // Navigate to PDF generator page
      setTimeout(() => {
        navigate('/pdf-generator');
      }, 1000);
    }
  };
  
  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-down">
            <h1 className="text-3xl font-bold mb-2">Legal Assistance Form</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Provide your information to get personalized legal assistance.
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((stepNumber) => (
                <div 
                  key={stepNumber} 
                  className={`flex-1 flex flex-col items-center ${stepNumber < 3 ? 'relative' : ''}`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stepNumber < step 
                        ? 'bg-green-500 text-white' 
                        : stepNumber === step 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    } font-medium text-lg transition-colors duration-300`}
                  >
                    {stepNumber < step ? <CheckCircle size={18} /> : stepNumber}
                  </div>
                  <span 
                    className={`text-sm mt-2 ${
                      stepNumber <= step ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {stepNumber === 1 ? 'Personal Info' : stepNumber === 2 ? 'Legal Issue' : 'Review'}
                  </span>
                  
                  {/* Connecting line */}
                  {stepNumber < 3 && (
                    <div 
                      className="absolute h-0.5 w-full top-5 left-1/2 -z-10"
                      style={{ background: `linear-gradient(to right, ${stepNumber < step ? '#10b981' : stepNumber === step ? '#8B5CF6' : '#d1d5db'} 50%, ${stepNumber + 1 <= step ? '#10b981' : stepNumber + 1 === step ? '#8B5CF6' : '#d1d5db'} 50%)` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div 
            id="legal-form"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 animate-scale-in"
          >
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`input-field ${errors.fullName ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className={`input-field ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter 10-digit phone number"
                        className={`input-field ${errors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State/Union Territory*
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`input-field ${errors.state ? 'border-red-500 dark:border-red-500' : ''}`}
                      >
                        <option value="">Select your state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Legal Issue Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="legalIssue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Legal Issue Title*
                      </label>
                      <input
                        type="text"
                        id="legalIssue"
                        name="legalIssue"
                        value={formData.legalIssue}
                        onChange={handleChange}
                        placeholder="E.g. Rental agreement dispute"
                        className={`input-field ${errors.legalIssue ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {errors.legalIssue && (
                        <p className="text-red-500 text-sm mt-1">{errors.legalIssue}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="issueCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        id="issueCategory"
                        name="issueCategory"
                        value={formData.issueCategory}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="civil">Civil Law</option>
                        <option value="criminal">Criminal Law</option>
                        <option value="family">Family Law</option>
                        <option value="property">Property Law</option>
                        <option value="consumer">Consumer Rights</option>
                        <option value="employment">Employment Law</option>
                        <option value="constitutional">Constitutional Law</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Detailed Description*
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Please describe your legal issue in detail..."
                        className={`input-field ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formData.description.length} characters (minimum 20)
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Urgency Level
                      </label>
                      <div className="flex items-center space-x-4">
                        {['low', 'medium', 'high'].map((level) => (
                          <label key={level} className="flex items-center">
                            <input
                              type="radio"
                              name="urgency"
                              value={level}
                              checked={formData.urgency === level}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            <span className="capitalize">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Review Your Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {formData.fullName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>State:</strong> {formData.state}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Legal Issue</h3>
                      <div className="space-y-2">
                        <p><strong>Issue:</strong> {formData.legalIssue}</p>
                        <p><strong>Category:</strong> {formData.issueCategory}</p>
                        <p><strong>Urgency:</strong> {formData.urgency}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Issue Description</h3>
                    <p className="text-gray-600 dark:text-gray-300">{formData.description}</p>
                  </div>
                  
                  <div className="mt-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                        I understand that this is a demo form and not actual legal advice. In a real application, this would contain terms and conditions and privacy policy agreement text.
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-10 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-outline"
                  >
                    Back
                  </button>
                ) : <div></div>}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
