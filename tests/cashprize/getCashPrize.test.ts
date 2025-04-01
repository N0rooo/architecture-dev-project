import { getCashPrizeService } from "@/services/cashprize/getCashPrize"
import { createAppServerClient } from "@/supabase/server"
import { faker } from '@faker-js/faker';

// Mock the Supabase client
jest.mock("../../supabase/server", () => ({
  createAppServerClient: jest.fn(),
}))

describe("getCashPrizeService", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return prize data when successful", async () => {
    // Mock data
    const mockPrize = {
      id: 1,
      prize_name: faker.food.fruit(),
      prize_amount: faker.number.int({ min: 1, max: 1000000 }),
    }

    // Mock the Supabase response
    const mockSupabase = {
      rpc: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockPrize,
          error: null,
        }),
      }),
    }

    // Setup the mock implementation
    ;(createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase)

    // Execute the service
    const result = await getCashPrizeService()

    // Assertions
    expect(createAppServerClient).toHaveBeenCalled()
    expect(mockSupabase.rpc).toHaveBeenCalledWith("select_random_prize")
    expect(result).toEqual({
      data: mockPrize,
      error: null,
    })
  })

  it("should return error when Supabase call fails", async () => {
    // Mock error
    const mockError = new Error("Database error")

    // Mock the Supabase response
    const mockSupabase = {
      rpc: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      }),
    }

    // Setup the mock implementation
    ;(createAppServerClient as jest.Mock).mockResolvedValue(mockSupabase)

    // Execute the service
    const result = await getCashPrizeService()

    // Assertions
    expect(createAppServerClient).toHaveBeenCalled()
    expect(mockSupabase.rpc).toHaveBeenCalledWith("select_random_prize")
    expect(result).toEqual({
      data: null,
      error: mockError,
    })
  })
})
