import React from "react";
import { useAuth } from "../../context/useAuth";
import { showSuccess, showAuthRequired } from "../../utils";
import subscriptionsData from "../../api/subscriptions.json";
import PageHeader from "../../components/user/PageHeader";
import ActiveSubscription from "../../components/user/ActiveSubscription";
import SubscriptionFeatures from "../../components/user/SubscriptionFeatures";
import SubscriptionPlans from "../../components/user/SubscriptionPlans";

const Subscriptions = () => {
  const { isLoggedIn, currentUser } = useAuth();

  const handleSubscribe = (planId, planName) => {
    if (!isLoggedIn) {
      showAuthRequired();
      return;
    }
    showSuccess(`Successfully subscribed to ${planName}!`);
  };

  const subscriptionFeatures = [
    {
      icon: "bi-house-door",
      title: "Private Space Access",
      description:
        "Exclusive access to our premium private spaces for work or relaxation",
    },
    {
      icon: "bi-gift",
      title: "Free Coffee Powder",
      description:
        "Take home premium coffee powder with every subscription tier",
    },
    {
      icon: "bi-star",
      title: "Priority Service",
      description: "Skip the queue with priority seating and faster service",
    },
    {
      icon: "bi-heart",
      title: "Personalized Experience",
      description: "Custom recommendations based on your taste preferences",
    },
  ];

  const userSubscription = currentUser?.subscription;

  return (
    <>
      <PageHeader
        title="Premium Subscriptions"
        subtitle="Unlock exclusive perks, private spaces, and special benefits with our subscription plans"
        icon="bi bi-crown"
      />

      {userSubscription && userSubscription.status === "active" && (
        <ActiveSubscription subscription={userSubscription} />
      )}

      <SubscriptionFeatures features={subscriptionFeatures} />

      <SubscriptionPlans
        plans={subscriptionsData}
        onSubscribe={handleSubscribe}
        currentSubscription={userSubscription}
      />
    </>
  );
};

export default Subscriptions;
