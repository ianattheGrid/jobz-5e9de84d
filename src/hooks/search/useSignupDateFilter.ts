
export const useSignupDateFilter = () => {
  const getSignupDateFilter = (period: string) => {
    const now = new Date();
    switch (period) {
      case "24h":
        return new Date(now.setHours(now.getHours() - 24));
      case "1w":
        return new Date(now.setDate(now.getDate() - 7));
      case "1m":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3m":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6m":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "12m":
        return new Date(now.setMonth(now.getMonth() - 12));
      default:
        return null;
    }
  };

  const buildSignupDateQuery = (query: any, signupPeriod: string) => {
    const signupDate = getSignupDateFilter(signupPeriod);
    if (signupDate) {
      query = query.gte('signup_date', signupDate.toISOString());
    }
    return query;
  };

  return { buildSignupDateQuery };
};
