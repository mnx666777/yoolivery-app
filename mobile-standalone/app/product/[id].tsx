import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { colors } from '../../theme/colors';

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <View style={styles.center}> 
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={product.image} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.brand} • {product.volumeMl}ml{product.abv ? ` • ${product.abv}%` : ''}</Text>
        <Text style={styles.price}>₹{product.priceINR}</Text>
        <Text style={styles.origin}>{product.origin}</Text>
        {typeof product.rating === 'number' && (
          <Text style={styles.rating}>Rating: {product.rating.toFixed(1)} / 5</Text>
        )}
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
        <TouchableOpacity style={styles.addButton} onPress={() => addItem(product)}>
          <Text style={styles.addText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 32, backgroundColor: colors.bg },
  image: { width: '100%', height: 300, backgroundColor: '#0f172a' },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  meta: { marginTop: 6, color: colors.textMuted },
  price: { marginTop: 12, fontSize: 18, fontWeight: '800', color: colors.text },
  origin: { marginTop: 6, color: colors.textMuted },
  rating: { marginTop: 10, color: colors.text, fontWeight: '700' },
  description: { marginTop: 8, color: colors.textMuted, lineHeight: 20 },
  addButton: { marginTop: 16, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


