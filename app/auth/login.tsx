import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    const ok = await login(email, password);
    if (!ok) setError('Invalid credentials');
    else router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Welcome back</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry value={password} onChangeText={setPassword} />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.row}> 
          <Text style={{ color: colors.textMuted }}>New here?</Text>
          <Link href="/auth/register">Create account</Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  box: { width: '92%', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 16, padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a', color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12 },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '800' },
  row: { flexDirection: 'row', gap: 8, marginTop: 12, alignItems: 'center' },
  error: { color: '#f87171', marginBottom: 8 },
});


