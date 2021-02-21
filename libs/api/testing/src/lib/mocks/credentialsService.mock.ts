export const mockCredentialsService = {
  async createAccessToken(): Promise<string> {
    return "MOCK_ACCESS_TOKEN";
  },
  async createRefreshToken(): Promise<string> {
    return "MOCK_REFRESH_TOKEN";
  },
};
