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
      // Create formatted addresses with increasing detail levels
      return [
        {
          postcode: data.result.postcode,
          address: `${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.parliamentary_constituency || ''}, ${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.admin_ward || ''}, ${data.result.parliamentary_constituency || ''}, ${data.result.postcode}`
        },
        {
          postcode: data.result.postcode,
          address: `${data.result.admin_ward || ''}, ${data.result.admin_district || ''}, ${data.result.region || ''}, ${data.result.postcode}`
        }
      ].filter(addr => {
        // Remove empty addresses and clean up any leading/trailing commas
        const cleanAddress = addr.address
          .split(',')
          .map(part => part.trim())
          .filter(part => part.length > 0)
          .join(', ');
        
        addr.address = cleanAddress;
        return cleanAddress.length > 0;
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}