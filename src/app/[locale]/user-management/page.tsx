import { UserList } from '@/components/user-management/user-list';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

/**
 * User Management List Page - P4UC02
 * Displays paginated list of users with search and filter capabilities
 */
export default function UserManagementPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <UserList />
      </div>
    </DashboardLayout>
  );
}
