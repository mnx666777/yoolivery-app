import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { saveJson, loadJson } from '../../utils/storage';

export default function ProfileTab() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [address, setAddress] = React.useState(user?.address || '');
  const [avatarUri, setAvatarUri] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
    (async () => {
      if (user) {
        const uri = await loadJson<string | undefined>(`profile.avatar.${user.id}`, undefined);
        setAvatarUri(uri);
      }
    })();
  }, [user]);

  const onSave = async () => {
    await updateProfile({ name, email, phone, address });
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      if (user) await saveJson(`profile.avatar.${user.id}`, uri);
    }
  };

  const removeAvatar = async () => {
    setAvatarUri(undefined);
    if (user) await saveJson(`profile.avatar.${user.id}`, undefined);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.center}> 
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={[styles.text, { marginBottom: 12 }]}>Please login or register to manage your profile.</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Link href="/auth/login" asChild>
              <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            </Link>
            <Link href="/auth/register" asChild>
              <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Your Profile</Text>
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: colors.textMuted }}>Add photo</Text>
              </View>
            )}
          </View>
          <View style={{ gap: 8, flex: 1 }}>
            <TouchableOpacity style={styles.smallBtn} onPress={pickAvatar}><Text style={styles.smallBtnText}>{avatarUri ? 'Change Photo' : 'Upload Photo'}</Text></TouchableOpacity>
            {avatarUri && <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#334155' }]} onPress={removeAvatar}><Text style={styles.smallBtnText}>Remove Photo</Text></TouchableOpacity>}
          </View>
        </View>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Phone" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Address" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} />
        <TouchableOpacity style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#334155' }]} onPress={logout}>
          <Text style={[styles.buttonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: colors.bg },
  text: { color: colors.textMuted, textAlign: 'center' },
  box: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12, color: colors.text },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatarWrap: { width: 84, height: 84, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  avatar: { width: '100%', height: '100%', borderRadius: 999 },
  smallBtn: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  smallBtnText: { color: '#fff', fontWeight: '800' },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a', color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12 },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '800' },
});

