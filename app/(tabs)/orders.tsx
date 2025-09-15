import { SafeAreaView, StyleSheet, Text, FlatList, View } from 'react-native';
import { useOrders } from '../../context/OrdersContext';
import { colors } from '../../theme/colors';

export default function OrdersTab() {
  const { orders } = useOrders();
  const isEmpty = orders.length === 0;
  return (
    <SafeAreaView style={styles.container}>
      {isEmpty ? (
        <View style={styles.center}><Text style={styles.text}>No orders yet</Text></View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
              <Text style={styles.rowText}>Placed: {new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.rowText}>Items: {item.items.reduce((s, it) => s + it.quantity, 0)}</Text>
              <Text style={styles.rowText}>Total: ₹{item.totalPriceINR}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.address}>Deliver to: {item.address}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.textMuted },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, backgroundColor: colors.card, marginBottom: 12 },
  orderId: { fontWeight: '800', marginBottom: 6, color: colors.text },
  rowText: { color: colors.textMuted, marginBottom: 4 },
  status: { color: colors.primary, fontWeight: '700', marginTop: 4 },
  address: { color: colors.textMuted, marginTop: 6 },
});

