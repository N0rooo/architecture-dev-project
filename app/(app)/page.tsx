import { getUsersService } from '@/services/users/getUserService';
import HomeView from './_views/home';

export default async function page() {
  const { data: user, error } = await getUsersService();
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!user) {
    return <div>No user</div>;
  }
  return <HomeView user={user} />;
}
