import { useState } from 'react';
import { toast } from 'sonner';
import { FileDown, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

interface FormData {
  landlord_name: string;
  landlord_address: string;
  tenant_name: string;
  rental_address: string;
  monthly_rent: string;
  months_unpaid: string;
  agreement_date: string;
  payment_days: string;
  vacate_days: string;
}

const LegalNoticeGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    landlord_name: '',
    landlord_address: '',
    tenant_name: '',
    rental_address: '',
    monthly_rent: '',
    months_unpaid: '',
    agreement_date: '',
    payment_days: '15',
    vacate_days: '30'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      // Send data to Flask backend
      const response = await axios.post(
        'http://localhost:5200/generate',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Download the generated document
        const downloadResponse = await axios.get(response.data.download_url, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        setGenerated(true);
        toast.success("Legal notice generated successfully!");
      } else {
        toast.error(response.data.error || "Failed to generate document");
      }
    } catch (error) {
      console.error("Generation error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to generate document");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Legal Notice Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate formal legal notices for tenant disputes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Landlord Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
                Landlord Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="landlord_name"
                  value={formData.landlord_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address*
                </label>
                <textarea
                  name="landlord_address"
                  value={formData.landlord_address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Tenant Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
                Tenant Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant Name*
                </label>
                <input
                  type="text"
                  name="tenant_name"
                  value={formData.tenant_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rental Property Address*
                </label>
                <textarea
                  name="rental_address"
                  value={formData.rental_address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Rent Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
                Rent Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Rent (₹)*
                </label>
                <input
                  type="number"
                  name="monthly_rent"
                  value={formData.monthly_rent}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unpaid Months*
                </label>
                <input
                  type="text"
                  name="months_unpaid"
                  value={formData.months_unpaid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agreement Date*
                </label>
                <input
                  type="date"
                  name="agreement_date"
                  value={formData.agreement_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Notice Period */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2">
                Notice Period
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Deadline (days)*
                </label>
                <input
                  type="number"
                  name="payment_days"
                  value={formData.payment_days}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vacation Notice (days)*
                </label>
                <input
                  type="number"
                  name="vacate_days"
                  value={formData.vacate_days}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Legal Notice
                  <FileDown className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {generated && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              <span className="font-semibold">Notice Generated Successfully!</span>
            </div>
            <p className="text-sm">Check your downloads for the generated document.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalNoticeGenerator;