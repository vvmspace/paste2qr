'use client'

import { useState } from 'react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is a QR code?',
      answer: 'A QR (Quick Response) code is a two-dimensional barcode that can store various types of information like text, URLs, contact details, and more. It can be scanned by smartphones to quickly access the encoded information.'
    },
    {
      question: 'How do I use this QR generator?',
      answer: 'Simply paste or type your text into the input field, optionally add a prefix (like https:// for URLs), and click "Generate QR Code". You can then download, copy, or share your QR code instantly.'
    },
    {
      question: 'Can I publish my QR codes?',
      answer: 'Yes! Click "Publish QR Code" to create a shareable page with your QR code. You can add a title, description, and choose the language for your published page.'
    },
    {
      question: 'Is this service really free?',
      answer: 'Absolutely! Our QR code generator is completely free with no registration required. No hidden fees, no limits on usage, and no watermarks on your QR codes.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}










