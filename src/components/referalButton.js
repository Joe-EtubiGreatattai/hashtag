import { useState } from "react";
import "./../assets/styles/ReferralComponent.css";

const ReferralComponent = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "your-referral-link";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="referral-container">
      <span className="referral-count">16</span>
      <span className="referral-text">Total Referrals</span>
      <button className="copy-button" onClick={copyToClipboard}>
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default ReferralComponent;