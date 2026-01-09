import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { generateId } from '@/utils/format';

export const ProfileScreen = () => {
  const { user, role, setUserRole, updateUserProfile, updateAddresses } = useAppStore((state) => ({
    user: state.user,
    role: state.role,
    setUserRole: state.setUserRole,
    updateUserProfile: state.updateUserProfile,
    updateAddresses: state.updateAddresses
  }));
  const roleLabel = role === 'operator' ? 'operatore' : 'cliente';
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profilo</Text>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Dati personali</Text>
          <TextInput
            placeholder="Nome"
            placeholderTextColor={colors.textSubtle}
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Cognome"
            placeholderTextColor={colors.textSubtle}
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textSubtle}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Telefono"
            placeholderTextColor={colors.textSubtle}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <PrimaryButton
            label="SALVA PROFILO"
            onPress={() =>
              updateUserProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim()
              })
            }
            variant="secondary"
          />
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Preferenze</Text>
          <Text style={styles.meta}>Nessuna preferenza salvata.</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Indirizzi salvati</Text>
          {user.addresses.length === 0 ? <Text style={styles.meta}>Nessun indirizzo.</Text> : null}
          {user.addresses.map((address) => (
            <View key={address.id} style={styles.addressBlock}>
              <TextInput
                placeholder="Via"
                placeholderTextColor={colors.textSubtle}
                value={address.street}
                onChangeText={(value) =>
                  updateAddresses(
                    user.addresses.map((item) =>
                      item.id === address.id ? { ...item, street: value } : item
                    )
                  )
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Numero"
                placeholderTextColor={colors.textSubtle}
                value={address.number}
                onChangeText={(value) =>
                  updateAddresses(
                    user.addresses.map((item) =>
                      item.id === address.id ? { ...item, number: value } : item
                    )
                  )
                }
                style={styles.input}
              />
              <TextInput
                placeholder="CAP"
                placeholderTextColor={colors.textSubtle}
                value={address.zip}
                onChangeText={(value) =>
                  updateAddresses(
                    user.addresses.map((item) => (item.id === address.id ? { ...item, zip: value } : item))
                  )
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Citta"
                placeholderTextColor={colors.textSubtle}
                value={address.city}
                onChangeText={(value) =>
                  updateAddresses(
                    user.addresses.map((item) => (item.id === address.id ? { ...item, city: value } : item))
                  )
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Note"
                placeholderTextColor={colors.textSubtle}
                value={address.notes ?? ''}
                onChangeText={(value) =>
                  updateAddresses(
                    user.addresses.map((item) =>
                      item.id === address.id ? { ...item, notes: value } : item
                    )
                  )
                }
                style={styles.input}
                multiline
              />
              <Pressable
                onPress={() => updateAddresses(user.addresses.filter((item) => item.id !== address.id))}
              >
                <Text style={styles.removeText}>Rimuovi indirizzo</Text>
              </Pressable>
            </View>
          ))}
          <PrimaryButton
            label="AGGIUNGI INDIRIZZO"
            onPress={() =>
              updateAddresses([
                ...user.addresses,
                {
                  id: generateId('addr'),
                  street: '',
                  number: '',
                  zip: '',
                  city: '',
                  notes: ''
                }
              ])
            }
            variant="secondary"
          />
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Ruolo</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Ruolo attuale: {roleLabel}</Text>
            <Pressable onPress={() => setUserRole(role === 'user' ? 'operator' : 'user')}>
              <Text style={styles.switchText}>Cambia</Text>
            </Pressable>
          </View>
        </Card>
        <PrimaryButton label="LOGOUT" onPress={() => Alert.alert('Logout effettuato')} variant="secondary" />
        <PrimaryButton label="ELIMINA ACCOUNT" onPress={() => Alert.alert('Account eliminato')} variant="ghost" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  card: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm,
    letterSpacing: 1.2
  },
  text: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.bodyFont,
    borderWidth: 1,
    borderColor: colors.border
  },
  switchText: {
    color: colors.primary,
    fontFamily: typography.headingFont
  },
  addressBlock: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  removeText: {
    color: colors.danger,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  }
});
