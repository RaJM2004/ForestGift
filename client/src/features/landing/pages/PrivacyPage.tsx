import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';

export const PrivacyPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick, onContactClick }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight border-b border-gray-100 pb-6">
              Privacy <span className="text-[#247114]">Policy</span>
            </h1>

            {/* Intro */}
            <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
              <p>
                forest website is owned by{' '}
                <span className="font-bold text-gray-950">Copse future solution</span>, which is a data controller of your personal data.
              </p>
              <p>
                We have adopted this Privacy Policy, which determines how we are processing the information collected by forest, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using forest website.
              </p>
              <p>
                We take care of your personal data and undertake to guarantee its confidentiality and security.
              </p>
            </div>

            {/* Personal Information we collect */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal information we collect:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  When you visit the forest, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as “Device Information.” Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.
                </p>
              </div>
            </div>

            {/* Why do we process your data */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why do we process your data?</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.
                </p>
                <p>
                  You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website’s features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website’s features. For example, you won’t be able to receive our Newsletter or contact us directly from the website. Users who are uncertain about what information is mandatory are welcome to contact us via{' '}
                  <a href="mailto:giftsfromforest@gmail.com" className="text-[#247114] hover:underline font-bold">
                    giftsfromforest@gmail.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your rights:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>If you are a European resident, you have the following rights related to your personal data:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>The right to be informed.</li>
                  <li>The right of access.</li>
                  <li>The right to rectification.</li>
                  <li>The right to erasure.</li>
                  <li>The right to restrict processing.</li>
                  <li>The right to data portability.</li>
                  <li>The right to object.</li>
                  <li>Rights in relation to automated decision-making and profiling.</li>
                </ul>
                <p>
                  If you would like to exercise this right, please contact us through the contact information below.
                </p>
                <p>
                  Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information might be transferred outside of Europe, including Canada and the United States.
                </p>
              </div>
            </div>

            {/* Links to other websites */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Links to other websites:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties' privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.
                </p>
              </div>
            </div>

            {/* Information security */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Information security:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed.
                </p>
              </div>
            </div>

            {/* Legal disclosure */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Legal disclosure:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
                </p>
              </div>
            </div>

            {/* Contact information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contact information:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to individual rights and your Personal Information, you may send an email to{' '}
                  <a href="mailto:giftsfromforest@gmail.com" className="text-[#247114] hover:underline font-bold">
                    giftsfromforest@gmail.com
                  </a>.
                </p>
              </div>
            </div>

          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
};
