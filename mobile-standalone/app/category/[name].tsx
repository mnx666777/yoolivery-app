import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { colors } from '../../theme/colors';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const list = products.filter((p) => p.category.toLowerCase() === String(name || '').toLowerCase());
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>{String(name)}</Text></View>
      <FlatList
        data={list}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
});


