
export const useSignupDateFilter = () => {
  const getSignupDateFilter = (period: string) => {
    const now = new Date();
    switch (period) {
      case "24h":
        return new Date(now.setHours(now.getHours() - 24));
      case "48h":
        return new Date(now.setHours(now.getHours() - 48));
      case "1w":
        return new Date(now.setDate(now.getDate() - 7));
      case "2w":
        return new Date(now.setDate(now.getDate() - 14));
      case "4w":
        return new Date(now.setDate(now.getDate() - 28));
      case "3m":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6m+":
        return new Date(now.setMonth(now.getMonth() - 6));
      default:
        return null;
    }
  };

  const buildSignupDateQuery = (query: any, signupPeriod: string) => {
    const signupDate = getSignupDateFilter(signupPeriod);
    if (signupDate) {
      if (signupPeriod === "6m+") {
        query = query.lte('signup_date', signupDate.toISOString());
      } else {
        query = query.gte('signup_date', signupDate.toISOString());
      }
    }
    return query;
  };

  return { buildSignupDateQuery };
};
