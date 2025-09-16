import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';

export default function CheckoutScreen() {
  const { items, totalPriceINR, clear } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const router = useRouter();
  const [address, setAddress] = React.useState(user?.address || '');

  const disabled = items.length === 0 || !address.trim();

  const onPlaceOrder = async () => {
    if (disabled) return;
    await placeOrder({ items, totalPriceINR, address: address.trim(), paymentMethod: 'COD' });
    clear();
    Alert.alert('Order placed', 'Your order has been placed with Cash on Delivery.');
    router.replace('/(tabs)/orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.label}>Delivery address</Text>
        <TextInput
          style={styles.input}
          placeholder="House/Street, Area, District, PIN"
          placeholderTextColor={colors.textMuted}
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment</Text>
          <Text style={{ color: colors.text }}>Cash on Delivery</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.total}>₹{totalPriceINR}</Text>
        </View>
        <TouchableOpacity style={[styles.placeBtn, disabled && { opacity: 0.5 }]} disabled={disabled} onPress={onPlaceOrder}>
          <Text style={styles.placeText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  box: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12, color: colors.text },
  label: { fontWeight: '700', marginTop: 8, marginBottom: 6, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, minHeight: 80, color: colors.text },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  summaryLabel: { color: colors.textMuted },
  total: { fontWeight: '800', color: colors.text },
  placeBtn: { marginTop: 20, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  placeText: { color: '#fff', fontWeight: '800' },
});


