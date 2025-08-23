const OpenAI = require('openai');

class ResearchAgent {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    });
  }

  /**
   * Enriches a venue address with detailed information using GPT
   * @param {string} address - The venue address to research
   * @returns {Promise<Object>} Enriched venue details
   */
  async enrichVenueWithGPT(address) {
    try {
      const prompt = `Provide a comprehensive summary for the following address: ${address}

Please include the following information in JSON format:
- neighborhood_profile: Brief description of the neighborhood
- safety_info: Safety considerations and crime statistics if available
- parking_info: Parking options, restrictions, and recommendations
- local_restrictions: Any special laws, noise ordinances, or restrictions
- nearby_amenities: Hotels, landmarks, restaurants, and useful locations
- special_tips: Any insider tips or important notes for visitors
- accessibility: Public transport, accessibility features
- estimated_travel_time: Approximate travel time from major areas

Format the response as valid JSON with these exact keys.`;

      const completion = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content;
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          address: address,
          enriched_data: parsed,
          timestamp: new Date().toISOString(),
          model_used: process.env.AI_MODEL || 'gpt-4o-mini'
        };
      } catch (parseError) {
        // If JSON parsing fails, return structured text
        return {
          success: true,
          address: address,
          enriched_data: {
            raw_response: content,
            neighborhood_profile: "Information available",
            safety_info: "Check local resources",
            parking_info: "Verify on-site",
            local_restrictions: "Check local ordinances",
            nearby_amenities: "Explore area",
            special_tips: "Plan ahead",
            accessibility: "Contact venue",
            estimated_travel_time: "Varies by location"
          },
          timestamp: new Date().toISOString(),
          model_used: process.env.AI_MODEL || 'gpt-4o-mini',
          parse_error: parseError.message
        };
      }
    } catch (error) {
      console.error('Research Agent Error:', error);
      return {
        success: false,
        address: address,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Batch process multiple addresses
   * @param {string[]} addresses - Array of addresses to research
   * @returns {Promise<Object[]>} Array of enriched venue details
   */
  async batchEnrichVenues(addresses) {
    const results = [];
    
    for (const address of addresses) {
      const result = await this.enrichVenueWithGPT(address);
      results.push(result);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Get cached venue data if available
   * @param {string} address - The venue address
   * @returns {Promise<Object|null>} Cached venue data or null
   */
  async getCachedVenueData(address) {
    // This would integrate with your database to check for cached results
    // For now, return null to always fetch fresh data
    return null;
  }

  /**
   * Cache venue data for future use
   * @param {string} address - The venue address
   * @param {Object} data - The enriched venue data
   * @returns {Promise<boolean>} Success status
   */
  async cacheVenueData(address, data) {
    // This would integrate with your database to cache results
    // For now, just return true
    return true;
  }
}

module.exports = ResearchAgent; 