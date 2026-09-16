import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Plan } from "@/data/planes";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  titulo: { fontSize: 18, marginBottom: 4, color: "#065f46" },
  subtitulo: { fontSize: 10, color: "#57534e", marginBottom: 16 },
  dia: { marginBottom: 12 },
  diaTitulo: { fontSize: 13, marginBottom: 6, fontWeight: 700 },
  tiempo: { marginBottom: 6, paddingLeft: 8 },
  tiempoTitulo: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  item: { flexDirection: "row", justifyContent: "space-between", paddingLeft: 8 },
  pie: { marginTop: 24, fontSize: 9, color: "#78716c" },
});

export function PlanPDF({ plan }: { plan: Plan }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.titulo}>NutriNani — {plan.nombre}</Text>
        <Text style={styles.subtitulo}>
          {plan.objetivo_kcal ? `Objetivo: ${plan.objetivo_kcal} kcal/día · ` : ""}
          Generado el {new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}
        </Text>

        {(plan.plan_dias ?? []).map((dia) => (
          <View key={dia.id} style={styles.dia}>
            <Text style={styles.diaTitulo}>{dia.etiqueta ?? `Día ${dia.numero_dia}`}</Text>
            {dia.plan_tiempos.map((tiempo) => (
              <View key={tiempo.id} style={styles.tiempo}>
                <Text style={styles.tiempoTitulo}>{tiempo.nombre}</Text>
                {tiempo.plan_items.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <Text>{item.alimento?.nombre ?? item.receta?.nombre ?? "—"}</Text>
                    <Text>{item.cantidad_gramos} g</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        {plan.recomendaciones && (
          <View>
            <Text style={styles.diaTitulo}>Recomendaciones</Text>
            <Text>{plan.recomendaciones}</Text>
          </View>
        )}

        <Text style={styles.pie}>
          Este documento fue generado por NutriNani para uso exclusivo del paciente. Consulta cualquier duda con tu
          nutrióloga antes de modificar el plan.
        </Text>
      </Page>
    </Document>
  );
}
