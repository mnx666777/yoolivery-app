import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

export default function CartTab() {
  const { items, setQuantity, removeItem, totalPriceINR, clear } = useCart();
  const router = useRouter();
  const isEmpty = items.length === 0;
  return (
    <SafeAreaView style={styles.container}>
      {isEmpty ? (
        <View style={styles.center}> 
          <Text style={styles.text}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => it.product.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(item.product.id, item.quantity - 1)}>
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(item.product.id, item.quantity + 1)}>
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.product.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹{totalPriceINR}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.textMuted },
  itemRow: { backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.border, padding: 12 },
  itemName: { fontWeight: '700', color: colors.text, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyText: { minWidth: 24, textAlign: 'center', color: colors.text },
  remove: { color: '#f87171' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontWeight: '800', color: colors.text },
  checkoutBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  checkoutText: { color: '#fff', fontWeight: '800' },
});

