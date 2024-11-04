import React from 'react'
import PolicyDialog from './PolicyDialog'
import termsOfPolicy from '../data/terms-of-service.json'
import privacyPolicy from '../data/privacy-policy.json'

const termsOfServiceSections = termsOfPolicy.sections;
const termsOfServiceTitle = termsOfPolicy.title;

  const privacyPolicySections = privacyPolicy.sections;
  const privacyPolicyTitle = privacyPolicy.title;


const Footer: React.FC = () => {
  return (
    <footer className="py-6 w-full shrink-0 px-4 md:px-6 border-t">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">© 2024 ThiSo. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <PolicyDialog 
            title= {termsOfServiceTitle}
            sections={termsOfServiceSections} 
            triggerText="Terms of Service"
          />
          <PolicyDialog 
            title={privacyPolicyTitle}
            sections={privacyPolicySections} 
            triggerText="Privacy Policy"
          />
        </nav>
      </div>
    </footer>
  )
}

export default Footer
