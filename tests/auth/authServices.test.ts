import { loginService, signupService, logoutService } from "@/services/auth/authServices";
import { createAppServerClient } from "@/supabase/server";
import { faker } from "@faker-js/faker";

jest.mock("../../supabase/server", () => ({
  createAppServerClient: jest.fn(),
}));

describe("Auth Services", () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  };

  const mockEmail = faker.internet.email();
  const mockPassword = faker.internet.password();
  beforeEach(() => {
    (createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("loginService", () => {
    it("should successfully login a user", async () => {
      const mockResponse = { data: { user: { id: "123" } }, error: null };
      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      const result = await loginService(mockEmail, mockPassword);
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeNull();
    });

    it("should handle login errors", async () => {
      const mockError = new Error("Invalid credentials");
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: mockError });

      const result = await loginService(mockEmail, mockPassword);
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("signupService", () => {
    it("should successfully sign up a user", async () => {
      const mockResponse = { data: { user: { id: "123" } }, error: null };
      mockSupabase.auth.signUp.mockResolvedValue(mockResponse);

      const result = await signupService(mockEmail, mockPassword);
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeNull();
    });

    it("should handle signup errors", async () => {
      const mockError = new Error("Email already exists");
      mockSupabase.auth.signUp.mockResolvedValue({ data: null, error: mockError });

      const result = await signupService(mockEmail, mockPassword);
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("logoutService", () => {
    it("should successfully log out a user", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await logoutService();
      expect(result.data).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should handle logout errors", async () => {
      const mockError = new Error("Logout failed");
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError });

      const result = await logoutService();
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });
});