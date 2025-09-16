import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.buttonsRow}>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={[styles.half]} activeOpacity={0.9}>
              <LinearGradient colors={[colors.primary, '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBtn}>
                <Text style={styles.primaryText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
          <Link href="/auth/register" asChild>
            <TouchableOpacity style={[styles.half]} activeOpacity={0.9}>
              <View style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Register</Text>
              </View>
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
  logo: { width: 200, height: 200, marginBottom: 24 },
  buttonsRow: { width: '100%', marginTop: 8, flexDirection: 'row', gap: 12, justifyContent: 'center' },
  gradientBtn: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  primaryText: { color: '#fff', fontWeight: '800' },
  secondaryBtn: { backgroundColor: '#1f2937', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  secondaryText: { color: colors.text, fontWeight: '800' },
  half: { flex: 1 },
});


