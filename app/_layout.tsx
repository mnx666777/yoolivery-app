import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { AppStateProvider } from '../context/AppStateContext';
import { AuthProvider } from '../context/AuthContext';
import { OrdersProvider } from '../context/OrdersContext';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <Stack screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTitleStyle: { color: colors.text },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.bg },
            }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
              <Stack.Screen name="gate" options={{ title: 'Verify age' }} />
              <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
              <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
              <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
            </Stack>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </AppStateProvider>
  );
}

