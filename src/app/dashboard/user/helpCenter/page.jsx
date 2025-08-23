import React from 'react';
import { Mail, Facebook, Clock, Zap, Users } from 'lucide-react';
import ChatSup from "@/components/user/ChatSup";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">We're here to help you with any questions or concerns</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Methods */}
        <div className=" gap-8 mb-12">
          {/* Email Contact */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Email Support</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">Tradeconnect@gmail.com</p>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              Response time: 24 hours
            </div>
          </div>

        </div>

        {/* AI Chat Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
          <div className="text-center">
            <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Chat Support</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Get instant answers to your questions with our AI-powered chat support. 
              Available 24/7 for immediate assistance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Responses</h3>
                <p className="text-sm text-gray-600">Get answers immediately, no waiting required</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
                <p className="text-sm text-gray-600">Always here when you need support</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Assistant</h3>
                <p className="text-sm text-gray-600">Trained to handle common questions</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-6">
              💬 Your AI chat support is ready to help! Look for the chat interface to start a conversation.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How quickly will I get a response?</h3>
              <p className="text-gray-600">
                Our AI chat support provides instant responses. For email support, we typically respond within 24 hours. 
                Facebook messages are usually answered within a few hours during business hours.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What can the AI chat help me with?</h3>
              <p className="text-gray-600">
                Our AI assistant can help with common questions, account issues, product information, and basic troubleshooting. 
                For complex issues, it can connect you with our human support team.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is the chat support secure?</h3>
              <p className="text-gray-600">
                Yes, all conversations are encrypted and secure. We follow industry best practices to protect your privacy and data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your existing ChatSup component */}
      <ChatSup />
    </div>
  );
}