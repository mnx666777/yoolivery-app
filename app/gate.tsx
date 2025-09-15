import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { colors } from '../theme/colors';

const districts = ['Imphal West', 'Imphal East', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati', 'Ukhrul', 'Chandel', 'Tamenglong', 'Jiribam', 'Kangpokpi', 'Tengnoupal', 'Noney', 'Pherzawl'] as const;

export default function Gate() {
  const router = useRouter();
  const { isAdultConfirmed, confirmAdult, district, setDistrict } = useAppState();

  const canContinue = isAdultConfirmed && !!district;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Are you 21 or older?</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.choice, isAdultConfirmed && styles.choiceActive]} onPress={confirmAdult}>
            <Text style={styles.choiceText}>Yes</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { marginTop: 24 }]}>Select your district</Text>
        <ScrollView style={{ maxHeight: 220 }}>
          <View style={styles.districtList}>
            {districts.map((d) => (
              <TouchableOpacity key={d} style={[styles.districtItem, district === d && styles.districtActive]} onPress={() => setDistrict(d)}>
                <Text style={styles.districtText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={!canContinue}
          style={[styles.continue, !canContinue && { opacity: 0.5 }]}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  box: { width: '92%', borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  choice: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a' },
  choiceActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  choiceText: { fontWeight: '700', color: colors.text },
  districtList: { gap: 8, marginTop: 6 },
  districtItem: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a' },
  districtActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  districtText: { color: colors.text },
  continue: { marginTop: 24, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#fff', fontWeight: '800' },
});


