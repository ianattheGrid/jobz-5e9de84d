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
      // Create multiple formatted addresses with different levels of detail
      return [
        {
          postcode: data.result.postcode,
          address: `${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.admin_ward || ''}, ${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.admin_ward || ''}, ${data.result.admin_district || ''}, ${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.admin_ward || ''}, ${data.result.admin_district || ''}, ${data.result.region || ''}, ${data.result.postcode}`
        }
      ].filter(addr => addr.address.trim().replace(/^,\s*/, '').length > 0); // Remove empty addresses
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}