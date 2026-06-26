import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  header: { backgroundColor: '#1a1a2e', padding: 20, marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 16, fontFamily: 'Helvetica-Bold' },
  headerSub: { color: '#8888aa', fontSize: 9, marginTop: 4 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', borderBottomWidth: 2, borderBottomColor: '#1a1a2e', paddingBottom: 4, marginBottom: 8, marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: { flex: 1, backgroundColor: '#f8f8f8', padding: 10, borderRadius: 6, alignItems: 'center' },
  statNum: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
  statLabel: { fontSize: 7, color: '#666', marginTop: 2 },
  para: { fontSize: 9, lineHeight: 1.6, color: '#333' },
  highlightBox: { backgroundColor: '#f8f8f8', padding: 10, borderRadius: 6, marginBottom: 6 },
  highlightTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  small: { fontSize: 8, color: '#666' },
  row: { flexDirection: 'row', gap: 10, paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  footer: { borderTopWidth: 2, borderTopColor: '#1a1a2e', paddingTop: 12, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
})

export function ReportDocument({ report, profile, content }: {
  report: { title: string; startDate: string; endDate: string; sections: unknown }
  profile: { name: string; email: string; position: string; company: string } | null
  content: Record<string, unknown>
}) {
  const sections = report.sections as string[]
  const summary = content.summary as { feature_count: number; bugfix_count: number; improvement_count: number; chore_count: number; systems_updated: string[] } | undefined

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{report.title}</Text>
          <Text style={styles.headerSub}>{profile?.company || ''} · Periode: {report.startDate} – {report.endDate}</Text>
        </View>

        {sections.includes('highlight_stats') && summary != null && (
          <View style={styles.statsRow}>
            {[
              { label: 'Fitur Baru', value: summary.feature_count },
              { label: 'Bug Diperbaiki', value: summary.bugfix_count },
              { label: 'Peningkatan', value: summary.improvement_count },
              { label: 'Pemeliharaan', value: summary.chore_count },
            ].map(({ label, value }) => (
              <View key={label} style={styles.statBox}>
                <Text style={styles.statNum}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.includes('executive_summary') && content.executive_summary != null && (
          <View>
            <Text style={styles.sectionTitle}>Ringkasan Eksekutif</Text>
            <Text style={styles.para}>{content.executive_summary as string}</Text>
          </View>
        )}

        {sections.includes('key_highlights') && Array.isArray(content.key_highlights) && (
          <View>
            <Text style={styles.sectionTitle}>Pencapaian Utama</Text>
            {(content.key_highlights as { title: string; system: string; description: string }[]).map((h, i) => (
              <View key={i} style={styles.highlightBox}>
                <Text style={styles.highlightTitle}>{i + 1}. {h.title}</Text>
                <Text style={styles.small}>{h.system}</Text>
                <Text style={[styles.para, { marginTop: 2 }]}>{h.description}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.includes('issues_resolved') && Array.isArray(content.issues_resolved) && (
          <View>
            <Text style={styles.sectionTitle}>Permasalahan Terselesaikan</Text>
            {(content.issues_resolved as { number: number; description: string; system: string; resolved_date: string }[]).map((issue, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1a1a2e', width: 20 }}>#{issue.number || i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.para}>{issue.description}</Text>
                  <Text style={styles.small}>{issue.system} · {issue.resolved_date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sections.includes('weekly_summary') && Array.isArray(content.weekly_summary) && (
          <View>
            <Text style={styles.sectionTitle}>Ringkasan Mingguan</Text>
            {(content.weekly_summary as { week: string; period: string; focus: string; summary: string; status: string }[]).map((week, i) => (
              <View key={i} style={[styles.highlightBox, { marginBottom: 4 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={styles.highlightTitle}>{week.week} — {week.focus}</Text>
                  <Text style={[styles.small, { color: '#166534' }]}>{week.status}</Text>
                </View>
                <Text style={styles.small}>{week.period}</Text>
                <Text style={[styles.para, { marginTop: 2 }]}>{week.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.includes('future_plans') && Array.isArray(content.future_plans) && (
          <View>
            <Text style={styles.sectionTitle}>Rencana ke Depan</Text>
            {(content.future_plans as { priority: string; title: string; description: string; expected_benefit: string }[]).map((plan, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ fontSize: 8, color: plan.priority === 'High' ? '#dc2626' : plan.priority === 'Medium' ? '#d97706' : '#666', width: 40 }}>{plan.priority}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.para, { fontFamily: 'Helvetica-Bold' }]}>{plan.title}</Text>
                  <Text style={styles.para}>{plan.description}</Text>
                  <Text style={styles.small}>Manfaat: {plan.expected_benefit}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sections.includes('developer_info') && (
          <View style={styles.footer}>
            <View>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{profile?.name || ''}</Text>
              <Text style={styles.small}>{profile?.position || ''}</Text>
              <Text style={styles.small}>{profile?.email || ''}</Text>
            </View>
            {summary?.systems_updated && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.small}>Sistem:</Text>
                {summary.systems_updated.map((s, i) => <Text key={i} style={[styles.small, { color: '#1a1a2e' }]}>{s}</Text>)}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
