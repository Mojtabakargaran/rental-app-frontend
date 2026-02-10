'use client';

import { EquipmentList } from '@/components/equipment/equipment-list';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function EquipmentInventoryPage() {
  return (
    <DashboardLayout>
      <EquipmentList />
    </DashboardLayout>
  );
}
