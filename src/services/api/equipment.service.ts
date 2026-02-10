import axios from '@/lib/api/axios.config';
import type {
  GetCategoriesListRequest,
  GetCategoriesListResponse,
  GetCategoriesRequest,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeactivateCategoryRequest,
  DeactivateCategoryResponse,
  ReactivateCategoryResponse,
  DeleteCategoryResponse,
  CreateEquipmentRequest,
  CreateEquipmentResponse,
  ListEquipmentRequest,
  ListEquipmentResponse,
  GetEquipmentDetailsResponse,
  UpdateEquipmentRequest,
  UpdateEquipmentResponse,
  UpdateEquipmentStatusRequest,
  UpdateEquipmentStatusResponse,
  SoftDeleteEquipmentRequest,
  SoftDeleteEquipmentResponse,
  PermanentDeleteEquipmentRequest,
  PermanentDeleteEquipmentResponse,
} from '@/types/equipment.types';

class EquipmentService {
  /**
   * GET /api/v1/equipment/categories/list
   * Retrieve active equipment categories for dropdown selection
   */
  async getCategoriesList(
    params?: GetCategoriesListRequest
  ): Promise<GetCategoriesListResponse> {
    const response = await axios.get<GetCategoriesListResponse>(
      '/api/v1/equipment/categories/list',
      { params }
    );
    return response.data;
  }

  /**
   * GET /api/v1/equipment/categories
   * Retrieve paginated equipment categories with search and filters
   */
  async getCategories(
    params?: GetCategoriesRequest
  ): Promise<GetCategoriesResponse> {
    const response = await axios.get<GetCategoriesResponse>(
      '/api/v1/equipment/categories',
      { params }
    );
    return response.data;
  }

  /**
   * POST /api/v1/equipment/categories/create
   * Create new equipment category (company owner or manager only)
   */
  async createCategory(
    data: CreateCategoryRequest
  ): Promise<CreateCategoryResponse> {
    const response = await axios.post<CreateCategoryResponse>(
      '/api/v1/equipment/categories/create',
      data
    );
    return response.data;
  }

  /**
   * PUT /api/v1/equipment/categories/:categoryId
   * Update existing equipment category (company owner or manager only)
   */
  async updateCategory(
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> {
    const response = await axios.put<UpdateCategoryResponse>(
      `/api/v1/equipment/categories/${categoryId}`,
      data
    );
    return response.data;
  }

  /**
   * PUT /api/v1/equipment/categories/:categoryId/deactivate
   * Deactivate equipment category (company owner or manager only)
   */
  async deactivateCategory(
    categoryId: string,
    data: DeactivateCategoryRequest
  ): Promise<DeactivateCategoryResponse> {
    const response = await axios.put<DeactivateCategoryResponse>(
      `/api/v1/equipment/categories/${categoryId}/deactivate`,
      data
    );
    return response.data;
  }

  /**
   * PUT /api/v1/equipment/categories/:categoryId/reactivate
   * Reactivate equipment category (company owner or manager only)
   */
  async reactivateCategory(
    categoryId: string
  ): Promise<ReactivateCategoryResponse> {
    const response = await axios.put<ReactivateCategoryResponse>(
      `/api/v1/equipment/categories/${categoryId}/reactivate`,
      {}
    );
    return response.data;
  }

  /**
   * DELETE /api/v1/equipment/categories/:categoryId
   * Permanently delete equipment category (soft delete - company owner or manager only)
   */
  async deleteCategory(
    categoryId: string
  ): Promise<DeleteCategoryResponse> {
    const response = await axios.delete<DeleteCategoryResponse>(
      `/api/v1/equipment/categories/${categoryId}`
    );
    return response.data;
  }

  /**
   * POST /api/v1/equipment
   * Create new equipment item in tenant's inventory (P6UC01)
   */
  async createEquipment(
    data: CreateEquipmentRequest
  ): Promise<CreateEquipmentResponse> {
    const response = await axios.post<CreateEquipmentResponse>(
      '/api/v1/equipment',
      data
    );
    return response.data;
  }

  /**
   * GET /api/v1/equipment
   * Retrieve paginated list of equipment items with filters and search (P6UC02)
   */
  async listEquipment(
    params?: ListEquipmentRequest
  ): Promise<ListEquipmentResponse> {
    const response = await axios.get<ListEquipmentResponse>(
      '/api/v1/equipment',
      { params }
    );
    return response.data;
  }

  /**
   * GET /api/v1/equipment/:equipmentId
   * Retrieve detailed information about a specific equipment item (P6UC03)
   */
  async getEquipmentDetails(
    equipmentId: string
  ): Promise<GetEquipmentDetailsResponse> {
    const response = await axios.get<GetEquipmentDetailsResponse>(
      `/api/v1/equipment/${equipmentId}`
    );
    return response.data;
  }

  /**
   * PUT /api/v1/equipment/:equipmentId
   * Update existing equipment item information (P6UC04)
   */
  async updateEquipment(
    equipmentId: string,
    data: UpdateEquipmentRequest
  ): Promise<UpdateEquipmentResponse> {
    const response = await axios.put<UpdateEquipmentResponse>(
      `/api/v1/equipment/${equipmentId}`,
      data
    );
    return response.data;
  }

  /**
   * PATCH /api/v1/equipment/:equipmentId/status
   * Update equipment status with optional reason (P6UC05)
   */
  async updateEquipmentStatus(
    equipmentId: string,
    data: UpdateEquipmentStatusRequest
  ): Promise<UpdateEquipmentStatusResponse> {
    const response = await axios.patch<UpdateEquipmentStatusResponse>(
      `/api/v1/equipment/${equipmentId}/status`,
      data
    );
    return response.data;
  }

  /**
   * DELETE /api/v1/equipment/:equipmentId?type=soft
   * Soft delete equipment (archive) with optional reason (P6UC05)
   */
  async softDeleteEquipment(
    equipmentId: string,
    data?: SoftDeleteEquipmentRequest
  ): Promise<SoftDeleteEquipmentResponse> {
    const response = await axios.delete<SoftDeleteEquipmentResponse>(
      `/api/v1/equipment/${equipmentId}`,
      {
        params: { type: 'soft' },
        data,
      }
    );
    return response.data;
  }

  /**
   * DELETE /api/v1/equipment/:equipmentId?type=permanent
   * Permanently delete equipment with confirmation (P6UC05)
   */
  async permanentDeleteEquipment(
    equipmentId: string,
    data: PermanentDeleteEquipmentRequest
  ): Promise<PermanentDeleteEquipmentResponse> {
    const response = await axios.delete<PermanentDeleteEquipmentResponse>(
      `/api/v1/equipment/${equipmentId}`,
      {
        params: { type: 'permanent' },
        data,
      }
    );
    return response.data;
  }
}

export const equipmentService = new EquipmentService();
