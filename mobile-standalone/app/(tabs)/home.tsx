import { Image, SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { useAppState } from '../../context/AppStateContext';
import { colors } from '../../theme/colors';
import { Link } from 'expo-router';
import React from 'react';
import { apiService } from '../../services/api';

const allCategories = ['All','Beer','Wine','Whisky','Rum','Vodka','Brandy'] as const;

export default function HomeTab() {
  const { district } = useAppState();
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<(typeof allCategories)[number]>('All');
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadProducts();
  }, [category, query]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        category: category === 'All' ? undefined : category,
        search: query.trim() || undefined,
        limit: 50
      });
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Yoolivery</Text>
            <Text style={styles.subtitle}>Delivering across {district || 'Manipur'}</Text>
          </View>
        </View>

        <TextInput
          placeholder="Search beer, wine, spirits..."
          style={styles.search}
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
        />

        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoriesRow}>
          {allCategories.map((label) => (
            <TouchableOpacity key={label} style={[styles.categoryChip, category === label && styles.categoryChipActive]} onPress={() => setCategory(label)}>
              <Text style={[styles.categoryText, category === label && styles.categoryTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesRow}>
          {['Whisky','Rum','Vodka','Beer','Wine'].map((cat) => (
            <Link key={cat} href={`/category/${cat}`} asChild>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Popular {district ? `in ${district}` : 'near you'}</Text>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Top picks for tonight</Text>
          <Text style={styles.heroSub}>Handpicked bottles and brands with great ratings</Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={{
                  id: p.id,
                  name: p.name,
                  brand: p.brand,
                  category: p.category.name,
                  volumeMl: p.volumeMl,
                  priceINR: p.price / 100, // Convert from paise to INR
                  image: { uri: p.image },
                  abv: p.abv,
                  origin: p.origin,
                  rating: p.rating,
                  description: p.description
                }} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { width: 48, height: 48, marginRight: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: colors.text },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: { color: colors.textMuted, fontWeight: '600' },
  categoryChipActive: { backgroundColor: colors.primary },
  categoryTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  gridItem: { width: '50%', padding: 8 },
  hero: { marginTop: 8, marginBottom: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  heroTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  heroSub: { color: colors.textMuted, marginTop: 6 },
  loadingContainer: { padding: 20, alignItems: 'center' },
  loadingText: { color: colors.textMuted },
});

