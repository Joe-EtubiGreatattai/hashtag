import { useState, useEffect } from "react";
import "./../assets/styles/ReferralComponent.css";

const ReferralComponent = () => {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    // Get referral code from localStorage
    const storedReferralCode = localStorage.getItem("referralCode") || "defaultCode";
    
    // Generate Telegram referral link
    const baseUrl = "https://t.me/Hashtag001bot/startapp";
    const link = `${baseUrl}?start=${encodeURIComponent(storedReferralCode)}`;
    setReferralLink(link);

    // Fetch referral count
    fetchReferralCount(storedReferralCode);
  }, []);

  const fetchReferralCount = async (code) => {
    try {
      const response = await fetch(`/api/referrals/count?code=${code}`);
      const data = await response.json();
      setReferralCount(data.count);
    } catch (error) {
      console.error("Error fetching referral count:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
