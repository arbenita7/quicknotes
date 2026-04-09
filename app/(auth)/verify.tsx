import { View, Text, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function Verify() {
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email: string }>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        router.replace("/(tabs)")
      }
    }

    const interval = setInterval(checkUser, 2000)

    return () => clearInterval(interval)
  }, [])

  const resendEmail = async () => {
    if (!email) return

    setLoading(true)

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email as string,
    })

    if (error) alert(error.message)
    else alert("Email sent again!")

    setLoading(false)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Check your email 📧
      </Text>

      <Text style={{ color: "#666", marginBottom: 20 }}>
        Please verify your account ({email})
      </Text>

      <TouchableOpacity onPress={resendEmail}>
        <Text style={{ color: "#1e90ff" }}>
          {loading ? "Sending..." : "Resend email"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}