import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { colors } from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { saveJson, loadJson } from '../../utils/storage';

function FieldRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '-'}</Text>
    </View>
  );
}

export default function ProfileTab() {
  const { user, updateProfile, logout } = useAuth();
  const { orders } = useOrders();

  const [isEditing, setIsEditing] = React.useState(false);

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
    if (user) await saveJson(`profile.avatar.${user.id}`, undefined as any);
  };

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) return 'Enter a valid email';
    if (phone && !/^\d{7,15}$/.test(phone.trim())) return 'Phone must be numeric (7-15 digits)';
    return null;
  };

  const onSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Invalid details', err);
      return;
    }
    await updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.center}> 
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={[styles.text, { marginBottom: 12 }]}>Please login or register to view your profile.</Text>
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
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: colors.textMuted }}>Avatar</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.smallBtn} onPress={pickAvatar}><Text style={styles.smallBtnText}>{avatarUri ? 'Change' : 'Upload'}</Text></TouchableOpacity>
              {avatarUri && <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#334155' }]} onPress={removeAvatar}><Text style={styles.smallBtnText}>Remove</Text></TouchableOpacity>}
            </View>
          </View>

          {!isEditing ? (
            <>
              <FieldRow label="Full Name" value={user.name} />
              <FieldRow label="Email" value={user.email} />
              <FieldRow label="Phone" value={user.phone} />
              <FieldRow label="Delivery Address" value={user.address} />
              <FieldRow label="Default Payment" value={'Cash on Delivery'} />
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#334155' }]} onPress={logout}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
              <TextInput style={styles.input} placeholder="Phone" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              <TextInput style={styles.input} placeholder="Address" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} />
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#334155' }]} onPress={() => { setIsEditing(false); setName(user.name || ''); setEmail(user.email || ''); setPhone(user.phone || ''); setAddress(user.address || ''); }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Order History</Text>
          {orders.length === 0 ? (
            <View style={styles.center}><Text style={styles.text}>No orders yet</Text></View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.orderId}>Order #{order.id.slice(-6).toUpperCase()}</Text>
                <Text style={styles.rowText}>Placed: {new Date(order.createdAt).toLocaleString()}</Text>
                <View style={styles.itemsList}>
                  {order.items.map((it, idx) => (
                    <View key={idx} style={styles.itemLine}>
                      <Image source={it.product.image} style={styles.itemImg} />
                      <Text style={styles.itemName} numberOfLines={1}>{it.product.name}</Text>
                      <Text style={styles.itemQty}>×{it.quantity}</Text>
                      <Text style={styles.itemPrice}>₹{it.product.priceINR * it.quantity}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.rowText}>Total: ₹{order.totalPriceINR}</Text>
                <Text style={styles.status}>Status: {order.status}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: colors.bg },
  text: { color: colors.textMuted, textAlign: 'center' },

  headerCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, margin: 16, padding: 16 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  avatarWrap: { width: 84, height: 84, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  avatar: { width: '100%', height: '100%', borderRadius: 999 },
  smallBtn: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center', paddingHorizontal: 12 },
  smallBtnText: { color: '#fff', fontWeight: '800' },

  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  fieldLabel: { color: colors.textMuted },
  fieldValue: { color: colors.text, fontWeight: '600', maxWidth: '60%' },

  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#0f172a', color: colors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '800' },

  historyCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginHorizontal: 16, padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  orderCard: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, backgroundColor: colors.card, marginBottom: 12 },
  orderId: { fontWeight: '800', marginBottom: 6, color: colors.text },
  rowText: { color: colors.textMuted, marginBottom: 4 },
  itemsList: { marginVertical: 8, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  itemLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 8 },
  itemImg: { width: 32, height: 32, borderRadius: 6, backgroundColor: '#0f172a' },
  itemName: { flex: 1, color: colors.text, fontSize: 13 },
  itemQty: { color: colors.textMuted, fontSize: 12, marginHorizontal: 8 },
  itemPrice: { color: colors.text, fontWeight: '600', fontSize: 13 },
  status: { color: colors.primary, fontWeight: '700', marginTop: 4 },
});

