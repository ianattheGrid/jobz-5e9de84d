interface Address {
  postcode: string;
  address: string;
}

export async function lookupAddresses(postcode: string): Promise<Address[]> {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch addresses');
    }
    
    if (data.result) {
      return data.result.map((pc: string) => ({
        postcode: pc,
        address: pc
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}