import Header from '@/components/Header'
import { Platform, StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>

      {Platform.OS === 'web' && <Header />}

      <View style={styles.title}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>📘 </Text>

          <Text style={styles.subtitle}>
            QuickNotes është një aplikacion modern dhe i thjeshtë
            për të menaxhuar shënimet e tua personale, idetë kreative
            dhe gjërat e rëndësishme të përditshme.
          </Text>
        </View>

       
      </View>

     
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Pse QuickNotes?</Text>
        <Text style={styles.cardText}>• Shkruaj shënime në çdo moment</Text>
        <Text style={styles.cardText}>• Ruajtje automatike - asgjë nuk humbet</Text>
        <Text style={styles.cardText}>• Interfaqe e pastër dhe e shpejtë</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Si funksionon?</Text>
        <Text style={styles.cardText}>
          Çdo shënim që krijon ruhet automatikisht
          në pajisjen tënde. Nuk ke nevojë për login
          apo internet.
        </Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Platforma</Text>
        <Text style={styles.cardText}>• Android</Text>
        <Text style={styles.cardText}>• Web Browser</Text>
        <Text style={styles.cardText}>
          Të njëjtat shënime, përvojë e njëjtë.
        </Text>
      </View>

      <Text style={styles.footer}>
        👉 Hap tab-in 📝 Notes për të filluar të shkruash
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#060b16',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 12,
    marginTop: 40
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#cbd5f5',
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 6,
  },

  cardText: {
    fontSize: 15,
    color: '#cbd5f5',
    marginBottom: 4,
  },

  footer: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 24,
    fontSize: 14,
  },
})