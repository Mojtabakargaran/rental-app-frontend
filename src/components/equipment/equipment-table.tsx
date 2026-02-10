'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Eye, MoreVertical, Edit, Archive, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArchiveEquipmentDialog } from './archive-equipment-dialog';
import { DeleteEquipmentPermanentlyDialog } from './delete-equipment-permanently-dialog';
import type { EquipmentListItem, EquipmentStatus } from '@/types/equipment.types';
import { formatDateShort } from '@/utils/date.util';

interface EquipmentTableProps {
  items: EquipmentListItem[];
  sortBy: 'name' | 'status' | 'createdAt' | 'purchaseDate';
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: 'name' | 'status' | 'createdAt' | 'purchaseDate') => void;
}

const statusVariants: Record<EquipmentStatus, 'default' | 'active' | 'inactive'> = {
  Available: 'active',
  Rented: 'default',
  Maintenance: 'default',
  'Out of Service': 'inactive',
};

export function EquipmentTable({ items, sortBy, sortOrder, onSortChange }: EquipmentTableProps) {
  const t = useTranslations('equipment-inventory.list');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const queryClient = useQueryClient();

  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{ id: string; name: string } | null>(null);

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="size-4 inline ml-1" />
    ) : (
      <ChevronDown className="size-4 inline ml-1" />
    );
  };

  const handleViewEquipment = (equipmentId: string) => {
    router.push(`/${locale}/equipment-inventory/${equipmentId}`);
  };

  const handleArchiveClick = (id: string, name: string) => {
    setSelectedEquipment({ id, name });
    setArchiveDialogOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedEquipment({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleArchiveSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['equipment'] });
    setArchiveDialogOpen(false);
    setSelectedEquipment(null);
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['equipment'] });
    setDeleteDialogOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-start text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSortChange('name')}
              >
                {t('table.columns.name')}
                <SortIcon field="name" />
              </th>
              <th className="px-4 py-3 text-start text-sm font-medium text-gray-900">
                {t('table.columns.category')}
              </th>
              <th className="px-4 py-3 text-start text-sm font-medium text-gray-900">
                {t('table.columns.serialNumber')}
              </th>
              <th
                className="px-4 py-3 text-start text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSortChange('status')}
              >
                {t('table.columns.status')}
                <SortIcon field="status" />
              </th>
              <th className="px-4 py-3 text-start text-sm font-medium text-gray-900">
                {t('table.columns.manufacturer')}
              </th>
              <th className="px-4 py-3 text-start text-sm font-medium text-gray-900">
                {t('table.columns.model')}
              </th>
              <th
                className="px-4 py-3 text-start text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSortChange('purchaseDate')}
              >
                {t('table.columns.purchaseDate')}
                <SortIcon field="purchaseDate" />
              </th>
              <th
                className="px-4 py-3 text-start text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSortChange('createdAt')}
              >
                {t('table.columns.createdAt')}
                <SortIcon field="createdAt" />
              </th>
              <th className="px-4 py-3 text-start text-sm font-medium text-gray-900">
                {t('table.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.categoryPath}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.serialNumber || t('table.noSerialNumber')}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[item.status]}>
                    {t(`filters.status.${item.status}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.manufacturer || t('table.noSerialNumber')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.model || t('table.noSerialNumber')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDateShort(item.purchaseDate, locale, t('table.noSerialNumber'))}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDateShort(item.createdAt, locale)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewEquipment(item.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/equipment-inventory/${item.id}/edit`)}>
                          <Edit className="h-4 w-4 me-2" />
                          {t('table.actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-amber-700"
                          onClick={() => handleArchiveClick(item.id, item.name)}
                        >
                          <Archive className="h-4 w-4 me-2" />
                          {t('table.actions.archive')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(item.id, item.name)}
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          {t('table.actions.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {selectedEquipment && (
        <>
          <ArchiveEquipmentDialog
            equipmentId={selectedEquipment.id}
            equipmentName={selectedEquipment.name}
            open={archiveDialogOpen}
            onOpenChange={setArchiveDialogOpen}
            onSuccess={handleArchiveSuccess}
          />

          <DeleteEquipmentPermanentlyDialog
            equipmentId={selectedEquipment.id}
            equipmentName={selectedEquipment.name}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
}
