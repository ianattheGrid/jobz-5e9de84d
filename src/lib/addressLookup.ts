interface Address {
  postcode: string;
  address: string;
}

export async function lookupAddresses(postcode: string): Promise<Address[]> {
  try {
    // First validate the postcode
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
    const validationData = await response.json();
    
    if (!response.ok || !validationData.result) {
      throw new Error('Invalid postcode');
    }

    // Then fetch addresses for the validated postcode
    const addressResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await addressResponse.json();
    
    if (!addressResponse.ok) {
      throw new Error(data.error || 'Failed to fetch addresses');
    }
    
    if (data.result) {
      // Create a formatted address from the API response
      const address = {
        postcode: data.result.postcode,
        address: `${data.result.postcode}, ${data.result.admin_district}, ${data.result.region}`
      };
      
      return [address];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}