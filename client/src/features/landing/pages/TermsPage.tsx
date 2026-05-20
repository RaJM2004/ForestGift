import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';

export const TermsPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick, onContactClick }) => {
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
              Terms and <span className="text-[#247114]">Conditions</span>
            </h1>

            {/* Intro */}
            <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
              <p>Welcome to forest!</p>
              <p>
                These terms and conditions outline the rules and regulations for the use of Copse future solution's Website, located at{' '}
                <a href="https://forestgift.in" target="_blank" rel="noopener noreferrer" className="text-[#247114] hover:underline font-bold">
                  https://forestgift.in
                </a>.
              </p>
              <p>
                By accessing this website, we assume you accept these terms and conditions. Do not continue to use forest if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>

            {/* Cookies */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cookies:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  The website uses cookies to help personalize your online experience. By accessing forest, you agreed to use the required cookies.
                </p>
                <p>
                  A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you.
                </p>
                <p>
                  We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the ability to accept or decline optional Cookies. There are some required Cookies that are necessary for the operation of our website. These cookies do not require your consent as they always work. Please keep in mind that by accepting required Cookies, you also accept third-party Cookies, which might be used via third-party provided services if you use such services on our website, for example, a video display window provided by third parties and integrated into our website.
                </p>
              </div>
            </div>

            {/* License */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">License:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  Unless otherwise stated, Copse future solution and/or its licensors own the intellectual property rights for all material on forest. All intellectual property rights are reserved. You may access this from forest for your own personal use subjected to restrictions set in these terms and conditions.
                </p>
                <p className="font-bold text-gray-900">You must not:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Copy or republish material from forest</li>
                  <li>Sell, rent, or sub-license material from forest</li>
                  <li>Reproduce, duplicate or copy material from forest</li>
                  <li>Redistribute content from forest</li>
                </ul>
                <p>This Agreement shall begin on the date hereof.</p>
                <p>
                  Parts of this website offer users an opportunity to post and exchange opinions and information in certain areas of the website. Copse future solution does not filter, edit, publish or review Comments before their presence on the website. Comments do not reflect the views and opinions of Copse future solution, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, Copse future solution shall not be liable for the Comments or any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
                </p>
                <p>
                  Copse future solution reserves the right to monitor all Comments and remove any Comments that can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
                </p>
                <p className="font-bold text-gray-900">You warrant and represent that:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                  <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent, or trademark of any third party;</li>
                  <li>The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy;</li>
                  <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
                </ul>
                <p>
                  You hereby grant Copse future solution a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats, or media.
                </p>
              </div>
            </div>

            {/* Hyperlinking */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hyperlinking to our Content:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p className="font-bold text-gray-900">The following organizations may link to our Website without prior written approval:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Government agencies;</li>
                  <li>Search engines;</li>
                  <li>News organizations;</li>
                  <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                  <li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
                </ul>
                <p>
                  These organizations may link to our home page, to publications, or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                </p>
                <p className="font-bold text-gray-900">We may consider and approve other link requests from the following types of organizations:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Commonly-known consumer and/or business information sources;</li>
                  <li>Dot.com community sites;</li>
                  <li>Associations or other groups representing charities;</li>
                  <li>Online directory distributors;</li>
                  <li>Internet portals;</li>
                  <li>Accounting, law, and consulting firms; and</li>
                  <li>Educational institutions and trade associations.</li>
                </ul>
                <p>
                  We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Copse future solution; and (d) the link is in the context of general resource information.
                </p>
                <p>
                  These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
                </p>
                <p>
                  If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Copse future solution. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
                </p>
                <p className="font-bold text-gray-900">Approved organizations may hyperlink to our Website as follows:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>By use of our corporate name; or</li>
                  <li>By use of the uniform resource locator being linked to; or</li>
                  <li>Using any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.</li>
                </ul>
                <p>
                  No use of Copse future solution's logo or other artwork will be allowed for linking absent a trademark license agreement.
                </p>
              </div>
            </div>

            {/* Content Liability */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Content Liability:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                </p>
              </div>
            </div>

            {/* Reservation of Rights */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reservation of Rights:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                </p>
              </div>
            </div>

            {/* Removal of links */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Removal of links from our website:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to do so or to respond to you directly.
                </p>
                <p>
                  We do not ensure that the information on this website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Disclaimer:</h2>
              <div className="space-y-4 text-base text-gray-600 leading-relaxed font-medium">
                <p>
                  To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Limit or exclude our or your liability for death or personal injury;</li>
                  <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                  <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                  <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                </ul>
                <p>
                  The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
                </p>
                <p>
                  As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
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
