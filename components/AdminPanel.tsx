import React from 'react';
import { useUser, useClerk, useUsers } from '@clerk/clerk-react';
import { Shield, UserPlus, Users, Key } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface UserRowProps {
  userId: string;
  email: string;
  role: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ userId, email, role, onRoleChange }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
    <div>
      <p className="text-white font-medium">{email}</p>
      <p className="text-sm text-slate-400">ID: {userId}</p>
    </div>
    <div className="flex items-center space-x-2">
      <select
        value={role}
        onChange={(e) => onRoleChange(userId, e.target.value)}
        className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-1"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
      </select>
    </div>
  </div>
);

export const AdminPanel: React.FC = () => {
  const { user: currentUser } = useUser();
  const { users } = useUsers();
  const { setActive } = useClerk();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Get the user from the users list
      const user = users?.find(u => u.id === userId);
      if (!user) return;

      // Update the user's public metadata with their new role
      await user.update({
        publicMetadata: { role: newRole },
      });

      // If changing own role, trigger a session update
      if (userId === currentUser?.id) {
        await setActive({ session: currentUser.session });
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management Section */}
        <Card
          title={
            <>
              <Users className="mr-2 h-5 w-5 text-sky-400" />
              User Management
            </>
          }
          className="col-span-1"
          titleClassName="flex items-center"
        >
          <div className="space-y-4">
            {users?.map((user) => (
              <UserRow
                key={user.id}
                userId={user.id}
                email={user.primaryEmailAddress?.emailAddress || ''}
                role={user.publicMetadata.role as string || 'user'}
                onRoleChange={handleRoleChange}
              />
            ))}
          </div>
        </Card>

        {/* Access Control Section */}
        <Card
          title={
            <>
              <Shield className="mr-2 h-5 w-5 text-sky-400" />
              Access Control
            </>
          }
          className="col-span-1"
          titleClassName="flex items-center"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-lg font-medium text-white mb-2">Role Permissions</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300"><strong>Admin:</strong> Full system access, user management, API key management</p>
                <p className="text-slate-300"><strong>Moderator:</strong> Content moderation, view analytics</p>
                <p className="text-slate-300"><strong>User:</strong> Basic platform access and content generation</p>
              </div>
            </div>
          </div>
        </Card>

        {/* API Key Management Section */}
        <Card
          title={
            <>
              <Key className="mr-2 h-5 w-5 text-sky-400" />
              API Key Management
            </>
          }
          className="col-span-2"
          titleClassName="flex items-center"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h4 className="text-lg font-medium text-white mb-2">System API Keys</h4>
              <p className="text-sm text-slate-300 mb-4">
                Manage and monitor API key usage across the platform.
              </p>
              <Button
                onClick={() => {/* Add API key management logic */}}
                className="bg-sky-600 hover:bg-sky-500 text-white"
              >
                <Key className="h-4 w-4 mr-2" />
                Manage API Keys
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
