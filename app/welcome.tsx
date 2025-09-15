import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../theme/colors';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Welcome to Yoolivery</Text>
        <Text style={styles.subtitle}>Fast alcohol delivery across Manipur</Text>
        <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.buttonsRow}>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={[styles.primary, styles.half]}>
              <Text style={styles.primaryText}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/auth/register" asChild>
            <TouchableOpacity style={[styles.secondary, styles.half]}>
              <Text style={styles.secondaryText}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 180, height: 180, marginVertical: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { marginTop: 6, color: colors.textMuted, textAlign: 'center' },
  buttonsRow: { width: '100%', marginTop: 20, flexDirection: 'row', gap: 12 },
  primary: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '800' },
  secondary: { backgroundColor: '#334155', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center' },
  secondaryText: { color: colors.text, fontWeight: '800' },
  half: { flex: 1 },
});


