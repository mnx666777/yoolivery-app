import { Tabs } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { totalQuantity } = useCart();
  return (
    <Tabs screenOptions={{ headerTitleAlign: 'center',
      tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      headerStyle: { backgroundColor: colors.bg },
      headerTitleStyle: { color: colors.text },
      headerTintColor: colors.text,
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color, size }) => (<Ionicons name="home" color={color} size={size} />) }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, size }) => (<Ionicons name="search" color={color} size={size} />) }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: totalQuantity > 0 ? String(totalQuantity) : undefined,
          tabBarIcon: ({ color, size }) => (<Ionicons name="cart" color={color} size={size} />),
        }}
      />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ color, size }) => (<Ionicons name="receipt" color={color} size={size} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<Ionicons name="person" color={color} size={size} />) }} />
    </Tabs>
  );
}

