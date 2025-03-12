
interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface UserPushSubscription {
  id: string;
  user_id: string;
  subscription: PushSubscriptionJSON;
  created_at: string;
  updated_at: string;
}
