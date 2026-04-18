import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Stats() {
  const { user } = useAuth();

  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [streak, setStreak] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const now = new Date();

    
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();

    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

   
    const { count: totalCount } = await supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: todayCount } = await supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfToday);

    const { count: weekCount } = await supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString());

    const { count: monthCount } = await supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthAgo.toISOString());

    const { data } = await supabase
      .from("notes")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (data) {
      const dates = data.map(
        (n) => new Date(n.created_at).toISOString().split("T")[0]
      );

      
      let streakCount = 0;
      let current = new Date();

      while (true) {
        const d = current.toISOString().split("T")[0];

        if (dates.includes(d)) {
          streakCount++;
          current.setDate(current.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(streakCount);

      const last7Days: number[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const dStr = d.toISOString().split("T")[0];

        const count = dates.filter((x) => x === dStr).length;
        last7Days.push(count);
      }

      setChartData(last7Days);
    }

    setTotal(totalCount || 0);
    setToday(todayCount || 0);
    setWeek(weekCount || 0);
    setMonthly(monthCount || 0);
  };

  return (
    <ScrollView style={styles.container}>
        {Platform.OS === "web" && <Header />}
      <Text style={styles.title}>Your Stats</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Notes</Text>
        <Text style={styles.value}>{total}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Today</Text>
        <Text style={styles.value}>{today}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>This Week</Text>
        <Text style={styles.value}>{week}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.value}>{monthly}</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.label}>🔥 Streak</Text>
        <Text style={styles.value}>{streak} days</Text>
      </View>

      <Text style={styles.subtitle}>Last 7 Days</Text>

      {chartData.length > 0 && (
        <LineChart
          data={{
            labels: ["-6", "-5", "-4", "-3", "-2", "-1", "Today"],
            datasets: [{ data: chartData }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#020617",
            backgroundGradientTo: "#020617",
            decimalPlaces: 0,
            color: () => "#3b82f6",
            labelColor: () => "#94a3b8",
          }}
          style={{ borderRadius: 16 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060b16',
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    marginTop: 20
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 5,
  },
});