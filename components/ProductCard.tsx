import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { colors } from '../theme/colors';

type Props = {
  product: Product;
  onAdd?: (product: Product) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  const { addItem } = useCart();
  return (
    <View style={styles.card}>
      <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={product.image} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      </Link>
      <View style={styles.info}>
        <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
          <TouchableOpacity>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.meta}>{product.brand} • {product.volumeMl}ml{product.abv ? ` • ${product.abv}%` : ''}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>₹{product.priceINR}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => (onAdd ? onAdd(product) : addItem(product))}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 140, backgroundColor: '#0f172a' },
  info: { padding: 12 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  meta: { marginTop: 4, color: colors.textMuted },
  row: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontWeight: '800', color: colors.text },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '700' },
});


