import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [dob, setDob] = React.useState(''); // YYYY-MM-DD
  const [aadhaarLast4, setAadhaarLast4] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      await register({ name, email, password, phone, address, dob, aadhaarLast4 });
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Create your account</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor={colors.textMuted} value={dob} onChangeText={setDob} />
        <TextInput style={styles.input} placeholder="Aadhaar last 4 digits" placeholderTextColor={colors.textMuted} keyboardType="number-pad" value={aadhaarLast4} onChangeText={setAadhaarLast4} maxLength={4} />
        <TextInput style={styles.input} placeholder="Phone (optional)" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Address (optional)" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
  error: { color: '#f87171', marginBottom: 8 },
});


