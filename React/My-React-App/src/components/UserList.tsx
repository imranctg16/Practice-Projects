import { useUserContext } from '../providers/UserProvider';

import UserTable from './UserTable';

function UserList() {
  const { setShow, users, editUser, deleteUser, isLoading, isSubmitting, error, refetch, userStats } = useUserContext();

  return (
    <UserTable
      users={users}
      isLoading={isLoading}
      error={error}
      isSubmitting={isSubmitting}
      setShow={setShow}
      editUser={editUser}
      deleteUser={deleteUser}
      refetch={refetch}
      userStats={userStats}
    />
  );
}

export default UserList;