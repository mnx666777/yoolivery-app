import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { loadJson, saveJson } from '../../utils/storage';
import { colors } from '../../theme/colors';

export default function SearchTab() {
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState<string[]>([]);

  const brandChips = React.useMemo(
    () => ['Whisky','Rum','Beer','Wine','Vodka','Brandy','Old Monk','Kingfisher',"McDowell's"],
    []
  );

  React.useEffect(() => {
    (async () => {
      const r = await loadJson<string[]>('search.recent', []);
      setRecent(r);
    })();
  }, []);

  const pushRecent = React.useCallback(async (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
    setRecent(next);
    await saveJson('search.recent', next);
  }, [recent]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [query]);
  const onSubmit = async () => { await pushRecent(query); };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search beer, wine, spirits..."
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmit}
          autoFocus
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {brandChips.map((label) => (
            <TouchableOpacity key={label} style={styles.chip} onPress={() => { setQuery(label); pushRecent(label); }}>
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {query.length === 0 ? (
        recent.length === 0 ? (
          <View style={styles.center}><Text style={styles.hint}>Type to search products</Text></View>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.sectionTitle}>Recent searches</Text>
            <View style={styles.recentWrap}>
              {recent.map((term) => (
                <TouchableOpacity key={term} style={styles.recentPill} onPress={() => setQuery(term)}>
                  <Text style={styles.recentText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      ) : filtered.length === 0 ? (
        <View style={styles.center}><Text style={{ color: colors.textMuted }}>No results</Text></View>
      ) : (
        <FlatList
          data={filtered}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { padding: 16 },
  search: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.text },
  chipsRow: { gap: 8, marginTop: 12 },
  chip: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  chipText: { color: colors.textMuted, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { color: colors.textMuted },
  sectionTitle: { marginTop: 8, marginBottom: 8, fontWeight: '700', color: colors.text },
  recentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentPill: { backgroundColor: '#111827', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  recentText: { color: colors.text },
});

