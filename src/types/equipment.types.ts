// Equipment Category Types

import type { ValidationErrorDetail } from './auth.types';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  level: number;
  isActive: boolean;
  createdAt: string;
  childrenCount: number;
}

export interface GetCategoriesListRequest {
  activeOnly?: boolean;
}

export interface GetCategoriesListResponse {
  success: true;
  message: string;
  data: {
    categories: Category[];
  };
}

export interface GetCategoriesRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  hierarchyLevel?: 'top-level' | 'sub-categories' | 'all';
}

export interface EquipmentPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetCategoriesResponse {
  success: true;
  message: string;
  data: {
    categories: Category[];
    pagination: EquipmentPagination;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface CreateCategoryResponse {
  success: true;
  message: string;
  data: {
    categoryId: string;
    name: string;
    description: string | null;
    parentId: string | null;
    level: number;
    isActive: boolean;
  };
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
  parentId?: string | null;
  isActive: boolean;
}

export interface UpdateCategoryResponse {
  success: true;
  message: string;
  data: {
    id: string;
    name: string;
    description: string | null;
    parentId: string | null;
    parentName: string | null;
    level: number;
    isActive: boolean;
    updatedAt: string;
  };
}

export enum EquipmentErrorCode {
  CATEGORY_NAME_EXISTS = 'CATEGORY_NAME_EXISTS',
  INVALID_CATEGORY_NAME = 'INVALID_CATEGORY_NAME',
  CATEGORY_NAME_TOO_SHORT = 'CATEGORY_NAME_TOO_SHORT',
  CATEGORY_NAME_TOO_LONG = 'CATEGORY_NAME_TOO_LONG',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  DESCRIPTION_TOO_LONG = 'DESCRIPTION_TOO_LONG',
  PARENT_CATEGORY_NOT_FOUND = 'PARENT_CATEGORY_NOT_FOUND',
  PARENT_CATEGORY_INACTIVE = 'PARENT_CATEGORY_INACTIVE',
  MAX_HIERARCHY_DEPTH_EXCEEDED = 'MAX_HIERARCHY_DEPTH_EXCEEDED',
  CIRCULAR_REFERENCE_DETECTED = 'CIRCULAR_REFERENCE_DETECTED',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  HIERARCHY_DEPTH_EXCEEDED = 'HIERARCHY_DEPTH_EXCEEDED',
  CANNOT_DEACTIVATE_CATEGORY_WITH_EQUIPMENT = 'CANNOT_DEACTIVATE_CATEGORY_WITH_EQUIPMENT',
  CANNOT_DEACTIVATE_CATEGORY_WITH_ACTIVE_CHILDREN = 'CANNOT_DEACTIVATE_CATEGORY_WITH_ACTIVE_CHILDREN',
  CATEGORY_ALREADY_DEACTIVATED = 'CATEGORY_ALREADY_DEACTIVATED',
  CATEGORY_ALREADY_ACTIVE = 'CATEGORY_ALREADY_ACTIVE',
  CANNOT_DELETE_CATEGORY_WITH_CHILDREN = 'CANNOT_DELETE_CATEGORY_WITH_CHILDREN',
  CANNOT_DELETE_CATEGORY_WITH_EQUIPMENT = 'CANNOT_DELETE_CATEGORY_WITH_EQUIPMENT',
  CATEGORY_ALREADY_DELETED = 'CATEGORY_ALREADY_DELETED',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  // Equipment-specific error codes (P6UC01)
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  CATEGORY_INACTIVE = 'CATEGORY_INACTIVE',
  SERIAL_NUMBER_EXISTS = 'SERIAL_NUMBER_EXISTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  // Equipment details error codes (P6UC03)
  INVALID_EQUIPMENT_ID = 'INVALID_EQUIPMENT_ID',
  EQUIPMENT_NOT_FOUND = 'EQUIPMENT_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  // Equipment update error codes (P6UC04)
  CANNOT_CHANGE_CATEGORY_WITH_BOOKINGS = 'CANNOT_CHANGE_CATEGORY_WITH_BOOKINGS',
  CONCURRENT_UPDATE_DETECTED = 'CONCURRENT_UPDATE_DETECTED',
  EQUIPMENT_ARCHIVED = 'EQUIPMENT_ARCHIVED',
  FORBIDDEN = 'FORBIDDEN',
  // Equipment status and delete error codes (P6UC05)
  EQUIPMENT_ALREADY_ARCHIVED = 'EQUIPMENT_ALREADY_ARCHIVED',
}

export interface EquipmentErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
}

export interface DeactivateCategoryRequest {
  reason?: string;
}

export interface DeactivateCategoryResponse {
  success: true;
  message: string;
  data: {
    id: string;
    name: string;
    isActive: boolean;
    deactivatedAt: string;
  };
}

export interface ReactivateCategoryResponse {
  success: true;
  message: string;
  data: {
    id: string;
    name: string;
    isActive: boolean;
    reactivatedAt: string;
  };
}

export interface DeleteCategoryResponse {
  success: true;
  message: string;
  data: {
    id: string;
    deletedAt: string;
  };
}

// Equipment Types (P6UC01)

/**
 * Equipment status enum
 */
export type EquipmentStatus = 'Available' | 'Rented' | 'Maintenance' | 'Out of Service';

/**
 * Custom attribute for equipment
 */
export interface CustomAttribute {
  key: string;
  value: string;
  unit?: string;
}

/**
 * Request to create equipment
 */
export interface CreateEquipmentRequest {
  name: string;
  categoryId: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  yearOfManufacture?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  status: EquipmentStatus;
  customAttributes?: CustomAttribute[];
}

/**
 * Equipment data in response
 */
export interface Equipment {
  equipmentId: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  yearOfManufacture: number | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
  status: EquipmentStatus;
  customAttributes: CustomAttribute[] | null;
  createdBy: string;
  createdAt: string;
}

/**
 * Response for create equipment
 */
export interface CreateEquipmentResponse {
  success: true;
  message: string;
  data: Equipment;
}

// Equipment List Types (P6UC02)

/**
 * Equipment item in list response
 */
export interface EquipmentListItem {
  id: string;
  name: string;
  categoryId: string;
  categoryPath: string;
  serialNumber: string | null;
  status: EquipmentStatus;
  manufacturer: string | null;
  model: string | null;
  yearOfManufacture: number | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
  description: string | null;
  customAttributes: Record<string, string | number | boolean> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination metadata for equipment list
 */
export interface EquipmentListPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Request parameters for listing equipment
 */
export interface ListEquipmentRequest {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'status' | 'createdAt' | 'purchaseDate';
  sortOrder?: 'asc' | 'desc';
  status?: EquipmentStatus[];
  categoryId?: string[];
  manufacturer?: string;
  searchQuery?: string;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

/**
 * Response for list equipment
 */
export interface ListEquipmentResponse {
  success: true;
  message: string;
  data: {
    items: EquipmentListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Equipment Details Types (P6UC03)

/**
 * Category hierarchy item for breadcrumb
 */
export interface CategoryHierarchyItem {
  id: string;
  name: string;
  level: number;
}

/**
 * Custom attribute for equipment details display
 */
export interface EquipmentCustomAttribute {
  name: string;
  value: string | number | boolean;
  unit: string | null;
}

/**
 * Equipment metadata for audit information
 */
export interface EquipmentMetadata {
  createdBy: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedBy: {
    id: string;
    fullName: string;
  };
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Equipment permissions for current user
 */
export interface EquipmentPermissions {
  canEdit: boolean;
  canDelete: boolean;
}

/**
 * Equipment details response
 */
export interface EquipmentDetails {
  id: string;
  name: string;
  categoryId: string;
  categoryPath: string;
  categoryHierarchy: CategoryHierarchyItem[];
  description: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  yearOfManufacture: number | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
  status: EquipmentStatus;
  customAttributes: EquipmentCustomAttribute[] | null;
  isArchived: boolean;
  metadata: EquipmentMetadata;
  permissions: EquipmentPermissions;
}

/**
 * Response for get equipment details
 */
export interface GetEquipmentDetailsResponse {
  success: true;
  message: string;
  data: EquipmentDetails;
}

// Equipment Update Types (P6UC04)

/**
 * Request to update equipment
 */
export interface UpdateEquipmentRequest {
  name: string;
  categoryId: string;
  description?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  yearOfManufacture?: number | null;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  status: EquipmentStatus;
  customAttributes?: CustomAttribute[];
}

/**
 * Updated equipment data in response
 */
export interface UpdatedEquipment {
  id: string;
  name: string;
  categoryId: string;
  categoryPath: string;
  description: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  yearOfManufacture: number | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
  status: EquipmentStatus;
  customAttributes: Record<string, string | number | boolean> | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

/**
 * Response for update equipment
 */
export interface UpdateEquipmentResponse {
  success: true;
  message: string;
  data: UpdatedEquipment;
}

// Equipment Status Update Types (P6UC05)

/**
 * Request to update equipment status
 */
export interface UpdateEquipmentStatusRequest {
  status: EquipmentStatus;
  reason?: string | null;
}

/**
 * Updated equipment status data in response
 */
export interface UpdatedEquipmentStatus {
  id: string;
  name: string;
  status: EquipmentStatus;
  updatedBy: string;
  updatedAt: string;
}

/**
 * Response for update equipment status
 */
export interface UpdateEquipmentStatusResponse {
  success: true;
  message: string;
  data: UpdatedEquipmentStatus;
}

// Equipment Delete Types (P6UC05)

/**
 * Request to soft delete equipment
 */
export interface SoftDeleteEquipmentRequest {
  reason?: string | null;
}

/**
 * Request to permanently delete equipment
 */
export interface PermanentDeleteEquipmentRequest {
  confirmation: string;
}

/**
 * Soft deleted equipment data in response
 */
export interface SoftDeletedEquipment {
  id: string;
  name: string;
  deletedAt: string;
  deletedBy: string;
}

/**
 * Permanently deleted equipment data in response
 */
export interface PermanentDeletedEquipment {
  id: string;
  name: string;
}

/**
 * Response for soft delete equipment
 */
export interface SoftDeleteEquipmentResponse {
  success: true;
  message: string;
  data: SoftDeletedEquipment;
}

/**
 * Response for permanent delete equipment
 */
export interface PermanentDeleteEquipmentResponse {
  success: true;
  message: string;
  data: PermanentDeletedEquipment;
}
