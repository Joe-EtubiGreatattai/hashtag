import { useState, useEffect } from "react";
import "./../assets/styles/ReferralComponent.css";

const ReferralComponent = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    // Encode referral code to avoid URL-related issues
    const baseUrl = "https://t.me/Hashtag001bot/";
    const link = `${baseUrl}?start=${encodeURIComponent(referralCode)}`;
    setReferralLink(link);

    // Fetch referral count
    fetchReferralCount();
  }, [referralCode]);

  const fetchReferralCount = async () => {
    try {
      const response = await fetch(`/api/referrals/count?code=${referralCode}`);
      const data = await response.json();
      setReferralCount(data.count);
    } catch (error) {
      console.error("Error fetching referral count:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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
