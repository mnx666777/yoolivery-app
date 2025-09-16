import { Redirect } from 'expo-router';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const { isAdultConfirmed, district } = useAppState();
  if (!user) return <Redirect href="/welcome" />;
  const hasAccess = isAdultConfirmed && !!district;
  return <Redirect href={hasAccess ? '/(tabs)/home' : '/gate'} />;
}

