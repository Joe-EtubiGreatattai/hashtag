import { useState, useEffect } from "react";
import "./../assets/styles/ReferralComponent.css";

const ReferralComponent = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    // Generate the referral link
    const baseUrl = "https://t.me/Hashtag001bot/"; // Replace with your app's signup URL
    const link = `${baseUrl}?ref=${referralCode}`;
    setReferralLink(link);

    // Fetch the referral count from the backend
    fetchReferralCount();
  }, [referralCode]);

  const fetchReferralCount = async () => {
    try {
      const response = await fetch("/referral-count");
      const data = await response.json();
      setReferralCount(data.count);
    } catch (error) {
      console.error("Error fetching referral count:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div className="referral-container">
      <span className="referral-count">{referralCount}</span>
      <span className="referral-text">Total Referrals</span>
      <button className="copy-button" onClick={copyToClipboard}>
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default ReferralComponent;